import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnfoGestiona1PageRoutingModule } from './enfo-gestiona-1-routing.module';

import { EnfoGestiona1Page } from './enfo-gestiona-1.page';

import { ProgressBarComponent } from '../../components/progress-bar/progress-bar.component';
import { FlechaButtonComponent } from '../../components/flecha-button/flecha-button.component';
import { ButtonComponent } from '../../components/button/button.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnfoGestiona1PageRoutingModule,
    ProgressBarComponent,
    FlechaButtonComponent,
    ButtonComponent
  ],
  declarations: [EnfoGestiona1Page]
})
export class EnfoGestiona1PageModule {}
