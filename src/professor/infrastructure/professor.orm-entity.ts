import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('professor')
@Unique('uk_professor_matricula', ['matricula'])
export class ProfessorOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'integer' })
    matricula!: number;

    @Column({ type: 'varchar', length: 200 })
    nome!: string;
}
