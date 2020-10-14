import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyMobileOtpComponent } from './verify-mobile-otp.component';

describe('VerifyMobileOtpComponent', () => {
  let component: VerifyMobileOtpComponent;
  let fixture: ComponentFixture<VerifyMobileOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyMobileOtpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyMobileOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
