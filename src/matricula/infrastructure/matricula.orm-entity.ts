import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { AlunoOrmEntity } from '../../aluno/infrastructure/aluno.orm-entity';
import { TurmaOrmEntity } from '../../turma/infrastructure/turma.orm-entity';
import { MatriculaStatus } from '../domain/matricula-status.enum';

@Entity('aluno_turma')
@Unique('uk_aluno_turma_aluno_turma', ['idAluno', 'idTurma'])
export class MatriculaOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'id_aluno', type: 'uuid' })
    idAluno!: string;

    @Column({ name: 'id_turma', type: 'uuid' })
    idTurma!: string;

    @Column({ type: 'real', nullable: true })
    nota1!: number | null;

    @Column({ type: 'real', nullable: true })
    nota2!: number | null;

    @Column({ type: 'real', nullable: true })
    nota3!: number | null;

    @Column({ type: 'real', nullable: true })
    media!: number | null;

    @Column({ type: 'char', length: 1, default: MatriculaStatus.MATRICULADO })
    status!: MatriculaStatus;

    @ManyToOne(() => AlunoOrmEntity, { nullable: false })
    @JoinColumn({ name: 'id_aluno' })
    aluno!: AlunoOrmEntity;

    @ManyToOne(() => TurmaOrmEntity, { nullable: false })
    @JoinColumn({ name: 'id_turma' })
    turma!: TurmaOrmEntity;
}
