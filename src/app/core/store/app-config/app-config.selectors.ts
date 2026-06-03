import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppConfigState } from "./app-config.reducers";

export const appConfigStateKey: string = 'appConfig';
export const selectAppConfig = createFeatureSelector<AppConfigState>(appConfigStateKey);


export const selectSidenavOpened = createSelector(
  selectAppConfig,
  state => state.sidenavOpened
);