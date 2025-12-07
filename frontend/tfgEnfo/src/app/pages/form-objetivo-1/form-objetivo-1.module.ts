import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormObjetivo1PageRoutingModule } from './form-objetivo-1-routing.module';

import { FormObjetivo1Page } from './form-objetivo-1.page';

import { ProgressBarComponent } from '../../components/progress-bar/progress-bar.component';
import { NumberPickerComponent } from '../../components/number-picker/number-picker.component';
import { FlechaButtonComponent } from '../../components/flecha-button/flecha-button.component';
import { InputComponent } from '../../components/input/input.component';
import { ButtonComponent } from '../../components/button/button.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormObjetivo1PageRoutingModule,
    ProgressBarComponent,
    NumberPickerComponent,
    FlechaButtonComponent,
    InputComponent,
    ButtonComponent
  ],
  declarations: [FormObjetivo1Page]
})
export class FormObjetivo1PageModule {}
