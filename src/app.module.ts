import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { ProfessorModule } from './professor/professor.module';
import { AlunoModule } from './aluno/aluno.module';
import { DisciplinaModule } from './disciplina/disciplina.module';
import { TurmaModule } from './turma/turma.module';
import { MatriculaModule } from './matricula/matricula.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    ProfessorModule,
    AlunoModule,
    DisciplinaModule,
    TurmaModule,
    MatriculaModule,
  ],
})
export class AppModule { }
