import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerRoutesComponent } from './customer-routes.component';

describe('CustomerRoutesComponent', () => {
  let component: CustomerRoutesComponent;
  let fixture: ComponentFixture<CustomerRoutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerRoutesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
