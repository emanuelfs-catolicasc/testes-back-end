import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('aluno')
@Unique('uk_aluno_matricula', ['matricula'])
export class AlunoOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'integer' })
    matricula!: number;

    @Column({ type: 'varchar', length: 200 })
    nome!: string;
}
