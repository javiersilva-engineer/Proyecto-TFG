import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicarRecetaPage } from './publicar-receta.page';

describe('PublicarRecetaPage', () => {
  let component: PublicarRecetaPage;
  let fixture: ComponentFixture<PublicarRecetaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicarRecetaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
