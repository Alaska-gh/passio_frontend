import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignOffModal } from './sign-off-modal';

describe('SignOffModal', () => {
  let component: SignOffModal;
  let fixture: ComponentFixture<SignOffModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignOffModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignOffModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
