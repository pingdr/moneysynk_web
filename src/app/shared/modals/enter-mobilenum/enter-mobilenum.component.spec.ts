import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterMobilenumComponent } from './enter-mobilenum.component';

describe('EnterMobilenumComponent', () => {
  let component: EnterMobilenumComponent;
  let fixture: ComponentFixture<EnterMobilenumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterMobilenumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterMobilenumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
