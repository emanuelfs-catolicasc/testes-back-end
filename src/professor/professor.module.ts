import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessorOrmEntity } from './infrastructure/professor.orm-entity';
import { ProfessorTypeOrmRepository } from './infrastructure/professor.typeorm-repository';
import { PROFESSOR_REPOSITORY } from './domain/professor.repository';
import { ProfessorService } from './application/professor.service';
import { ProfessorController } from './interfaces/http/professor.controller';
import { TurmaModule } from '../turma/turma.module';

@Module({
    imports: [TypeOrmModule.forFeature([ProfessorOrmEntity]), TurmaModule],
    controllers: [ProfessorController],
    providers: [
        ProfessorService,
        {
            provide: PROFESSOR_REPOSITORY,
            useClass: ProfessorTypeOrmRepository,
        },
    ],
    exports: [ProfessorService, PROFESSOR_REPOSITORY],
})
export class ProfessorModule { }
