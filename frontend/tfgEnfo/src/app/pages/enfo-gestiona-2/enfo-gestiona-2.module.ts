import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnfoGestiona2PageRoutingModule } from './enfo-gestiona-2-routing.module';

import { EnfoGestiona2Page } from './enfo-gestiona-2.page';

import { ProgressBarComponent } from '../../components/progress-bar/progress-bar.component';
import { FlechaButtonComponent } from '../../components/flecha-button/flecha-button.component';
import { ButtonComponent } from '../../components/button/button.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnfoGestiona2PageRoutingModule,
    ProgressBarComponent,
    FlechaButtonComponent,
    ButtonComponent
  ],
  declarations: [EnfoGestiona2Page]
})
export class EnfoGestiona2PageModule {}
