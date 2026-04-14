import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublicarRecetaPage } from './publicar-receta.page';

const routes: Routes = [
  {
    path: '',
    component: PublicarRecetaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicarRecetaPageRoutingModule {}
