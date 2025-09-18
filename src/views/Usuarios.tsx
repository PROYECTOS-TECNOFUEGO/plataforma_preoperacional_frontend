import React, { useState, useMemo, useCallback, useEffect } from "react";
import type { FC } from "react";
import {
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Card,
  Typography,
  TextField,
  InputAdornment,
  Icon,
  IconButton,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import PageContainer from "../components/PageContainer";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import LoadingBackdrop from "../components/LoadingBackdrop";
import { useSnackbar } from "../components/SnackbarProvider";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_USERS,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER,
} from "../graphql/usuarios";

// -------------------- Tipos --------------------
interface UserItem {
  id?: number | string;
  username: string;
  password?: string;
  rol: string;
}

// -------------------- Modal independiente --------------------
const UserModal: FC<{
  open: boolean;
  mode: "create" | "edit";
  initialUser: UserItem | null;
  onClose: () => void;
  onSave: (user: UserItem) => Promise<void> | void;
}> = ({ open, mode, initialUser, onClose, onSave }) => {
  // estado local del formulario (aislado del padre)
  const [form, setForm] = useState<UserItem>({
    username: "",
    password: "",
    rol: "CONDUCTOR",
  });

  // cuando se abre el modal o cambia el initialUser, sincronizamos el state local
  useEffect(() => {
    if (open) {
      setForm(
        initialUser
          ? { ...initialUser, password: initialUser.password ?? "" }
          : { username: "", password: "", rol: "CONDUCTOR" }
      );
    }
  }, [open, initialUser]);

  const handleSave = async () => {
    await onSave(form);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      // keepMounted puede ayudar si quieres mantener el DOM cuando se cierra
      keepMounted
    >
      <DialogTitle sx={{ pb: 2 }}>
        {mode === "edit" ? "Editar usuario" : "Agregar usuario"}
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* autoFocus para garantizar que el foco vaya al input y evitar warning aria-hidden */}
        <TextField
          label="Usuario"
          fullWidth
          sx={{ mt: 1 }}
          value={form.username}
          disabled={mode === "edit"}
          autoFocus
          onChange={(e) => setForm((s) => ({ ...s, username: e.target.value }))}
        />
        <TextField
          label="Contraseña"
          fullWidth
          type="password"
          value={form.password}
          onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
          autoComplete="new-password"
        />
        <FormControl fullWidth>
          <InputLabel id="rol-label">Rol</InputLabel>
          <Select
            labelId="rol-label"
            value={form.rol}
            onChange={(e) =>
              setForm((s) => ({
                ...s,
                rol: (e.target.value as string).toUpperCase(),
              }))
            }
          >
            <MenuItem value="ADMIN">Administrador</MenuItem>
            <MenuItem value="CONDUCTOR">Conductor</MenuItem>
            <MenuItem value="SUPERVISOR">Supervisor</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {mode === "edit" ? "Guardar cambios" : "Agregar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// -------------------- Lista de usuarios memoizada --------------------
const UserList: FC<{
  usuarios: UserItem[];
  isMobile: boolean;
  onEdit: (u: UserItem) => void;
  onDelete: (id?: number | string) => void;
}> = React.memo(({ usuarios, isMobile, onEdit, onDelete }) => {
  return (
    <>
      {usuarios.map((usuario, idx) => (
        <Box key={`${usuario.id ?? idx}-${idx}`}>
          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            justifyContent="space-between"
            alignItems={isMobile ? "flex-start" : "center"}
            py={1.5}
            gap={1.5}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Icon sx={{ color: "#555" }}>person</Icon>
              <Box>
                <Typography variant="subtitle1" fontWeight={500}>
                  {usuario.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rol: {usuario.rol}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" gap={1}>
              <IconButton
                aria-label={`Editar ${usuario.username}`}
                onClick={() => onEdit(usuario)}
              >
                <Icon>edit</Icon>
              </IconButton>
              <IconButton
                aria-label={`Eliminar ${usuario.username}`}
                onClick={() => onDelete(usuario.id)}
              >
                <Icon color="error">delete</Icon>
              </IconButton>
            </Box>
          </Box>
          {idx !== usuarios.length - 1 && <Divider sx={{ ml: 5 }} />}
        </Box>
      ))}
    </>
  );
});

// -------------------- Componente principal --------------------
const UsuariosPage: FC = () => {
  const [busqueda, setBusqueda] = useState("");

  // estado del modal y user inicial (solo meta-data, no form completo)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [modalInitialUser, setModalInitialUser] = useState<UserItem | null>(
    null
  );

  const { enqueue } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  interface GetUsersData {
    allUsers: { nodes: UserItem[] };
  }

  // query sencilla
  const { data, loading, error, refetch } = useQuery<GetUsersData>(GET_USERS, {
    // evita re-fetches extra; ajusta políticas si necesitas cache-first etc.
    fetchPolicy: "cache-first",
  });

  const [createUser] = useMutation(CREATE_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  // debug: solo loguea cuando data cambia
  useEffect(() => {
    console.log("GET_USERS data:", data);
    if (error) console.error("GET_USERS error:", error);
  }, [data, error]);

  // datos crudos
  const usuariosRaw = data?.allUsers?.nodes || [];

  // map + normalización memoizada (solo se recalcula cuando cambia usuariosRaw)
  const usuarios = useMemo(() => {
    return usuariosRaw.map((u) => ({
      ...u,
      id: u.id,
      username: u.username ?? "",
      password: (u as any).password ?? "",
      rol: (u.rol ?? "").toString(),
    }));
  }, [usuariosRaw]);

  // filtro memorizado
  const usuariosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return usuarios;
    const term = busqueda.toLowerCase();
    return usuarios.filter(
      (u) =>
        u.username.toLowerCase().includes(term) ||
        u.rol.toLowerCase().includes(term)
    );
  }, [busqueda, usuarios]);

  // ---------- handlers memoizados para evitar crear funciones nuevas cada render ----------
  const abrirModalCrear = useCallback(() => {
    // blur del elemento activo **antes** de abrir el modal para evitar el warning aria-hidden
    (document.activeElement as HTMLElement | null)?.blur();
    setModalInitialUser({ username: "", password: "", rol: "CONDUCTOR" });
    setModalMode("create");
    setModalOpen(true);
  }, []);

  const abrirModalEditar = useCallback((usuario: UserItem) => {
    (document.activeElement as HTMLElement | null)?.blur();
    setModalInitialUser({ ...usuario, rol: usuario.rol.toUpperCase() });
    setModalMode("edit");
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleSave = useCallback(
    async (user: UserItem) => {
      try {
        if (modalMode === "edit" && user.id != null) {
          await updateUser({
            variables: {
              id: Number(user.id),
              username: user.username,
              password: user.password,
              rol: user.rol,
            },
          });
          enqueue("Usuario actualizado", "success");
        } else {
          await createUser({
            variables: {
              username: user.username,
              password: user.password,
              rol: user.rol.toUpperCase(),
            },
          });
          enqueue("Usuario creado", "success");
        }

        setModalOpen(false);
        await refetch();
      } catch (err) {
        console.error("Guardar usuario error:", err);
        enqueue("Error al guardar usuario", "error");
      }
    },
    [createUser, updateUser, enqueue, refetch, modalMode]
  );

  const eliminarUsuario = useCallback(
    async (id?: number | string) => {
      if (id == null || !confirm("¿Seguro que deseas eliminar este usuario?"))
        return;
      try {
        await deleteUser({ variables: { id: Number(id) } });
        enqueue("Usuario eliminado", "success");
        await refetch();
      } catch (err) {
        console.error("Eliminar usuario error:", err);
        enqueue("Error al eliminar usuario", "error");
      }
    },
    [deleteUser, enqueue, refetch]
  );

  // opcional: debug colapsable para evitar costoso JSON.stringify en cada render
  const [debugOpen, setDebugOpen] = useState(false);
  const usuariosRawString = useMemo(
    () => JSON.stringify(usuariosRaw, null, 2),
    [usuariosRaw]
  );

  return (
    <PageContainer>
      <PageHeader
        title="Usuarios"
        actions={
          <>
            <TextField
              placeholder="Buscar por usuario o rol"
              size="small"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon>search</Icon>
                    </InputAdornment>
                  ),
                  "aria-label": "Buscar usuarios",
                },
              }}
              sx={{ width: { xs: "100%", sm: 280 } }}
            />
            <Button onClick={abrirModalCrear} startIcon={<Icon>add</Icon>}>
              Agregar
            </Button>
          </>
        }
      />

      <Card sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        <Box
          sx={{
            border: "1px solid #eee",
            borderRadius: 2,
            maxHeight: "50vh",
            overflowY: "auto",
            px: 2,
            py: 1,
          }}
        >
          {loading ? (
            <LoadingBackdrop open={true} />
          ) : usuariosFiltrados.length === 0 ? (
            <>
              <EmptyState text="No se encontraron usuarios." />
              {/* DEBUG colapsable y memoizado */}
              <Box sx={{ mt: 2 }}>
                <Button size="small" onClick={() => setDebugOpen((s) => !s)}>
                  {debugOpen ? "Ocultar debug" : "Mostrar debug"}
                </Button>
                {debugOpen && (
                  <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>
                    {usuariosRawString}
                  </pre>
                )}
              </Box>
            </>
          ) : (
            <UserList
              usuarios={usuariosFiltrados}
              isMobile={isMobile}
              onEdit={abrirModalEditar}
              onDelete={eliminarUsuario}
            />
          )}
        </Box>
      </Card>

      {/* Modal (aislado, no hace re-render del padre cuando se escribe) */}
      <UserModal
        open={modalOpen}
        mode={modalMode}
        initialUser={modalInitialUser}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
    </PageContainer>
  );
};

export default UsuariosPage;
