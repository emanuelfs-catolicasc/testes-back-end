import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisciplinaModule } from '../disciplina/disciplina.module';
import { ProfessorModule } from '../professor/professor.module';
import { MatriculaModule } from '../matricula/matricula.module';
import { TURMA_REPOSITORY } from './domain/turma.repository';
import { TurmaService } from './application/turma.service';
import { TurmaOrmEntity } from './infrastructure/turma.orm-entity';
import { TurmaTypeOrmRepository } from './infrastructure/turma.typeorm-repository';
import { TurmaController } from './interfaces/http/turma.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([TurmaOrmEntity]),
        forwardRef(() => DisciplinaModule),
        forwardRef(() => ProfessorModule),
        forwardRef(() => MatriculaModule),
    ],
    controllers: [TurmaController],
    providers: [
        TurmaService,
        {
            provide: TURMA_REPOSITORY,
            useClass: TurmaTypeOrmRepository,
        },
    ],
    exports: [TurmaService, TURMA_REPOSITORY],
})
export class TurmaModule { }
