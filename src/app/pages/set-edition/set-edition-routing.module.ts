import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetEditionPage } from './set-edition.page';

const routes: Routes = [
  {
    path: '',
    component: SetEditionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetEditionPageRoutingModule {}
