import { createAction, props } from "@ngrx/store";

export const setSidenavOpened = createAction(
  '[App Config] Set Sidenav Opened',
  props<{ opened: boolean }>()
);