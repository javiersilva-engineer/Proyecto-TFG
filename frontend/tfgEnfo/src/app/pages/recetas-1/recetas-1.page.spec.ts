import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Recetas1Page } from './recetas-1.page';

describe('Recetas1Page', () => {
  let component: Recetas1Page;
  let fixture: ComponentFixture<Recetas1Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Recetas1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
