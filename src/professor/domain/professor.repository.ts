import { Professor } from './professor.entity';

export const PROFESSOR_REPOSITORY = Symbol('PROFESSOR_REPOSITORY');

export interface ProfessorRepository {
    findAll(): Promise<Professor[]>;
    findById(id: string): Promise<Professor | null>;
    findByMatricula(matricula: number): Promise<Professor | null>;
    save(professor: Professor): Promise<Professor>;
    delete(id: string): Promise<void>;
}
