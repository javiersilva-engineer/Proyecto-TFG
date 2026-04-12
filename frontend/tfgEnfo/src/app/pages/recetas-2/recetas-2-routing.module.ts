import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Recetas2Page } from './recetas-2.page';

const routes: Routes = [
  {
    path: '',
    component: Recetas2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Recetas2PageRoutingModule {}
