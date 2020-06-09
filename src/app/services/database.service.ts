import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Question } from '../models/Question';
import { QuestionSet } from '../models/QuestionSet';
import { Answer } from '../models/Answer';
import { Platform } from '@ionic/angular';
import { DBResult } from '../models/DBresult';
declare var cordova: any;

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  db: SQLiteObject;

  constructor(
    private sqlite: SQLite,
    private platform: Platform
  ) {}

  async initDB(): Promise<void> {
    try {
      await this.sqlite.echoTest();
      await this.sqlite.selfTest();
      this.db = await this.sqlite.create({name: 'sets', location: 'default'});
      await this.db.open();
      await this.db.executeSql('CREATE TABLE IF NOT EXISTS sets (set_id INTEGER PRIMARY KEY, title TEXT, amount INTEGER)', []);
      await this.db.executeSql('CREATE TABLE IF NOT EXISTS questions (set_id INTEGER, question_id INTEGER, title TEXT)', []);
      await this.db.executeSql('CREATE TABLE IF NOT EXISTS answers (set_id INTEGER, question_id INTEGER, content TEXT)', []);
    } catch (e) {
      console.log(e);
    }
  }

  async addQuestion(question: Question): Promise<void> {

    const questionQuery = 'INSERT INTO questions (set_id, question_id, title) VALUES (?, ?, ?)';
    await this.db.executeSql(questionQuery, [question.set_id, question.question_id, question.title]);

    const answer = question.answer;
    const answerQuery = 'INSERT INTO answers (set_id, question_id, content) VALUES (?, ?, ?)';
    await this.db.executeSql(answerQuery, [answer.set_id, answer.question_id, answer.content]);

    await this.increaseSetAmount(question.set_id);
  }

  async deleteQuestion(setId: number, questionId: number): Promise<void> {
    const deleteQuestionQuery = 'DELETE FROM questions WHERE set_id = ? AND question_id = ?';
    const deleteAnswerQuery = 'DELETE FROM answers WHERE set_id = ? AND question_id = ?';

    await this.db.executeSql(deleteQuestionQuery, [setId, questionId]);
    await this.db.executeSql(deleteAnswerQuery, [setId, questionId]);

    await this.descreaseSetAmount(setId);
  }

  async editQuestion(setId: number, questionId: number, title: string): Promise<void> {
    const editQuery = 'UPDATE questions SET title = ? WHERE set_id = ? AND question_id = ?';
    await this.db.executeSql(editQuery, [title, setId, questionId]);
  }

  async editAnswer(setId: number, questionId: number, content: string): Promise<void> {
    const editQuery = 'UPDATE answers SET content = ? WHERE set_id = ? AND question_id = ?';
    await this.db.executeSql(editQuery, [content, setId, questionId]);
  }

  async editSetTitle(setId: number, title: string): Promise<void> {
    const editQuery = 'UPDATE sets SET title = ? WHERE set_id = ?';
    await this.db.executeSql(editQuery, [title, setId]);
  }

  async newSet(set: QuestionSet): Promise<void> {
    const newSetQuery = 'INSERT INTO sets (set_id, title) VALUES (?, ?)';
    await this.db.executeSql(newSetQuery, [set.set_id, set.title]);

    for (const question of set.questions) {
      await this.addQuestion(question);
    }
  }

  async increaseSetAmount(setId: number): Promise<void> {
    const updateQuery = 'UPDATE sets SET amount = amount + 1 WHERE set_id = ?';
    try {
      await this.db.executeSql(updateQuery, [setId]);
    } catch (e) {
      throw (e);
    }
  }

  async descreaseSetAmount(setId: number): Promise<void> {
    const updateQuery = 'UPDATE sets SET amount = amount - 1 WHERE set_id = ?';
    try {
      await this.db.executeSql(updateQuery, [setId]);
    } catch (e) {
      throw (e);
    }
  }

  async getSets(): Promise<QuestionSet[]> {
    const getQuery = 'SELECT * FROM sets';
    const res: QuestionSet[] = this.formatDatas<QuestionSet>(await this.db.executeSql(getQuery, []));
    return res;
  }

  async getSetInfos(setId: number): Promise<QuestionSet> {
    const setQuery = 'SELECT * FROM sets WHERE set_id = ?';
    const res: QuestionSet = this.formatDatas<QuestionSet>(await this.db.executeSql(setQuery, [setId]))[0];
    return res;
  }

  async getQuestions(setId: number): Promise<Question[]> {
    const getQuery = 'SELECT * FROM questions WHERE set_id = ?';
    const res: Question[] = this.formatDatas<Question>(await this.db.executeSql(getQuery, [setId]));
    return res;
  }

  async getAnswers(setId: number): Promise<Answer[]> {
    const getQuery = 'SELECT * FROM answers WHERE set_id = ?';
    const res: Answer[] = this.formatDatas<Answer>(await this.db.executeSql(getQuery, [setId]));
    return res;
  }

  async getSetAmount(): Promise<number> {
    const amoutQuery = 'SELECT * FROM sets';
    const res: QuestionSet[] = await this.getSets();
    return res.length;
  }

  async getSetContent(setId: number): Promise<QuestionSet> {
    const questions = await this.getQuestions(setId);
    const answers = await this.getAnswers(setId);
    const setInfos = await this.getSetInfos(setId);
    questions.map(question => question.answer = answers.find(answer => answer.question_id === question.question_id));

    const res: QuestionSet = {
      set_id: setId,
      title: setInfos.title,
      amount: questions.length,
      questions
    };

    return res;
  }

  async clearDb() {
    const clearSetsQuery = 'DELETE FROM sets';
    const clearQuestionsQuery = 'DELETE FROM questions';
    const clearAnswersQuery = 'DELETE FROM questions';
    await this.db.executeSql(clearSetsQuery, []);
    await this.db.executeSql(clearQuestionsQuery, []);
    await this.db.executeSql(clearAnswersQuery, []);
  }

  formatDatas<T>(datas: DBResult): T[] {
    const res: any[] = [];
    console.log(datas.rows.length)

    for (let i = 0; i < datas.rows.length; i++) {
      res.push(datas.rows.item(i));
    }

    return res;
  }

  async testDB() {
    await this.initDB();
    await this.clearDb();
    const testSet: QuestionSet = {
      title: 'test',
      set_id: 0,
      amount: 2,
      questions: [
        {
          title: 'test0',
          set_id: 0,
          question_id: 0,
          answer: {
            content: 'test_a',
            set_id: 0,
            question_id: 0
          }
        },
        {
          title: 'test1',
          set_id: 0,
          question_id: 1,
          answer: {
            content: 'test1_a',
            set_id: 0,
            question_id: 1
          }
        }
      ]
    };
    const testSet2: QuestionSet = {
      title: 'test',
      set_id: 1,
      amount: 2,
      questions: [
        {
          title: 'test0',
          set_id: 1,
          question_id: 0,
          answer: {
            content: 'test_a',
            set_id: 0,
            question_id: 0
          }
        },
        {
          title: 'test1',
          set_id: 1,
          question_id: 1,
          answer: {
            content: 'test1_a',
            set_id: 0,
            question_id: 1
          }
        }
      ]
    };
    await this.newSet(testSet);
    await this.newSet(testSet2);
    const getQuery = 'SELECT * FROM sets';
    const res = await this.db.executeSql(getQuery, []);
    console.log(res.rows.item(0))
  }

}
