import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { charColumnType } from '../../shared/infrastructure/database/column-types';

@Entity('disciplina')
@Unique('uk_disciplina_codigo', ['codigo'])
export class DisciplinaOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: charColumnType(), length: 10 })
    codigo!: string;

    @Column({ type: 'varchar', length: 200 })
    nome!: string;
}
