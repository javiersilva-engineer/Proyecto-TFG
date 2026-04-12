import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Comidas1Page } from './comidas-1.page';

const routes: Routes = [
  {
    path: '',
    component: Comidas1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Comidas1PageRoutingModule {}
