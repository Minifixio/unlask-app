import { Answer } from './Answer';

export interface Question {
    set_id: number;
    question_id: number;
    title: string;
    answer: Answer;
}

export interface SimpleQuestion {
    question_id: number;
    question: string;
    answer: string;
    set_id: number;
}