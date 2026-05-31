import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { SHOW_TOAST } from './toast.actions';
import { ToastSeverity } from '@core/interfaces/primeng-severity.enums';
import { MessageService } from 'primeng/api';
import { ToastMessage } from '@core/interfaces/toastMessage.interface';

@Injectable()
export class ToastEffects {

  showToast$ = createEffect(() => this.actions$.pipe(
    ofType(SHOW_TOAST),
    tap(action => {
        console.log('toast action dispatched');
        
      const toastOptions: ToastMessage = {
        severity: action.severity ?? ToastSeverity.INFO,
        summary: action.title,
        detail: action.message,
        sticky: action.sticky ?? false,
        life: action.life ?? 7000   // Default: 7 seconds
      };

      this.messageService.add(toastOptions);

      // Check if navigateTo property is provided and navigate
      if (action.navigateTo) {
        this.router.navigate(['/']).then(() => {
          this.router.navigate([action.navigateTo],);
        });
      }
    })
  ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private messageService: MessageService,
    private router: Router
  ) { }
}
