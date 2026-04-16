import { Store } from '@ngrx/store';
import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthActions } from '@core/store/auth/auth.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('passio_fronten');

  private store = inject(Store);

  ngOnInit(): void {
    // this.store.dispatch(AuthActions.loadProfile());
  }
}
