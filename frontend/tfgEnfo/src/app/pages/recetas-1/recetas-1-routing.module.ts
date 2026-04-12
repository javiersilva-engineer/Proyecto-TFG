import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Recetas1Page } from './recetas-1.page';

const routes: Routes = [
  {
    path: '',
    component: Recetas1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Recetas1PageRoutingModule {}
