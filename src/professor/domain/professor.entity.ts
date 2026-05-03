export class Professor {
    constructor(
        public readonly id: string | null,
        public readonly matricula: number,
        public readonly nome: string,
    ) { }

    static create(input: { matricula: number; nome: string }): Professor {
        return new Professor(null, input.matricula, input.nome);
    }

    update(input: { matricula?: number; nome?: string }): Professor {
        return new Professor(
            this.id,
            input.matricula ?? this.matricula,
            input.nome ?? this.nome,
        );
    }
}
