import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnfoGestiona2Page } from './enfo-gestiona-2.page';

const routes: Routes = [
  {
    path: '',
    component: EnfoGestiona2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnfoGestiona2PageRoutingModule {}
