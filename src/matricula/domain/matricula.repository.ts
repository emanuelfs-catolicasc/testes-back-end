import { Matricula } from './matricula.entity';

export const MATRICULA_REPOSITORY = Symbol('MATRICULA_REPOSITORY');

export interface MatriculaRepository {
    findAll(): Promise<Matricula[]>;
    findById(id: string): Promise<Matricula | null>;
    findByAlunoId(idAluno: string): Promise<Matricula[]>;
    findByTurmaId(idTurma: string): Promise<Matricula[]>;
    findByAlunoAndTurma(idAluno: string, idTurma: string): Promise<Matricula | null>;
    save(matricula: Matricula): Promise<Matricula>;
    delete(id: string): Promise<void>;
}
