import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverQueue } from './driver-queue';

describe('DriverQueue', () => {
  let component: DriverQueue;
  let fixture: ComponentFixture<DriverQueue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverQueue]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverQueue);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
