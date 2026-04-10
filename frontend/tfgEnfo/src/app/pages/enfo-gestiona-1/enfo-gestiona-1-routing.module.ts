import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnfoGestiona1Page } from './enfo-gestiona-1.page';

const routes: Routes = [
  {
    path: '',
    component: EnfoGestiona1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnfoGestiona1PageRoutingModule {}
