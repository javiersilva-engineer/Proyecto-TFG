import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormObjetivo4Page } from './form-objetivo-4.page';

const routes: Routes = [
  {
    path: '',
    component: FormObjetivo4Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormObjetivo4PageRoutingModule {}
