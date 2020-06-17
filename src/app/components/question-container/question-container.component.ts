import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-question-container',
  templateUrl: './question-container.component.html',
  styleUrls: ['./question-container.component.scss'],
})
export class QuestionContainerComponent implements OnInit {

  @Input() question: string;
  @Input() answer: string;
  @Input() questionId: number;
  @ViewChild('questionInput') questionInput: IonInput;
  @ViewChild('answerInput') answerInput: IonInput;

  constructor() { }

  ngOnInit() {
    if (this.question === '' && this.answer === '') {
      setTimeout(() => {
        this.questionInput.setFocus();
      }, 500);
    }
  }

}
