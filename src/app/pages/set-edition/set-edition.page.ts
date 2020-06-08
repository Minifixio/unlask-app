import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { QuestionContainerComponent } from 'src/app/components/question-container/question-container.component';
import { Question } from 'src/app/models/Question';
import { QuestionSet } from 'src/app/models/QuestionSet';
import { ToastsService } from 'src/app/services/toasts.service';
import { ViewChildren, QueryList } from '@angular/core';

@Component({
  selector: 'app-set-edition',
  templateUrl: './set-edition.page.html',
  styleUrls: ['./set-edition.page.scss'],
})
export class SetEditionPage implements OnInit {

  @ViewChildren('questionContainer')
  questionContainers: QueryList<QuestionContainerComponent>;

  setId: number;
  setMessage: string;
  questionSet: QuestionSet;
  questions: Question[];
  setTitle: string;
  edition = false;
  creation = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastsService,
    private dbService: DatabaseService
  ) {
  }

  ngOnInit() {

    if (this.router.getCurrentNavigation().extras.state) {
      const setParam = this.router.getCurrentNavigation().extras.state.set;

      if (setParam !== null) {
        console.log('new set');
        this.setMessage = 'Edit a set';
        this.edition = true;
        this.setId = setParam;
        this.dbService.getSetContent(this.setId).then(setContent => {
          this.questionSet = setContent;
          this.questions = setContent.questions;
          this.setTitle = setContent.title
        });
      } else {
        this.setMessage = 'Add a new set';
        this.creation = true;
        this.setId = 0; // To remove

        this.dbService.getSetAmount().then(num => {
            this.setId = num;
            console.log('new set');
          });

        const newQuestion: Question = {
          set_id: this.setId,
          question_id: 0,
          title: '',
          answer: {
            set_id: this.setId,
            question_id: 0,
            content: ''
          }
        };
        this.questions = [newQuestion];
      }
    } else { // To remove
      this.setMessage = 'Add a new set';
      this.creation = true;
      this.setId = 0; // To remove

      this.dbService.getSetAmount().then(num => {
          this.setId = num;
          console.log('new set');
        });

      const newQuestion: Question = {
        set_id: this.setId,
        question_id: 0,
        title: '',
        answer: {
          set_id: this.setId,
          question_id: 0,
          content: ''
        }
      };
      this.questions = [newQuestion];
    }
  }

  addQuestion() {
    const newQuestion: Question = {
      set_id: this.setId,
      question_id: this.questions.length,
      title: '',
      answer: {
        set_id: this.setId,
        question_id: this.questions.length,
        content: ''
      }
    };
    this.questions.push(newQuestion);
  }

  validateInputs() {
    if (this.creation) {
      this.questions = this.mapQuestions(this.questionContainers);
      this.questions.map(question => question.title && question.answer.content);
      this.questions.forEach(question => {
        if ((question.title === '' && question.answer.content !== '') || (question.answer.content === '' && question.title !== '')) {
          this.toastService.error(`Question n°${question.question_id} must be fulfilled`);
          return;
        }
      });

      if (this.questions.length < 2) {
        this.toastService.error(`You must add at least 2 questions`);
        return;
      }

      if (!this.setTitle) {
        this.toastService.error(`Please add a set name`);
        return;
      }

      console.log(this.questions)
    }

  }

  mapQuestions(questionComponents: QueryList<QuestionContainerComponent>): Question[] {
    const res: Question[] = [];

    questionComponents.forEach(question => {
      const returnedQuestion: Question = {
        set_id: this.setId,
        title: question.question,
        question_id: question.questionId,
        answer: {
          set_id: this.setId,
          content: question.answer,
          question_id: question.questionId
        }
      };
      res.push(returnedQuestion);
    });

    return res;
  }

}
