import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignOnModal } from './sign-on-modal';

describe('SignOnModal', () => {
  let component: SignOnModal;
  let fixture: ComponentFixture<SignOnModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignOnModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignOnModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
