import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Question } from '../models/Question';
import { QuestionSet } from '../models/QuestionSet';
import { Answer } from '../models/Answer';
declare var cordova: any;

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  db: SQLiteObject;

  constructor(
    private sqlite: SQLite
  ) {
    if (cordova) {
      this.initDB();
    }
   }

  async initDB(): Promise<void> {
    this.db = await this.sqlite.create({name: 'sets'});

    try {
      await this.db.executeSql('CREATE TABLE sets (set_id, title, amount)');
      await this.db.executeSql('CREATE TABLE questions (set_id, question_id, title)');
      await this.db.executeSql('CREATE TABLE answers (set_id, question_id, content)');
    } catch (e) {
      console.log(e);
    }
  }

  async addQuestion(question: Question): Promise<void> {

    const questionQuery = 'INSERT INTO question (set_id, question_id, title) VALUES (?, ?, ?)';
    try {
      await this.db.executeSql(questionQuery, [question.set_id, question.question_id, question.title]);
    } catch (e) {
      throw (e);
    }

    const answer = question.answer;
    const answerQuery = 'INSERT INTO answers (set_id, question_id, content) VALUES (?, ?, ?)';
    try {
      await this.db.executeSql(answerQuery, [answer.set_id, answer.question_id, answer.content]);
    } catch (e) {
      throw (e);
    }

    await this.increaseSetAmount(question.set_id);
  }

  async deleteQuesiton(setId: number, questionId: number): Promise<void> {
    const deleteQuestionQuery = 'DELETE FROM questions WHERE set_id = ? AND question_id = ?';
    const deleteAnswerQuery = 'DELETE FROM answers WHERE set_id = ? AND question_id = ?';

    try {
      await this.db.executeSql(deleteQuestionQuery, [setId, questionId]);
    } catch (e) {
      throw (e);
    }

    try {
      await this.db.executeSql(deleteAnswerQuery, [setId, questionId]);
    } catch (e) {
      throw (e);
    }

  }

  async newSet(set: QuestionSet): Promise<void> {
    const newSetQuery = 'INSERT INTO questions (set_id, title, amount) VALUES (?, ?, ?)';
    try {
      await this.db.executeSql(newSetQuery, [set.set_id, set.title, set.questions.length]);
    } catch (e) {
      throw (e);
    }

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
    const res: QuestionSet[] = await this.db.executeSql(getQuery);
    return res;
  }

  async getSet(setId: number): Promise<QuestionSet> {
    const setQuery = 'SELECT * FROM sets WHERE set_id = ?';
    const res: QuestionSet = await this.db.executeSql(setQuery, [setId]);
    return res;
  }

  async getQuestions(setId: number): Promise<Question[]> {
    const getQuery = 'SELECT * FROM questions WHERE set_id = ?';
    const res: Question[] = await this.db.executeSql(getQuery, [setId]);
    return res;
  }

  async getAnswers(setId: number): Promise<Answer[]> {
    const getQuery = 'SELECT * FROM answers WHERE set_id = ?';
    const res: Answer[] = await this.db.executeSql(getQuery, [setId]);
    return res;
  }

  async getSetAmount(): Promise<number> {
    const amoutQuery = 'SELECT * FROM sets';
    const res: QuestionSet[] = await this.db.executeSql(amoutQuery);
    return res.length;
  }

  async getSetContent(setId: number): Promise<QuestionSet> {
    const questions = await this.getQuestions(setId);
    const answers = await this.getAnswers(setId);
    const setInfos = await this.getSet(setId);
    questions.map(question => question.answer = answers.find(answer => answer.question_id === question.question_id));

    const res: QuestionSet = {
      set_id: setId,
      title: setInfos.title,
      amount: questions.length,
      questions
    };

    return res;
  }

}
