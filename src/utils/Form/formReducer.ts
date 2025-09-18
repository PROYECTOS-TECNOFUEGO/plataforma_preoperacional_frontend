// src/utils/formReducer.ts
import { initialState } from "./formState";
import type { FormState, GroupValues } from "./formState";

export type Action =
  | { type: "SET_FIELD"; field: keyof FormState; value: any }
  | { type: "SET_GROUP"; group: keyof FormState; item: string; value: string }
  | { type: "SET_ALL"; payload: Partial<FormState> }
  | { type: "RESET" };

export function formReducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value } as FormState;
    case "SET_GROUP":
      return {
        ...state,
        [action.group]: {
          ...(state[action.group] as GroupValues),
          [action.item]: action.value,
        },
      } as FormState;
    case "SET_ALL":
      return { ...state, ...(action.payload || {}) } as FormState;
    case "RESET":
      return initialState;
    default:
      return state;
  }
}
