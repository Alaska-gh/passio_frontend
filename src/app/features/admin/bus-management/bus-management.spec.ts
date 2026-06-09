import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusManagement } from './bus-management';

describe('BusManagement', () => {
  let component: BusManagement;
  let fixture: ComponentFixture<BusManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
