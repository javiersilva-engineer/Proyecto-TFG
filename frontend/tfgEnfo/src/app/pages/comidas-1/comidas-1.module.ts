import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { Comidas1PageRoutingModule } from './comidas-1-routing.module';
import { Comidas1Page } from './comidas-1.page';
import { BottomNavComponent } from 'src/app/components/bottom-nav/bottom-nav.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Comidas1PageRoutingModule,
    BottomNavComponent
  ],
  declarations: [Comidas1Page]
})
export class Comidas1PageModule {}