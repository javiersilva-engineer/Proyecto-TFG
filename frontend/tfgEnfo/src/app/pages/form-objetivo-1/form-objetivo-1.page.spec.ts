import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormObjetivo1Page } from './form-objetivo-1.page';

describe('FormObjetivo1Page', () => {
  let component: FormObjetivo1Page;
  let fixture: ComponentFixture<FormObjetivo1Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormObjetivo1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
