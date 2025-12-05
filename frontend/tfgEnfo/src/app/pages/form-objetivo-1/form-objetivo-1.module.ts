import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormObjetivo1PageRoutingModule } from './form-objetivo-1-routing.module';

import { FormObjetivo1Page } from './form-objetivo-1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormObjetivo1PageRoutingModule
  ],
  declarations: [FormObjetivo1Page]
})
export class FormObjetivo1PageModule {}
