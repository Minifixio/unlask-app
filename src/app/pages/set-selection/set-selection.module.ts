import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetSelectionPageRoutingModule } from './set-selection-routing.module';

import { SetSelectionPage } from './set-selection.page';
import { QuestionsSetComponent } from 'src/app/components/questions-set/questions-set.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetSelectionPageRoutingModule
  ],
  declarations: [SetSelectionPage, QuestionsSetComponent]
})
export class SetSelectionPageModule {}
