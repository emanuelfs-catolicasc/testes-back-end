import { BusinessRuleError } from '../../shared/domain/errors/business-rule.error';
import { MatriculaStatus } from './matricula-status.enum';

export class Matricula {
    constructor(
        public readonly id: string | null,
        public readonly idAluno: string,
        public readonly idTurma: string,
        public readonly nota1: number | null,
        public readonly nota2: number | null,
        public readonly nota3: number | null,
        public readonly media: number | null,
        public readonly status: MatriculaStatus,
    ) {
        this.validateNota(nota1, 'nota1');
        this.validateNota(nota2, 'nota2');
        this.validateNota(nota3, 'nota3');
        this.validateNota(media, 'media');
    }

    static create(input: {
        idAluno: string;
        idTurma: string;
        nota1?: number | null;
        nota2?: number | null;
        nota3?: number | null;
        media?: number | null;
        status?: MatriculaStatus;
    }): Matricula {
        const nota1 = input.nota1 ?? null;
        const nota2 = input.nota2 ?? null;
        const nota3 = input.nota3 ?? null;
        const media = input.media ?? Matricula.calculateMedia(nota1, nota2, nota3);

        return new Matricula(
            null,
            input.idAluno,
            input.idTurma,
            nota1,
            nota2,
            nota3,
            media,
            input.status ?? MatriculaStatus.MATRICULADO,
        );
    }

    update(input: {
        idAluno?: string;
        idTurma?: string;
        nota1?: number | null;
        nota2?: number | null;
        nota3?: number | null;
        media?: number | null;
        status?: MatriculaStatus;
    }): Matricula {
        const nota1 = input.nota1 !== undefined ? input.nota1 : this.nota1;
        const nota2 = input.nota2 !== undefined ? input.nota2 : this.nota2;
        const nota3 = input.nota3 !== undefined ? input.nota3 : this.nota3;
        const media = input.media !== undefined ? input.media : Matricula.calculateMedia(nota1, nota2, nota3);

        return new Matricula(
            this.id,
            input.idAluno ?? this.idAluno,
            input.idTurma ?? this.idTurma,
            nota1,
            nota2,
            nota3,
            media,
            input.status ?? this.status,
        );
    }

    private static calculateMedia(nota1: number | null, nota2: number | null, nota3: number | null): number | null {
        if (nota1 === null || nota2 === null || nota3 === null) return null;
        return Number(((nota1 + nota2 + nota3) / 3).toFixed(2));
    }

    private validateNota(value: number | null, field: string): void {
        if (value === null) return;
        if (value < 0 || value > 10) {
            throw new BusinessRuleError(`${field} deve estar entre 0 e 10.`);
        }
    }
}
