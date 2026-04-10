import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinRegistroPage } from './fin-registro.page';

import { ProgressBarComponent } from 'src/app/components/progress-bar/progress-bar.component';
import { FlechaButtonComponent } from 'src/app/components/flecha-button/flecha-button.component';

const routes: Routes = [
  {
    path: '',
    component: FinRegistroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinRegistroPageRoutingModule {}
