import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCategoryPopupComponent } from './add-category-popup.component';

describe('AddCategoryPopupComponent', () => {
  let component: AddCategoryPopupComponent;
  let fixture: ComponentFixture<AddCategoryPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCategoryPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCategoryPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
