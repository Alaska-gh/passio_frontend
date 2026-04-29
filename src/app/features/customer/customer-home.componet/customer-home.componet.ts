import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-customer-home.componet',
  imports: [Button, RouterOutlet, CardModule],
  templateUrl: './customer-home.componet.html',
  styleUrl: './customer-home.componet.css',
})
export class CustomerHomeComponet {}
