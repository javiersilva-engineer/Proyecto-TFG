import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormObjetivo1Page } from './form-objetivo-1.page';

const routes: Routes = [
  {
    path: '',
    component: FormObjetivo1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormObjetivo1PageRoutingModule {}
