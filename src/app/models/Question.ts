import { Answer } from './Answer';

export interface Question {
    set_id: number;
    question_id: number;
    title: string;
    answer: Answer;
}