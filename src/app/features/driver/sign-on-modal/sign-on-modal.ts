import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '@core/interfaces';
import { Bus, BusRequest } from '@core/interfaces/bus.interface';
import { BusService } from '@core/services/bus.service';
import { selectCurrentUser } from '@core/store/auth/auth.selectors';
import { selectAllBuses } from '@core/store/buses/buses.selector';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { filter, take, tap } from 'rxjs';

type Step = 'search' | 'bus-found' | 'bus-taken' | 'bus-not-found' | 'new-bus-form' | 'pending';


@Component({
  selector: 'app-sign-on-modal',
   imports: [CommonModule, FormsModule, ReactiveFormsModule,
    ButtonModule, InputTextModule, SelectModule, TagModule],
  templateUrl: './sign-on-modal.html',
  styleUrl: './sign-on-modal.css',
})
export class SignOnModal {
  step: Step = 'search';
  searchPlate = '';
  foundBus: Bus | null = null;
  searching = false;
  signingOn = false;
  submitting = false;
  currentUser: User | null = null;

  allBuses$ = this.store.select(selectAllBuses);

  busTypes = [
    { label: 'Normal', value: 'normal' },
    { label: 'Express', value: 'express' },
    { label: 'VIP', value: 'vip' },
  ];

  busRequestForm!: FormGroup;

    constructor(
    private store: Store,
    private fb: FormBuilder,
    private busService: BusService,
    private dialogRef: DynamicDialogRef,
  ) {}

  ngOnInit(): void {
    this.store.select(selectCurrentUser).pipe(
      filter((u): u is User => u !== null),
      take(1),
      tap(u => this.currentUser = u)
    ).subscribe();

  this.busRequestForm = this.fb.group({
    plateNumber: [this.searchPlate.toUpperCase(), Validators.required],
    busType: ['normal', Validators.required],
    capacity: ['', [Validators.required, Validators.min(1)]],
  });
  }

  searchBus(): void {
    if (!this.searchPlate.trim()) return;
    this.searching = true;

    this.busService.searchBusByPlate(this.searchPlate).subscribe({
      next: (bus) => {
        this.searching = false;
        if (!bus) {
          this.step = 'bus-not-found';
          return;
        }
        this.foundBus = bus;
        this.step = bus.driverId ? 'bus-taken' : 'bus-found';
      },
      error: () => { this.searching = false; }
    });
  }

  selectBusFromList(bus: Bus): void {
    this.foundBus = bus;
    this.searchPlate = bus.plateNumber;
    this.step = bus.driverId ? 'bus-taken' : 'bus-found';
  }

  signOn(): void {
    if (!this.foundBus || !this.currentUser) return;
    this.signingOn = true;

    const driverName = `${this.currentUser.name}`;
    this.busService.signOnToBus(this.foundBus.id, this.currentUser.uid, driverName).subscribe({
      next: () => {
        this.signingOn = false;
        this.dialogRef.close(true);
      },
      error: (err) => { 
        console.log(err);
        
        this.signingOn = false; }
    });
  }

  submitRequest(): void {
    if (this.busRequestForm.invalid || !this.currentUser) return;
    this.submitting = true;

    const driverName = `${this.currentUser.name}`;
    const request: Omit<BusRequest, 'id'> = {
      ...this.busRequestForm.value,
      plateNumber: this.busRequestForm.value.plateNumber.toUpperCase(),
      driverId: this.currentUser.uid,
      driverName,
      status: 'pending',
      requestedAt: new Date(),
    };

    this.busService.submitBusRequest(request).subscribe({
      next: () => {
        this.submitting = false;
        this.step = 'pending';
      },
      error: (error) => { 
        console.log('[Component] Error',error);
        
        this.submitting = false; }
    });
  }

  cancel(): void { this.dialogRef.close(false); }

}
