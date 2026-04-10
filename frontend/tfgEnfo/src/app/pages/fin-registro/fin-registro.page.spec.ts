import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinRegistroPage } from './fin-registro.page';

describe('FinRegistroPage', () => {
  let component: FinRegistroPage;
  let fixture: ComponentFixture<FinRegistroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FinRegistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
