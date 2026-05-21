import { Store } from '@ngrx/store';
import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthActions } from '@core/store/auth/auth.actions';
import { HeaderComponent } from '@core/header/header.component/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
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
