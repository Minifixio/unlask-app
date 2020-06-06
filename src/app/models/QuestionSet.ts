import { Question } from './Question';

export interface QuestionSet {
    set_id: number;
    title: string;
    amount: number;
    questions: Question[];
}