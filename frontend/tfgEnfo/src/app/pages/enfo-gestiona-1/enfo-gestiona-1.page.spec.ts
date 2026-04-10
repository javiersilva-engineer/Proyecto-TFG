import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnfoGestiona1Page } from './enfo-gestiona-1.page';

describe('EnfoGestiona1Page', () => {
  let component: EnfoGestiona1Page;
  let fixture: ComponentFixture<EnfoGestiona1Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EnfoGestiona1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
