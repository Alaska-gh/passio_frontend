import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Bus } from '@core/interfaces';
import { ADD_BUS, UPDATE_BUS } from '@core/store/buses/buses.actions';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-add-edit-bus-modal',
    imports: [CommonModule, ReactiveFormsModule, InputTextModule, SelectModule, ButtonModule],
  templateUrl: './add-edit-bus-modal.html',
  styleUrl: './add-edit-bus-modal.css',
})
export class AddEditBusModal {
  busForm!: FormGroup;
  isEditing = false;
  busTypes = [
    { label: 'Normal', value: 'normal' },
    { label: 'Express', value: 'express' },
    { label: 'VIP', value: 'vip' },
  ];

   constructor(
    private fb: FormBuilder,
    private store: Store,
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig,
  ) {}


  ngOnInit(): void {
    const existing: Bus | undefined = this.dialogConfig.data;
    this.isEditing = !!existing;

    this.busForm = this.fb.group({
      plateNumber: [existing?.plateNumber ?? '', Validators.required],
      busType: [existing?.busType ?? 'normal', Validators.required],
      capacity: [existing?.capacity ?? '', [Validators.required, Validators.min(1)]],
      driverId: [existing?.assignedDriverId ?? ''],
    });
  }

  save(): void {
    if (this.busForm.invalid) { this.busForm.markAllAsTouched(); return; }
    if (this.isEditing) {
      this.store.dispatch(UPDATE_BUS({
        busId: this.dialogConfig.data.id,
        updates: this.busForm.value
      }));
    } else {
      this.store.dispatch(ADD_BUS({ bus: this.busForm.value }));
    }
    this.dialogRef.close(true);
  }

  cancel(): void { this.dialogRef.close(false); }
}
