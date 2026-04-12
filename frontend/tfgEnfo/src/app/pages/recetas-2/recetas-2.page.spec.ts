import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Recetas2Page } from './recetas-2.page';

describe('Recetas2Page', () => {
  let component: Recetas2Page;
  let fixture: ComponentFixture<Recetas2Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Recetas2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
