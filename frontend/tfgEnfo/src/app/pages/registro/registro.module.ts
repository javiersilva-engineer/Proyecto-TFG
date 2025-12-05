import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RegistroPageRoutingModule } from './registro-routing.module';

import { RegistroPage } from './registro.page';
import { InputComponent } from '../../components/input/input.component';
import { ButtonComponent } from '../../components/button/button.component';
import { GenderSelectionComponent } from '../../components/gender-selection/gender-selection.component';
import { LinkComponent } from '../../components/link/link.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    IonicModule,
    RegistroPageRoutingModule,
    InputComponent,
    ButtonComponent,
    GenderSelectionComponent,
    LinkComponent
  ],
  declarations: [RegistroPage]
})
export class RegistroPageModule {}
