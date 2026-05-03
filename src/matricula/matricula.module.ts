import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlunoModule } from '../aluno/aluno.module';
import { TurmaModule } from '../turma/turma.module';
import { MATRICULA_REPOSITORY } from './domain/matricula.repository';
import { MatriculaService } from './application/matricula.service';
import { MatriculaOrmEntity } from './infrastructure/matricula.orm-entity';
import { MatriculaTypeOrmRepository } from './infrastructure/matricula.typeorm-repository';
import { MatriculaController } from './interfaces/http/matricula.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([MatriculaOrmEntity]),
        forwardRef(() => AlunoModule),
        forwardRef(() => TurmaModule),
    ],
    controllers: [MatriculaController],
    providers: [
        MatriculaService,
        {
            provide: MATRICULA_REPOSITORY,
            useClass: MatriculaTypeOrmRepository,
        },
    ],
    exports: [MatriculaService, MATRICULA_REPOSITORY],
})
export class MatriculaModule { }
