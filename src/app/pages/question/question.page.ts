import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { SimpleQuestion } from 'src/app/models/Question';
import { Router } from '@angular/router';
declare var mayflower: any;

@Component({
  selector: 'app-question',
  templateUrl: './question.page.html',
  styleUrls: ['./question.page.scss'],
})
export class QuestionPage implements OnInit {

  questions: Promise<SimpleQuestion[]>;
  rightQuestionId: number;
  questionTitle: string;

  constructor(
    private dbService: DatabaseService,
    private router: Router
  ) { }

  ngOnInit() {
    this.questions = this.dbService.getRandomQuestions();
    this.questions.then(res => {
      this.rightQuestionId = res[0].question_id;
      this.questionTitle = res[0].question;
    });
  }

  select(id: number) {
    if (id === this.rightQuestionId) {
      mayflower.moveTaskToBack();
      this.router.navigateByUrl('/tabs/selection');
    }
  }

}
