import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { DisciplinaOrmEntity } from '../../disciplina/infrastructure/disciplina.orm-entity';
import { ProfessorOrmEntity } from '../../professor/infrastructure/professor.orm-entity';

@Entity('turma')
@Unique('uk_turma_codigo', ['codigo'])
@Unique('uk_turma_disciplina_professor', ['idDisciplina', 'idProfessor'])
export class TurmaOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'char', length: 10 })
    codigo!: string;

    @Column({ name: 'id_disciplina', type: 'uuid' })
    idDisciplina!: string;

    @Column({ name: 'id_professor', type: 'uuid' })
    idProfessor!: string;

    @Column({ type: 'smallint' })
    ano!: number;

    @Column({ type: 'smallint' })
    semestre!: number;

    @ManyToOne(() => DisciplinaOrmEntity, { nullable: false })
    @JoinColumn({ name: 'id_disciplina' })
    disciplina!: DisciplinaOrmEntity;

    @ManyToOne(() => ProfessorOrmEntity, { nullable: false })
    @JoinColumn({ name: 'id_professor' })
    professor!: ProfessorOrmEntity;
}
