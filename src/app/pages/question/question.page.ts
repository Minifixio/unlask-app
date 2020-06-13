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

  questions: SimpleQuestion[];
  // questions: SimpleQuestion[];
  rightQuestionId: number;
  questionTitle: string;

  constructor(
    private dbService: DatabaseService,
    private router: Router
  ) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.init();
  }

  init() {
    // this.questions = this.dbService.getRandomQuestions();
    this.dbService.getRandomQuestions().then(res => {
      this.questions = res;
      console.log(res);
      console.log();
      this.rightQuestionId = res[0].question_id;
      this.questionTitle = res[0].question;
      setTimeout(() => {
        document.getElementsByClassName('right-button');
        this.animateRight();
        this.animateWrong();
      }, 1000);
    });
  }

  select(id: number) {
    if (id === this.rightQuestionId) {
      setTimeout(() => {
        mayflower.moveTaskToBack();
        this.router.navigateByUrl('/tabs/selection');
      }, 1000);
    }
  }

  animateRight() {
    const rightButton = document.getElementsByClassName('right-button')[0];
    console.log(rightButton);
    function toggleClass() {
      this.classList.toggle('active-r');
    }

    function addClass() {
      this.classList.add('finished-r');
    }

    rightButton.addEventListener('click', toggleClass);
    rightButton.addEventListener('transitionend', toggleClass);
    rightButton.addEventListener('transitionend', addClass);
  }

  animateWrong() {
    const wrongButtons = document.getElementsByClassName('wrong-button');

    console.log(wrongButtons);
    function toggleClass() {
      this.classList.toggle('active-w');
    }

    function addClass() {
      this.classList.add('finished-w');
    }

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < wrongButtons.length; i++) {
      wrongButtons[i].addEventListener('click', toggleClass);
      wrongButtons[i].addEventListener('transitionend', toggleClass);
      wrongButtons[i].addEventListener('transitionend', addClass);
    }

  }

  // testQuestions() {
  //   this.questions = [
  //     {
  //       question_id: 0,
  //       question: 'Pourquoi ai je choisi d\'écrire cette quetion ? Je ne sais point',
  //       answer: 'He bien écoute tu devrais essayer d\'y réfléchir plus en profondeur'
  //     },
  //     {
  //       question_id: 1,
  //       question: 'Pourquoi ai je choisi d\'écrire cette quetion ? Je ne sais point',
  //       answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sit amet scelerisque justo'
  //     },
  //     {
  //       question_id: 2,
  //       question: 'Pourquoi ai je choisi d\'écrire cette quetion ? Je ne sais point',
  //       answer: 'Le Saint Graal'
  //     },
  //     {
  //       question_id: 3,
  //       question: 'Pourquoi ai je choisi d\'écrire cette quetion ? Je ne sais point',
  //       answer: '2'
  //     }
  //   ];

  //   this.questionTitle = this.questions[0].question;
  //   this.rightQuestionId =  this.questions[0].question_id;
  // }

}
