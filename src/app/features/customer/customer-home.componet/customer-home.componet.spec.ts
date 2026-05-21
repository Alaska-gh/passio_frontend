import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerHomeComponet } from './customer-home.componet';

describe('CustomerHomeComponet', () => {
  let component: CustomerHomeComponet;
  let fixture: ComponentFixture<CustomerHomeComponet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerHomeComponet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerHomeComponet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
