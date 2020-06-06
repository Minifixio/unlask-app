import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetSelectionPage } from './set-selection.page';

const routes: Routes = [
  {
    path: '',
    component: SetSelectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetSelectionPageRoutingModule {}
