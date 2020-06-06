import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { QuestionContainerComponent } from 'src/app/components/question-container/question-container.component';
import { QuestionSet } from 'src/app/models/QuestionSet';

@Component({
  selector: 'app-set-edition',
  templateUrl: './set-edition.page.html',
  styleUrls: ['./set-edition.page.scss'],
})
export class SetEditionPage implements OnInit {

  @ViewChild('questionContainer')
  questionContainer: QuestionContainerComponent;

  setId: number;
  setMessage: string;
  sets: QuestionSet[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    // private dbService: DatabaseService
  ) {
    const setParam = this.router.getCurrentNavigation().extras.state.set;

    if (setParam !== null) {
      console.log('new set');
      this.setId = setParam;
      this.setMessage = 'Edit a set';
    } else {
      this.setMessage = 'Add a new set';
    // this.dbService.getSetAmount().then(num => {
    //     this.setId = num;
    //     console.log('new set');
    //   });
    }
  }

  ngOnInit() {
  }

}
