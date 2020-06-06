import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestionContainerComponent } from 'src/app/components/question-container/question-container.component';

import { IonicModule } from '@ionic/angular';

import { SetEditionPageRoutingModule } from './set-edition-routing.module';

import { SetEditionPage } from './set-edition.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetEditionPageRoutingModule
  ],
  declarations: [SetEditionPage, QuestionContainerComponent]
})
export class SetEditionPageModule {}
