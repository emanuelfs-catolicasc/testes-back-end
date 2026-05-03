import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { AlunoOrmEntity } from '../../aluno/infrastructure/aluno.orm-entity';
import { TurmaOrmEntity } from '../../turma/infrastructure/turma.orm-entity';
import { MatriculaStatus } from '../domain/matricula-status.enum';
import { charColumnType, uuidColumnType } from '../../shared/infrastructure/database/column-types';

@Entity('aluno_turma')
@Unique('uk_aluno_turma_aluno_turma', ['idAluno', 'idTurma'])
export class MatriculaOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'id_aluno', type: uuidColumnType() })
    idAluno!: string;

    @Column({ name: 'id_turma', type: uuidColumnType() })
    idTurma!: string;

    @Column({ type: 'real', nullable: true })
    nota1!: number | null;

    @Column({ type: 'real', nullable: true })
    nota2!: number | null;

    @Column({ type: 'real', nullable: true })
    nota3!: number | null;

    @Column({ type: 'real', nullable: true })
    media!: number | null;

    @Column({ type: charColumnType(), length: 1, default: MatriculaStatus.MATRICULADO })
    status!: MatriculaStatus;

    @ManyToOne(() => AlunoOrmEntity, { nullable: false })
    @JoinColumn({ name: 'id_aluno' })
    aluno!: AlunoOrmEntity;

    @ManyToOne(() => TurmaOrmEntity, { nullable: false })
    @JoinColumn({ name: 'id_turma' })
    turma!: TurmaOrmEntity;
}
