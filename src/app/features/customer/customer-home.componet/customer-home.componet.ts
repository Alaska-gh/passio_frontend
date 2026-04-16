import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-customer-home.componet',
  imports: [Button],
  templateUrl: './customer-home.componet.html',
  styleUrl: './customer-home.componet.css',
})
export class CustomerHomeComponet {
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
