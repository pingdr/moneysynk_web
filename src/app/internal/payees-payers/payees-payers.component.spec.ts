import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayeesPayersComponent } from './payees-payers.component';

describe('PayeesPayersComponent', () => {
  let component: PayeesPayersComponent;
  let fixture: ComponentFixture<PayeesPayersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayeesPayersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayeesPayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
