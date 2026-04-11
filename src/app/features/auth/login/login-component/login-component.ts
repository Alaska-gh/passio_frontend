import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-login-component',
  imports: [FormsModule, SelectButtonModule, ButtonModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  authenticationOptions = [
    { label: 'Sign In', value: 'sign_in' },
    { label: 'Signup', value: 'sign_up' },
  ];

  value: string = 'sign_in';
}
