import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-questions-set',
  templateUrl: './questions-set.component.html',
  styleUrls: ['./questions-set.component.scss'],
})
export class QuestionsSetComponent implements OnInit {

  @Input() title: string;
  @Input() setId: number;
  @Input() amount: number;

  constructor() { }

  ngOnInit() {}

}
