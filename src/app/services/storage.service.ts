import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { QuestionSet } from '../models/QuestionSet';
import { Question } from '../models/Question';
import { Answer } from '../models/Answer';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  DEFAULT_NOTIFICATION_PREF = true;
  DEFAULT_APP_ENABLED_PREF = true;
  DEFAULT_APP_TIME_RANGE_PREF = {start: '08:00', end: '19:00'};
  DEFAULT_APP_TIME_RANGE_ENABLED_PREF = false;

  DEFAULT_QUESTION_AMOUNT_PREF = 1;

  notificationPref: boolean;
  questionAmountPref: number;
  appEnabledPref: boolean;
  timeRangeEnabledPref: boolean;
  timerangePref: {start: string, end: string};

  constructor(
    private nativeStorage: NativeStorage
  ) { }

  async getNotificationPref(): Promise<boolean> {
    let pref: boolean;

    if (this.notificationPref === undefined) {
      try {
        pref = await this.nativeStorage.getItem('notification');
      } catch (e) {
        console.log('No notifications pref');
      }

      console.log('Notification pref:', pref);
      if (pref === undefined) {
       await this.nativeStorage.setItem('notification', this.DEFAULT_NOTIFICATION_PREF);
       return true;
      } else {
        return pref;
      }
    } else {
      return this.notificationPref;
    }
  }

  async setNotificationPref(pref: boolean): Promise<void> {
    await this.nativeStorage.setItem('notification', pref);
    console.log(await this.nativeStorage.getItem('notification'));
  }

  async getEnabledPref(): Promise<boolean> {
    let pref: boolean;

    if (this.appEnabledPref === undefined) {
      try {
        pref = await this.nativeStorage.getItem('enabled');
      } catch (e) {
        console.log('No app enabled pref');
      }

      console.log('App enabled pref:', pref);
      if (pref === undefined) {
       await this.nativeStorage.setItem('enabled', this.DEFAULT_APP_ENABLED_PREF);
       return true;
      } else {
        return pref;
      }
    } else {
      return this.appEnabledPref;
    }
  }

  async setEnabledPref(pref: boolean): Promise<void> {
    await this.nativeStorage.setItem('enabled', pref);
    console.log(await this.nativeStorage.getItem('enabled'));
  }

  async getTimeRangePref(): Promise<{start: string, end: string}> {
    let pref: {start: string, end: string};

    if (this.timerangePref === undefined) {
      try {
        pref = await this.nativeStorage.getItem('time_range');
      } catch (e) {
        console.log('No app time range pref');
      }

      console.log('Time range pref:', pref);
      if (pref === undefined) {
       await this.nativeStorage.setItem('time_range', this.DEFAULT_APP_TIME_RANGE_PREF);
       return this.DEFAULT_APP_TIME_RANGE_PREF;
      } else {
        return pref;
      }
    } else {
      return this.timerangePref;
    }
  }

  async setTimeRangeEnd( end: string): Promise<void> {
    const timeRange = await this.getTimeRangePref();
    timeRange.end = end;
    await this.nativeStorage.setItem('time_range', timeRange);
    console.log(await this.nativeStorage.getItem('time_range'));
  }

  async setTimeRangeStart(start: string): Promise<void> {
    const timeRange = await this.getTimeRangePref();
    timeRange.start = start;
    await this.nativeStorage.setItem('time_range', timeRange);
    console.log(await this.nativeStorage.getItem('time_range'));
  }

  async getTimeRangeEnabledPref(): Promise<boolean> {
    let pref: boolean;

    if (this.timeRangeEnabledPref === undefined) {
      try {
        pref = await this.nativeStorage.getItem('time_range_enabled');
      } catch (e) {
        console.log('No app time range enabled pref');
      }

      console.log('Time range enabled pref:', pref);
      if (pref === undefined) {
       await this.nativeStorage.setItem('time_range_enabled', this.DEFAULT_APP_TIME_RANGE_ENABLED_PREF);
       return this.DEFAULT_APP_TIME_RANGE_ENABLED_PREF;
      } else {
        return pref;
      }
    } else {
      return this.timeRangeEnabledPref;
    }
  }

  async setTimeRangeEnabledPref(pref: boolean): Promise<void> {
    await this.nativeStorage.setItem('time_range_enabled', pref);
    console.log(await this.nativeStorage.getItem('time_range_enabled'));
  }

  async setQuestionAmountPref(pref: number): Promise<void> {
    this.questionAmountPref = pref;
    await this.nativeStorage.setItem('question_amount', pref);
  }

  async getQuestionAmountPref(): Promise<number> {
    let pref: number;

    if (this.questionAmountPref === undefined) {
      try {
        pref = Number(await this.nativeStorage.getItem('question_amount'));
      } catch (e) {
        console.log('No questions amount pref');
      }

      console.log('Questions amount:', pref);
      if (!pref) {
       await this.nativeStorage.setItem('question_amount', this.DEFAULT_QUESTION_AMOUNT_PREF);
       return 1;
      } else {
        this.questionAmountPref = pref;
        return pref;
      }
    } else {
      return this.questionAmountPref;
    }
  }



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
