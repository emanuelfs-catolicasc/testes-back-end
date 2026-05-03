import { IsIn, IsInt, IsNotEmpty, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';

export class CreateTurmaDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    codigo!: string;

    @IsUUID()
    idDisciplina!: string;

    @IsUUID()
    idProfessor!: string;

    @IsInt()
    @Min(1900)
    @Max(2100)
    ano!: number;

    @IsInt()
    @IsIn([1, 2])
    semestre!: number;
}
