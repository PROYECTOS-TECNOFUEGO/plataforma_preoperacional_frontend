import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers {
    allUsers {
      nodes {
        id
        username
        rol
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation ($username: String!, $password: String!, $rol: RolEnum!) {
    createUser(
      input: { user: { username: $username, password: $password, rol: $rol } }
    ) {
      user {
        id
        username
        rol
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation ($id: Int!, $username: String, $password: String, $rol: RolEnum) {
    updateUserById(
      input: {
        id: $id
        userPatch: { username: $username, password: $password, rol: $rol }
      }
    ) {
      user {
        id
        username
        rol
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation ($id: Int!) {
    deleteUserById(input: { id: $id }) {
      deletedUserId
    }
  }
`;
