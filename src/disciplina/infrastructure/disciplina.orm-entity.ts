import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('disciplina')
@Unique('uk_disciplina_codigo', ['codigo'])
export class DisciplinaOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'char', length: 10 })
    codigo!: string;

    @Column({ type: 'varchar', length: 200 })
    nome!: string;
}
