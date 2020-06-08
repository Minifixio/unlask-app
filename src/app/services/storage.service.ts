import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { QuestionSet } from '../models/QuestionSet';
import { Question } from '../models/Question';
import { Answer } from '../models/Answer';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private nativeStorage: NativeStorage
  ) { }

  getSetKey(setId: number): string {
    return `question-set-${setId}`;
  }

  async addQuestion(question: Question, setId: number): Promise<void> {
    const setInfos = await this.getQuestionSet(setId);
    setInfos.questions.push(question);
    setInfos.amount += 1;
    await this.nativeStorage.setItem(this.getSetKey(setId), JSON.stringify(setInfos));
  }

  async removeQuestion(question: Question, setId: number): Promise<void> {
    const setInfos = await this.getQuestionSet(setId);
    setInfos.questions.splice(setInfos.questions.findIndex(q => q.question_id === question.question_id), 1);
    setInfos.amount = setInfos.amount - 1;
    await this.nativeStorage.setItem(this.getSetKey(setId), JSON.stringify(setInfos));
  }

  async createQuestionSet(questionSet: QuestionSet): Promise<void> {
    await this.nativeStorage.setItem(this.getSetKey(questionSet.set_id), JSON.stringify(questionSet));
  }

  async getQuestionSetAmount(): Promise<number> {
    const keys: string[] = await this.nativeStorage.keys();
    const count = keys.reduce((acc, cur) => {
      if (cur.includes('question-set')) {
        acc += 1;
      }

      return acc;
    }, 0);

    return count;
  }

  async getQuestionSet(setId: number): Promise<QuestionSet> {
    const setInfos: QuestionSet = JSON.parse(await this.nativeStorage.getItem(this.getSetKey(setId)));
    return setInfos;
  }

  async getAllQuestionSets(): Promise<QuestionSet[]> {
    const count = await this.getQuestionSetAmount();
    const res: QuestionSet[] = [];

    for (let i = 0; i++; i < count) {
      const questionSet = await this.nativeStorage.getItem(this.getSetKey(i));
      res.push(questionSet);
    }

    return res;
  }

  async getAnswers(setId: number): Promise<Answer[]> {
    const setInfos = await this.getQuestionSet(setId);
    const res = setInfos.questions.map(q => q.answer);
    return res;
  }
}
