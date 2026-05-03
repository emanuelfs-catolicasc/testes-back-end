import { IsEnum, IsNumber, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { MatriculaStatus } from '../../../domain/matricula-status.enum';

export class CreateMatriculaDto {
    @IsUUID()
    idAluno!: string;

    @IsUUID()
    idTurma!: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(10)
    nota1?: number | null;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(10)
    nota2?: number | null;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(10)
    nota3?: number | null;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(10)
    media?: number | null;

    @IsOptional()
    @IsEnum(MatriculaStatus)
    status?: MatriculaStatus;
}
