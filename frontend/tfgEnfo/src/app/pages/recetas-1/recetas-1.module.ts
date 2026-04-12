import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { Recetas1PageRoutingModule } from './recetas-1-routing.module';
import { Recetas1Page } from './recetas-1.page';
import { BottomNavComponent } from 'src/app/components/bottom-nav/bottom-nav.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Recetas1PageRoutingModule,
    BottomNavComponent
  ],
  declarations: [Recetas1Page]
})
export class Recetas1PageModule {}