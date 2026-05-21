import { ToastSeverity } from "@core/interfaces/primeng-severity.enums";
import { createAction, props } from "@ngrx/store";

export const SHOW_TOAST = createAction(
  '[Toast] Show Toast',
  props<{
    severity?: ToastSeverity;
    title: string;
    message: string;
    navigateTo?: string;
    sticky?: boolean;
    life?: number;
  }>()
);