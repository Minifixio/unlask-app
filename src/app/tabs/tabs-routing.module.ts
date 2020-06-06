import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'selection',
        loadChildren: () => import('../pages/set-selection/set-selection.module').then(m => m.SetSelectionPageModule)
      },
      {
        path: 'preferences',
        loadChildren: () => import('../pages/preferences/preferences-routing.module').then(m => m.PreferencesPageRoutingModule)
      },
      {
        path: '',
        redirectTo: '/tabs/selection',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/selection',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
