import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { Recetas2PageRoutingModule } from './recetas-2-routing.module';
import { Recetas2Page } from './recetas-2.page';

import { BottomNavComponent } from 'src/app/components/bottom-nav/bottom-nav.component';
import { FlechaButtonComponent } from 'src/app/components/flecha-button/flecha-button.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Recetas2PageRoutingModule,
    BottomNavComponent,
    FlechaButtonComponent
  ],
  declarations: [Recetas2Page]
})
export class Recetas2PageModule {}