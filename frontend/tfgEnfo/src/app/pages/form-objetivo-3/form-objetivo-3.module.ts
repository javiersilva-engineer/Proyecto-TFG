import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormObjetivo3PageRoutingModule } from './form-objetivo-3-routing.module';

import { FormObjetivo3Page } from './form-objetivo-3.page';

import { ProgressBarComponent } from '../../components/progress-bar/progress-bar.component';
import { FlechaButtonComponent } from '../../components/flecha-button/flecha-button.component';
import { ButtonComponent } from '../../components/button/button.component';
import { FatButtonComponent } from '../../components/fat-button/fat-button.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormObjetivo3PageRoutingModule,
    ProgressBarComponent,
    FlechaButtonComponent,
    ButtonComponent,
    FatButtonComponent
  ],
  declarations: [FormObjetivo3Page]
})
export class FormObjetivo3PageModule {}
