import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PublicarRecetaPageRoutingModule } from './publicar-receta-routing.module';
import { PublicarRecetaPage } from './publicar-receta.page';

import { BottomNavComponent } from 'src/app/components/bottom-nav/bottom-nav.component';
import { FlechaButtonComponent } from 'src/app/components/flecha-button/flecha-button.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PublicarRecetaPageRoutingModule,
    BottomNavComponent,
    FlechaButtonComponent
  ],
  declarations: [PublicarRecetaPage]
})
export class PublicarRecetaPageModule {}