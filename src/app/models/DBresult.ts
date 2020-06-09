import { DBItem } from './DBItem';

export interface DBResult {
    rows: {
        item: DBItem;
        length: number;
    };
}
