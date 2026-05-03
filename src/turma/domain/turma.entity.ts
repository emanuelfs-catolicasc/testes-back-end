import { BusinessRuleError } from '../../shared/domain/errors/business-rule.error';

export class Turma {
    constructor(
        public readonly id: string | null,
        public readonly codigo: string,
        public readonly idDisciplina: string,
        public readonly idProfessor: string,
        public readonly ano: number,
        public readonly semestre: number,
    ) {
        if (![1, 2].includes(semestre)) {
            throw new BusinessRuleError('Semestre deve ser 1 ou 2.');
        }
    }

    static create(input: {
        codigo: string;
        idDisciplina: string;
        idProfessor: string;
        ano: number;
        semestre: number;
    }): Turma {
        return new Turma(
            null,
            input.codigo,
            input.idDisciplina,
            input.idProfessor,
            input.ano,
            input.semestre,
        );
    }

    update(input: {
        codigo?: string;
        idDisciplina?: string;
        idProfessor?: string;
        ano?: number;
        semestre?: number;
    }): Turma {
        return new Turma(
            this.id,
            input.codigo ?? this.codigo,
            input.idDisciplina ?? this.idDisciplina,
            input.idProfessor ?? this.idProfessor,
            input.ano ?? this.ano,
            input.semestre ?? this.semestre,
        );
    }
}
