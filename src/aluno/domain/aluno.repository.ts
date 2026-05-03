import { Aluno } from './aluno.entity';

export const ALUNO_REPOSITORY = Symbol('ALUNO_REPOSITORY');

export interface AlunoRepository {
    findAll(): Promise<Aluno[]>;
    findById(id: string): Promise<Aluno | null>;
    findByMatricula(matricula: number): Promise<Aluno | null>;
    save(aluno: Aluno): Promise<Aluno>;
    delete(id: string): Promise<void>;
}
