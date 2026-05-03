import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlunoOrmEntity } from './infrastructure/aluno.orm-entity';
import { AlunoTypeOrmRepository } from './infrastructure/aluno.typeorm-repository';
import { ALUNO_REPOSITORY } from './domain/aluno.repository';
import { AlunoService } from './application/aluno.service';
import { AlunoController } from './interfaces/http/aluno.controller';
import { MatriculaModule } from '../matricula/matricula.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([AlunoOrmEntity]),
        forwardRef(() => MatriculaModule),
    ],
    controllers: [AlunoController],
    providers: [
        AlunoService,
        {
            provide: ALUNO_REPOSITORY,
            useClass: AlunoTypeOrmRepository,
        },
    ],
    exports: [AlunoService, ALUNO_REPOSITORY],
})
export class AlunoModule { }
