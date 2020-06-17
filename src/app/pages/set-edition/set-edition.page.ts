import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { QuestionContainerComponent } from 'src/app/components/question-container/question-container.component';
import { Question } from 'src/app/models/Question';
import { QuestionSet } from 'src/app/models/QuestionSet';
import { ToastsService } from 'src/app/services/toasts.service';
import { ViewChildren, QueryList } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { AlertService } from 'src/app/services/alert.service';

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
  initialTitle: string;
  edition = false;
  creation = false;

  constructor(
    private router: Router,
    private toastService: ToastsService,
    private dbService: DatabaseService,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {

    if (this.router.getCurrentNavigation().extras.state) {
      const setParam = this.router.getCurrentNavigation().extras.state.set;

      if (setParam !== null) {
        console.log('edit set');
        this.setMessage = 'Edit a set';
        this.edition = true;
        this.setId = setParam;
        this.dbService.getSetContent(this.setId).then(setContent => {
          this.questionSet = setContent;
          this.questions = setContent.questions;
          this.setTitle = setContent.title;
          this.initialTitle = this.setTitle;
        });
      } else {
        this.setMessage = 'Add a new set';
        this.creation = true;
        this.dbService.getNextSetId().then(res => {
          this.setId = res;
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
          });
      }
    } else {
      this.router.navigateByUrl('/tabs/selection');
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

  async validateInputs() {
    if (this.creation) {
      this.questions = this.mapQuestions(this.questionContainers);
      this.questions.forEach(question => {
        if ((question.title === '' && question.answer.content !== '') || (question.answer.content === '' && question.title !== '')) {
          this.toastService.info(`Question n°${question.question_id} must be fulfilled`);
          return;
        }
      });

      if (this.questions.length < 2) {
        this.toastService.info(`You must add at least 2 questions`);
        return;
      }

      if (!this.setTitle) {
        this.toastService.info(`Please add a set name`);
        return;
      }

      const newSet: QuestionSet = {
        set_id: this.setId,
        title: this.setTitle,
        amount: this.questions.length,
        active: true,
        questions: this.questions
      };
      console.log(newSet);

      await this.dbService.newSet(newSet);
      console.log('resolved');
      this.router.navigateByUrl('/tabs/selection');
    }

    if (this.edition) {
      const newQuestions = this.mapQuestions(this.questionContainers);
      console.log(newQuestions, this.questions);

      if (newQuestions.length >= this.questions.length) {
        for (const question of newQuestions) {
          const matchingQuestion = this.questions.find(q => q.question_id === question.question_id);
          console.log(matchingQuestion);
          if (!matchingQuestion) {
            await this.dbService.addQuestion(question);
          } else {
            if (matchingQuestion.title !== question.title) {
              await this.dbService.editQuestion(this.setId, question.question_id, question.title);
            }

            if (matchingQuestion.answer.content !== question.answer.content) {
              await this.dbService.editAnswer(this.setId, question.question_id, question.answer.content);
            }
          }
        }
      }

      if (newQuestions.length < this.questions.length) {
        for (const question of this.questions) {
          const matchingQuestion = newQuestions.find(q => q.question_id === question.question_id);

          if (!matchingQuestion) {
            await this.dbService.deleteQuestion(this.setId, question.question_id);
          } else {
            if (matchingQuestion.title !== question.title) {
              await this.dbService.editQuestion(this.setId, question.question_id, question.title);
            }

            if (matchingQuestion.answer.content !== question.answer.content) {
              await this.dbService.editAnswer(this.setId, question.question_id, question.answer.content);
            }
          }
        }
      }

      if (this.initialTitle !== this.setTitle) {
        await this.dbService.editSetTitle(this.setId, this.setTitle);
      }

      this.router.navigateByUrl('/tabs/selection');
    }

  }

  mapQuestions(questionComponents: QueryList<QuestionContainerComponent>): Question[] {
    const res: Question[] = [];
    let index = 0;

    questionComponents.filter(q => (q.question !== '' && q.answer !== '')).forEach(question => {
      index += 1;
      const returnedQuestion: Question = {
        set_id: this.setId,
        title: question.question,
        question_id: index,
        answer: {
          set_id: this.setId,
          content: question.answer,
          question_id: index
        }
      };
      res.push(returnedQuestion);
    });

    return res;
  }

  async deleteSet() {
    const callback = async () => {
      await this.dbService.deleteSet(this.setId);
      this.router.navigateByUrl('/tabs/selection');
      this.toastService.info('Set successfully deleted !');
    };
    await this.alertService.validation(`Delete set ${this.setTitle} ?`, 'Are you sure you want to delete this set ?', callback);
  }
}
