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

  // questions: Promise<SimpleQuestion[]>;
  questions: SimpleQuestion[];
  rightQuestionId: number;
  questionTitle: string;

  constructor(
    // private dbService: DatabaseService,
    private router: Router
  ) { }

  ngOnInit() {
    // this.questions = this.dbService.getRandomQuestions();
    // this.questions.then(res => {
    //   this.rightQuestionId = res[0].question_id;
    //   this.questionTitle = res[0].question;
    // });
    this.questions = [
      {
        question_id: 0,
        question: 'Pourquoi ai je choisi d\'écrire cette quetion ? Je ne sais point',
        answer: 'He bien écoute tu devrais essayer d\'y réfléchir plus en profondeur'
      },
      {
        question_id: 0,
        question: 'Pourquoi ai je choisi d\'écrire cette quetion ? Je ne sais point',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sit amet scelerisque justo'
      },
      {
        question_id: 0,
        question: 'Pourquoi ai je choisi d\'écrire cette quetion ? Je ne sais point',
        answer: 'Le Saint Graal'
      },
      {
        question_id: 0,
        question: 'Pourquoi ai je choisi d\'écrire cette quetion ? Je ne sais point',
        answer: '2'
      }
    ];

    this.questionTitle = this.questions[0].question;
  }

  ionViewDidEnter() {
    this.animate();
  }

  select(id: number) {
    if (id === this.rightQuestionId) {
      setTimeout(() => {
        mayflower.moveTaskToBack();
        this.router.navigateByUrl('/tabs/selection');
      }, 300);
    }
  }

  animate() {
    const button = document.querySelector('.button');
    const submit = document.querySelector('.submit');

    function toggleClass() {
      this.classList.toggle('active');
    }

    function addClass() {
      this.classList.add('finished');
    }

    button.addEventListener('click', toggleClass);
    button.addEventListener('transitionend', toggleClass);
    button.addEventListener('transitionend', addClass);
  }

}
