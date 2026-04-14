import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';

import { MiPerfilPageRoutingModule } from './mi-perfil-routing.module';
import { MiPerfilPage } from './mi-perfil.page';

import { BottomNavComponent } from 'src/app/components/bottom-nav/bottom-nav.component';
import { FlechaButtonComponent } from 'src/app/components/flecha-button/flecha-button.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HttpClientModule,
    MiPerfilPageRoutingModule,
    BottomNavComponent,
    FlechaButtonComponent
  ],
  declarations: [MiPerfilPage]
})
export class MiPerfilPageModule {}