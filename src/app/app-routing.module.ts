import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SetSelectionPage } from './pages/set-selection/set-selection.page';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'set-edition',
    loadChildren: () => import('./pages/set-edition/set-edition.module').then( m => m.SetEditionPageModule)
  },
  {
    path: 'preferences',
    loadChildren: () => import('./pages/preferences/preferences.module').then( m => m.PreferencesPageModule)
  },
  {
    path: 'set-selection',
    // component: SetSelectionPage
    loadChildren: () => import('./pages/set-selection/set-selection.module').then( m => m.SetSelectionPageModule)
  },
  {
    path: 'question',
    loadChildren: () => import('./pages/question/question.module').then( m => m.QuestionPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
