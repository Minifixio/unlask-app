import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-questions-set',
  templateUrl: './questions-set.component.html',
  styleUrls: ['./questions-set.component.scss'],
})
export class QuestionsSetComponent implements OnInit {

  @Input() title: string;
  @Input() setId: number;
  @Input() amount: number;
  @Input() active: boolean;
  @Output() editSet = new EventEmitter<number>();

  constructor(
    private dbService: DatabaseService
  ) { }

  ngOnInit() {}

  editAction(): void {
    this.editSet.emit(this.setId);
  }

  async changeStatus(event: CustomEvent) {
    if (event.detail.checked) {
      await this.dbService.changeSetStatus(this.setId, true);
    } else {
      await this.dbService.changeSetStatus(this.setId, false);
    }
  }

}
