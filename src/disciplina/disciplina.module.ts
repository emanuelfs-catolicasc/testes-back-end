import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisciplinaOrmEntity } from './infrastructure/disciplina.orm-entity';
import { DisciplinaTypeOrmRepository } from './infrastructure/disciplina.typeorm-repository';
import { DISCIPLINA_REPOSITORY } from './domain/disciplina.repository';
import { DisciplinaService } from './application/disciplina.service';
import { DisciplinaController } from './interfaces/http/disciplina.controller';
import { TurmaModule } from '../turma/turma.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([DisciplinaOrmEntity]),
        forwardRef(() => TurmaModule),
    ],
    controllers: [DisciplinaController],
    providers: [
        DisciplinaService,
        {
            provide: DISCIPLINA_REPOSITORY,
            useClass: DisciplinaTypeOrmRepository,
        },
    ],
    exports: [DisciplinaService, DISCIPLINA_REPOSITORY],
})
export class DisciplinaModule { }
