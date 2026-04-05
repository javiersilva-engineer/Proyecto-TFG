import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormObjetivo3Page } from './form-objetivo-3.page';

const routes: Routes = [
  {
    path: '',
    component: FormObjetivo3Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormObjetivo3PageRoutingModule {}
