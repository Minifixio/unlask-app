import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Question } from '../models/Question';
import { Set } from '../models/Set';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  db: SQLiteObject;

  constructor(
    private sqlite: SQLite
  ) {
    this.initDB();
   }

  async initDB(): Promise<void> {
    this.db = await this.sqlite.create({name: 'sets'});

    try {
      await this.db.executeSql('CREATE TABLE set (set_id, title, amount)');
      await this.db.executeSql('CREATE TABLE question (set_id, question_id, title)');
      await this.db.executeSql('CREATE TABLE answer (set_id, question_id, content)');
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
    const answerQuery = 'INSERT INTO answer (set_id, question_id, content) VALUES (?, ?, ?)';
    try {
      await this.db.executeSql(answerQuery, [answer.set_id, answer.question_id, answer.content]);
    } catch (e) {
      throw (e);
    }

    await this.increaseSetAmount(question.set_id);
  }

  async deleteQuesiton(setId: number, questionId: number): Promise<void> {
    const deleteQuestionQuery = 'DELETE FROM question WHERE set_id = ? AND question_id = ?';
    const deleteAnswerQuery = 'DELETE FROM answer WHERE set_id = ? AND question_id = ?';

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

  async newSet(set: Set): Promise<void> {
    const newSetQuery = 'INSERT INTO question (set_id, title, amount) VALUES (?, ?, ?)';
    try {
      await this.db.executeSql(newSetQuery, [set.set_id, set.title, set.questions.length]);
    } catch (e) {
      throw (e);
    }

    for (const question of set.questions) {
      await this.addQuestion(question);
    }
  }

  async increaseSetAmount(id: number): Promise<void> {
    const updateQuery = 'UPDATE set SET amount = amount + 1 WHERE set_id = ?';
    try {
      await this.db.executeSql(updateQuery, [id]);
    } catch (e) {
      throw (e);
    }
  }

  async descreaseSetAmount(id: number): Promise<void> {
    const updateQuery = 'UPDATE set SET amount = amount - 1 WHERE set_id = ?';
    try {
      await this.db.executeSql(updateQuery, [id]);
    } catch (e) {
      throw (e);
    }
  }

}
