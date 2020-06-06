import { Question } from './Question';

export interface Set {
    set_id: number;
    title: string;
    amount: number;
    questions: Question[];
}