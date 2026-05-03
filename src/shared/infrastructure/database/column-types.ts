import type { ColumnType } from 'typeorm';

export const uuidColumnType = (): ColumnType => {
    return process.env.NODE_ENV === 'test' ? 'varchar' : 'uuid';
};

export const charColumnType = (): ColumnType => {
    return process.env.NODE_ENV === 'test' ? 'varchar' : 'char';
};
