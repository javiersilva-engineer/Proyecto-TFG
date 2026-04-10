import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { FinRegistroPageRoutingModule } from './fin-registro-routing.module';
import { FinRegistroPage } from './fin-registro.page';

import { ProgressBarComponent } from 'src/app/components/progress-bar/progress-bar.component';
import { FlechaButtonComponent } from 'src/app/components/flecha-button/flecha-button.component';
import { ButtonComponent } from '../../components/button/button.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinRegistroPageRoutingModule,
    ProgressBarComponent,
    FlechaButtonComponent,
    ButtonComponent
  ],
  declarations: [FinRegistroPage]
})
export class FinRegistroPageModule {}