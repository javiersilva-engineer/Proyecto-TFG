import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormObjetivo4PageRoutingModule } from './form-objetivo-4-routing.module';

import { FormObjetivo4Page } from './form-objetivo-4.page';

import { ProgressBarComponent } from '../../components/progress-bar/progress-bar.component';
import { FlechaButtonComponent } from '../../components/flecha-button/flecha-button.component';
import { ButtonComponent } from '../../components/button/button.component';
import { FatButtonComponent } from '../../components/fat-button/fat-button.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormObjetivo4PageRoutingModule,
    ProgressBarComponent,
    FlechaButtonComponent,
    ButtonComponent,
    FatButtonComponent
  ],
  declarations: [FormObjetivo4Page]
})
export class FormObjetivo4PageModule {}
