import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { SimpleQuestion } from 'src/app/models/Question';
import { Router, NavigationExtras } from '@angular/router';
import { ListenerService } from 'src/app/services/listener.service';
import { StorageService } from 'src/app/services/storage.service';
declare var mayflower: any;

@Component({
  selector: 'app-question',
  templateUrl: './question.page.html',
  styleUrls: ['./question.page.scss'],
})
export class QuestionPage implements OnInit {

  questions: SimpleQuestion[];
  rightQuestionId: number;
  questionTitle: string;
  questionsAmount: number;
  questionsCount: number;
  loading: boolean;

  constructor(
    private dbService: DatabaseService,
    private router: Router,
    private listenerService: ListenerService,
    private storageService: StorageService
  ) { }

  ngOnInit() { }

  ionViewDidEnter() {
    console.log('Questions loaded');
    this.loading = true;
    // setTimeout(() => { this.init(); }, 500);
    this.testQuestions();
  }

  init() {
    this.storageService.getQuestionAmountPref().then(res => {
      this.questionsAmount = res;
      this.questionsCount = 1;
    });

    this.dbService.initDB().then(() => {
      this.dbService.getRandomQuestions().then(res => {
        this.questions = res;
        console.log(res);

        if (this.questions.length > 0) {
          this.loading = false;
          this.rightQuestionId = res[0].question_id;
          this.questionTitle = res[0].question;
          this.listenerService.startListening();

          const animationInterval = setInterval(() => {
            if (document.getElementsByClassName('right-button')[0]) {
              this.animateRight();
              this.animateWrong();
              clearInterval(animationInterval);
            }
          }, 100);
        }

      });
    });
  }

  newSet() {
    const navigationExtras: NavigationExtras = {
      state: {
        set: null
      }
    };
    this.router.navigate(['set-edition'], navigationExtras);
  }

  async select(id: number) {
    if (id === this.rightQuestionId) {
      this.questionsCount += 1;

      if (this.questionsAmount + 1 === this.questionsCount) {
        this.finish();
      } else {

        // Set a timeout to wait for the animation to end
        setTimeout(async () => {

          this.loading = true;
          const questionsCount = await this.dbService.getQuestionsAmount();
          let trials = 0;
          let nextQuestions: SimpleQuestion[];
          do {
            nextQuestions = await this.dbService.getRandomQuestions();
            trials += 1;

            if (trials > 10 && questionsCount < this.questionsAmount) {
              this.finish();
              break;
            }
          } while (nextQuestions[0].question === this.questionTitle);

          this.loading = false;
          this.rightQuestionId = nextQuestions[0].question_id;
          this.questionTitle = nextQuestions[0].question;
          const animationInterval = setInterval(() => {
            if (document.getElementsByClassName('right-button')[0]) {
              this.animateRight();
              this.animateWrong();
              clearInterval(animationInterval);
            }
          }, 100);
        }, 1000);
      }
    }
  }

  finish() {
    setTimeout(() => {
      mayflower.moveTaskToBack();
      this.router.navigateByUrl('/tabs/selection');
    }, 1000);
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

  testQuestions() {
    this.loading = false;

    this.questions = [
      {
        set_id: 1,
        question_id: 0,
        question: 'Pourquoi ai je choisi d\'écrire cette quetion ? Je ne sais point',
        answer: 'He bien écoute tu devrais essayer d\'y réfléchir plus en profondeur'
      },
      {
        set_id: 1,
        question_id: 1,
        question: 'Pourquoi ai je choisi d\'écrire cette quetion ? Je ne sais point',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sit amet scelerisque justo'
      },
      {
        set_id: 1,
        question_id: 2,
        question: 'Pourquoi ai je choisi d\'écrire cette quetion ? Je ne sais point',
        answer: 'Le Saint Graal'
      },
      {
        set_id: 1,
        question_id: 3,
        question: 'Pourquoi ai je choisi d\'écrire cette quetion ? Je ne sais point',
        answer: '2'
      }
    ];

    this.questionTitle = this.questions[0].question;
    this.rightQuestionId =  this.questions[0].question_id;

    const animationInterval = setInterval(() => {
      if (document.getElementsByClassName('right-button')[0]) {
        this.animateRight();
        this.animateWrong();
        clearInterval(animationInterval);
      }
    }, 100);
  }

}
