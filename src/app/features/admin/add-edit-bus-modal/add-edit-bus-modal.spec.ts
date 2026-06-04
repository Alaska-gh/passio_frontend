import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBusModal } from './add-edit-bus-modal';

describe('AddEditBusModal', () => {
  let component: AddEditBusModal;
  let fixture: ComponentFixture<AddEditBusModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditBusModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditBusModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
