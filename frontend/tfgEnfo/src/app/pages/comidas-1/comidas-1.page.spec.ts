import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Comidas1Page } from './comidas-1.page';

describe('Comidas1Page', () => {
  let component: Comidas1Page;
  let fixture: ComponentFixture<Comidas1Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Comidas1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
