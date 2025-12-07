import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormObjetivo2Page } from './form-objetivo-2.page';

const routes: Routes = [
  {
    path: '',
    component: FormObjetivo2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormObjetivo2PageRoutingModule {}
