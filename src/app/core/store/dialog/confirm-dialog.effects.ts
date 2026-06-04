import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ConfirmationService } from 'primeng/api';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { OPEN_CONFIRM_DIALOG } from './confirm-dialog.actions';
import { getConfirmDialogConfig } from '@core/interfaces/confirm-dialog-config-helper';

@Injectable()
export class ConfirmDialogEffects {
  constructor(
    private store: Store,
    private actions$: Actions,
    private confirmationService: ConfirmationService,
  ) { }

  openConfirmDialog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OPEN_CONFIRM_DIALOG),
      tap(({ message, header, confirmType, acceptLabel, rejectLabel, acceptAction, rejectAction, invertButtons, acceptMethod, rejectMethod }) => {
        const config = getConfirmDialogConfig(confirmType);

        this.confirmationService.confirm({
          header,
          icon: config.icon,
          message,
          acceptIcon: 'none',
          rejectIcon: 'none',
          acceptLabel: invertButtons ? (rejectLabel ?? 'Cancel') : (acceptLabel ?? 'Proceed'),
          rejectLabel: invertButtons ? (acceptLabel ?? 'Proceed') : (rejectLabel ?? 'Cancel'),
          acceptButtonStyleClass: config.acceptButtonStyleClass,
          rejectButtonStyleClass: 'p-button-text p-button-secondary',
          accept: async () => {
            const action = invertButtons ? rejectAction : acceptAction;
            if (Array.isArray(action)) {
              action.forEach((a) => this.store.dispatch(a));
            } else if (action) {
              this.store.dispatch(action);
            }

            if (acceptMethod) {
              await acceptMethod();
            }
          },
          reject: async () => {
            const action = invertButtons ? acceptAction : rejectAction;
            if (Array.isArray(action)) {
              action.forEach((a) => this.store.dispatch(a));
            } else if (action) {
              this.store.dispatch(action);
            }

            if (rejectMethod) {
              await rejectMethod();
            }
          }
        });
      })
    ),
    { dispatch: false }
  );
}
