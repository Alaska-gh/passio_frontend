import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Bus, User } from '@core/interfaces';
import { BusService } from '@core/services/bus.service';
import { UPDATE_BUS } from '@core/store/buses/buses.actions';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-sign-off-modal',
  imports: [CommonModule, ReactiveFormsModule, SelectModule, ButtonModule, FormsModule],
  templateUrl: './sign-off-modal.html',
  styleUrl: './sign-off-modal.css',
})
export class SignOffModal {
  bus: Bus | null = null;
  drivers: User[] = [];
  selectedDriverId: string | null = null;
  loading = false;
  saving = false;


  constructor(
    private store: Store,
    private busService: BusService,
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig,
  ) {}

  ngOnInit(): void {
    this.bus = this.dialogConfig.data?.bus ?? null;
    this.loadDrivers();
  }

  private loadDrivers(): void {
    this.loading = true;
    this.busService.getDrivers().subscribe({
      next: (drivers) => {
        // Exclude current driver from list
        this.drivers = drivers.filter(d => d.uid !== this.bus?.assignedDriverId);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  confirm(): void {
    if (!this.selectedDriverId || !this.bus) return;
    const newDriver = this.drivers.find(d => d.uid === this.selectedDriverId);
    if (!newDriver) return;

    this.saving = true;
    this.store.dispatch(UPDATE_BUS({
      busId: this.bus.id,
      updates: {
        assignedDriverId: newDriver.uid,
        assignedDriverName: `${newDriver.name}`,
      }
    }));

    this.dialogRef.close(newDriver);
  }

  cancel(): void { this.dialogRef.close(null); }
}
