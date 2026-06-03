import { createReducer, on } from "@ngrx/store";
import { setSidenavOpened } from "./app-config.actions";

export interface AppConfigState {
//   theme: 'light' | 'dark';
  sidenavOpened: boolean;
}

export const initialAppConfigState: AppConfigState = {
//   theme: 'light',
  sidenavOpened: true
};
export const appConfigReducer = createReducer(
  initialAppConfigState,

  on(setSidenavOpened, (state, { opened }) => ({
    ...state,
    sidenavOpened: opened,
  }))
);