import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-customer-home.componet',
  imports: [ButtonModule, CardModule, CommonModule],
  templateUrl: './customer-home.componet.html',
  styleUrl: './customer-home.componet.css',
})
export class CustomerHomeComponet {
  buses = [
    {
      busType: 'Air Conditioned Buss',
      totalSeats: 14,
      availableSeats: 14,
      price: 56,
      carNumber: 'ER 285 - 23'
    },
    {
      busType: 'Normal Bus',
      totalSeats: 14,
      availableSeats: 14,
      price: 50,
      carNumber: 'ER 426 - 24'
    },
    {
      busType: 'Express Buss',
      totalSeats: 14,
      availableSeats: 14,
      price: 60,
      carNumber: 'ER 1452 - 21'
    }
  ]
}
