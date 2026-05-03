import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { SqliteTestingModule } from './helpers/sqlite-testing.module';

import { ProfessorModule } from '../src/professor/professor.module';
import { AlunoModule } from '../src/aluno/aluno.module';
import { DisciplinaModule } from '../src/disciplina/disciplina.module';
import { TurmaModule } from '../src/turma/turma.module';
import { MatriculaModule } from '../src/matricula/matricula.module';
import { MatriculaStatus } from '../src/matricula/domain/matricula-status.enum';

type CreatedEntity = {
    id: string;
    [key: string]: unknown;
};

describe('API Acadêmica - integração com SQLite em memória', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                SqliteTestingModule,
                ProfessorModule,
                AlunoModule,
                DisciplinaModule,
                TurmaModule,
                MatriculaModule,
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('api');

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    async function createProfessor(overrides: Partial<{ matricula: number; nome: string }> = {}) {
        const payload = {
            matricula: overrides.matricula ?? Math.floor(Math.random() * 100000),
            nome: overrides.nome ?? 'Professor Teste',
        };

        const response = await request(app.getHttpServer())
            .post('/api/professores')
            .send(payload)
            .expect(201);

        return response.body as CreatedEntity;
    }

    async function createAluno(overrides: Partial<{ matricula: number; nome: string }> = {}) {
        const payload = {
            matricula: overrides.matricula ?? Math.floor(Math.random() * 100000),
            nome: overrides.nome ?? 'Aluno Teste',
        };

        const response = await request(app.getHttpServer())
            .post('/api/alunos')
            .send(payload)
            .expect(201);

        return response.body as CreatedEntity;
    }

    async function createDisciplina(overrides: Partial<{ codigo: string; nome: string }> = {}) {
        const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
        const payload = {
            codigo: overrides.codigo ?? `DISC${random}`.slice(0, 10),
            nome: overrides.nome ?? 'Disciplina Teste',
        };

        const response = await request(app.getHttpServer())
            .post('/api/disciplinas')
            .send(payload)
            .expect(201);

        return response.body as CreatedEntity;
    }

    async function createTurma(overrides: Partial<{
        codigo: string;
        idDisciplina: string;
        idProfessor: string;
        ano: number;
        semestre: number;
    }> = {}) {
        const professor = overrides.idProfessor ? null : await createProfessor();
        const disciplina = overrides.idDisciplina ? null : await createDisciplina();
        const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');

        const payload = {
            codigo: overrides.codigo ?? `TUR${random}`.slice(0, 10),
            idDisciplina: overrides.idDisciplina ?? disciplina!.id,
            idProfessor: overrides.idProfessor ?? professor!.id,
            ano: overrides.ano ?? 2026,
            semestre: overrides.semestre ?? 1,
        };

        const response = await request(app.getHttpServer())
            .post('/api/turmas')
            .send(payload)
            .expect(201);

        return response.body as CreatedEntity;
    }

    async function createMatricula(overrides: Partial<{
        idAluno: string;
        idTurma: string;
        nota1: number;
        nota2: number;
        nota3: number;
        media: number;
        status: MatriculaStatus;
    }> = {}) {
        const aluno = overrides.idAluno ? null : await createAluno();
        const turma = overrides.idTurma ? null : await createTurma();

        const payload = {
            idAluno: overrides.idAluno ?? aluno!.id,
            idTurma: overrides.idTurma ?? turma!.id,
            nota1: overrides.nota1 ?? 8,
            nota2: overrides.nota2 ?? 7,
            nota3: overrides.nota3 ?? 9,
            media: overrides.media,
            status: overrides.status ?? MatriculaStatus.MATRICULADO,
        };

        const response = await request(app.getHttpServer())
            .post('/api/matriculas')
            .send(payload)
            .expect(201);

        return response.body as CreatedEntity;
    }

    describe('Professores', () => {
        it('POST /api/professores deve criar professor', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/professores')
                .send({ matricula: 1001, nome: 'Maria Professora' })
                .expect(201);

            expect(response.body.id).toBeDefined();
            expect(response.body.matricula).toBe(1001);
            expect(response.body.nome).toBe('Maria Professora');
        });

        it('GET /api/professores deve listar professores', async () => {
            await createProfessor({ matricula: 1002, nome: 'Professor Lista' });

            const response = await request(app.getHttpServer())
                .get('/api/professores')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('GET /api/professores/:id deve buscar professor por ID', async () => {
            const professor = await createProfessor({ matricula: 1003, nome: 'Professor ID' });

            const response = await request(app.getHttpServer())
                .get(`/api/professores/${professor.id}`)
                .expect(200);

            expect(response.body.id).toBe(professor.id);
        });

        it('PUT /api/professores/:id deve atualizar professor', async () => {
            const professor = await createProfessor({ matricula: 1004, nome: 'Professor Antigo' });

            const response = await request(app.getHttpServer())
                .put(`/api/professores/${professor.id}`)
                .send({ nome: 'Professor Atualizado' })
                .expect(200);

            expect(response.body.nome).toBe('Professor Atualizado');
        });

        it('DELETE /api/professores/:id deve remover professor', async () => {
            const professor = await createProfessor({ matricula: 1005, nome: 'Professor Remover' });

            await request(app.getHttpServer())
                .delete(`/api/professores/${professor.id}`)
                .expect(200);

            await request(app.getHttpServer())
                .get(`/api/professores/${professor.id}`)
                .expect(404);
        });

        it('GET /api/professores/:id/turmas deve listar turmas do professor', async () => {
            const professor = await createProfessor({ matricula: 1006, nome: 'Professor Turmas' });
            await createTurma({ idProfessor: professor.id });

            const response = await request(app.getHttpServer())
                .get(`/api/professores/${professor.id}/turmas`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0].idProfessor).toBe(professor.id);
        });
    });

    describe('Alunos', () => {
        it('POST /api/alunos deve criar aluno', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/alunos')
                .send({ matricula: 2001, nome: 'Aluno Teste' })
                .expect(201);

            expect(response.body.id).toBeDefined();
            expect(response.body.matricula).toBe(2001);
        });

        it('GET /api/alunos deve listar alunos', async () => {
            await createAluno({ matricula: 2002, nome: 'Aluno Lista' });

            const response = await request(app.getHttpServer())
                .get('/api/alunos')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('GET /api/alunos/:id deve buscar aluno por ID', async () => {
            const aluno = await createAluno({ matricula: 2003, nome: 'Aluno ID' });

            const response = await request(app.getHttpServer())
                .get(`/api/alunos/${aluno.id}`)
                .expect(200);

            expect(response.body.id).toBe(aluno.id);
        });

        it('PUT /api/alunos/:id deve atualizar aluno', async () => {
            const aluno = await createAluno({ matricula: 2004, nome: 'Aluno Antigo' });

            const response = await request(app.getHttpServer())
                .put(`/api/alunos/${aluno.id}`)
                .send({ nome: 'Aluno Atualizado' })
                .expect(200);

            expect(response.body.nome).toBe('Aluno Atualizado');
        });

        it('DELETE /api/alunos/:id deve remover aluno', async () => {
            const aluno = await createAluno({ matricula: 2005, nome: 'Aluno Remover' });

            await request(app.getHttpServer())
                .delete(`/api/alunos/${aluno.id}`)
                .expect(200);

            await request(app.getHttpServer())
                .get(`/api/alunos/${aluno.id}`)
                .expect(404);
        });

        it('GET /api/alunos/:id/turmas deve listar matrículas/turmas do aluno', async () => {
            const aluno = await createAluno({ matricula: 2006, nome: 'Aluno Matriculado' });
            await createMatricula({ idAluno: aluno.id });

            const response = await request(app.getHttpServer())
                .get(`/api/alunos/${aluno.id}/turmas`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0].idAluno).toBe(aluno.id);
        });
    });

    describe('Disciplinas', () => {
        it('POST /api/disciplinas deve criar disciplina', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/disciplinas')
                .send({ codigo: 'MAT001', nome: 'Matemática' })
                .expect(201);

            expect(response.body.id).toBeDefined();
            expect(response.body.codigo).toBe('MAT001');
        });

        it('GET /api/disciplinas deve listar disciplinas', async () => {
            await createDisciplina({ codigo: 'HIS001', nome: 'História' });

            const response = await request(app.getHttpServer())
                .get('/api/disciplinas')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('GET /api/disciplinas/:id deve buscar disciplina por ID', async () => {
            const disciplina = await createDisciplina({ codigo: 'GEO001', nome: 'Geografia' });

            const response = await request(app.getHttpServer())
                .get(`/api/disciplinas/${disciplina.id}`)
                .expect(200);

            expect(response.body.id).toBe(disciplina.id);
        });

        it('PUT /api/disciplinas/:id deve atualizar disciplina', async () => {
            const disciplina = await createDisciplina({ codigo: 'BIO001', nome: 'Biologia' });

            const response = await request(app.getHttpServer())
                .put(`/api/disciplinas/${disciplina.id}`)
                .send({ nome: 'Biologia Atualizada' })
                .expect(200);

            expect(response.body.nome).toBe('Biologia Atualizada');
        });

        it('DELETE /api/disciplinas/:id deve remover disciplina', async () => {
            const disciplina = await createDisciplina({ codigo: 'FIS001', nome: 'Física' });

            await request(app.getHttpServer())
                .delete(`/api/disciplinas/${disciplina.id}`)
                .expect(200);

            await request(app.getHttpServer())
                .get(`/api/disciplinas/${disciplina.id}`)
                .expect(404);
        });

        it('GET /api/disciplinas/:id/turmas deve listar turmas da disciplina', async () => {
            const disciplina = await createDisciplina({ codigo: 'QUI001', nome: 'Química' });
            await createTurma({ idDisciplina: disciplina.id });

            const response = await request(app.getHttpServer())
                .get(`/api/disciplinas/${disciplina.id}/turmas`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0].idDisciplina).toBe(disciplina.id);
        });
    });

    describe('Turmas', () => {
        it('POST /api/turmas deve criar turma', async () => {
            const professor = await createProfessor({ matricula: 3001, nome: 'Professor Turma' });
            const disciplina = await createDisciplina({ codigo: 'TUR001', nome: 'Disciplina Turma' });

            const response = await request(app.getHttpServer())
                .post('/api/turmas')
                .send({
                    codigo: 'T001',
                    idDisciplina: disciplina.id,
                    idProfessor: professor.id,
                    ano: 2026,
                    semestre: 1,
                })
                .expect(201);

            expect(response.body.id).toBeDefined();
            expect(response.body.codigo).toBe('T001');
            expect(response.body.idDisciplina).toBe(disciplina.id);
            expect(response.body.idProfessor).toBe(professor.id);
        });

        it('GET /api/turmas deve listar turmas', async () => {
            await createTurma();

            const response = await request(app.getHttpServer())
                .get('/api/turmas')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('GET /api/turmas/:id deve buscar turma por ID', async () => {
            const turma = await createTurma();

            const response = await request(app.getHttpServer())
                .get(`/api/turmas/${turma.id}`)
                .expect(200);

            expect(response.body.id).toBe(turma.id);
        });

        it('PUT /api/turmas/:id deve atualizar turma', async () => {
            const turma = await createTurma();

            const response = await request(app.getHttpServer())
                .put(`/api/turmas/${turma.id}`)
                .send({ ano: 2027, semestre: 2 })
                .expect(200);

            expect(response.body.ano).toBe(2027);
            expect(response.body.semestre).toBe(2);
        });

        it('DELETE /api/turmas/:id deve remover turma', async () => {
            const turma = await createTurma();

            await request(app.getHttpServer())
                .delete(`/api/turmas/${turma.id}`)
                .expect(200);

            await request(app.getHttpServer())
                .get(`/api/turmas/${turma.id}`)
                .expect(404);
        });

        it('GET /api/turmas/:id/alunos deve listar matrículas/alunos da turma', async () => {
            const turma = await createTurma();
            await createMatricula({ idTurma: turma.id });

            const response = await request(app.getHttpServer())
                .get(`/api/turmas/${turma.id}/alunos`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0].idTurma).toBe(turma.id);
        });
    });

    describe('Matrículas', () => {
        it('POST /api/matriculas deve criar matrícula', async () => {
            const aluno = await createAluno({ matricula: 4001, nome: 'Aluno Matrícula' });
            const turma = await createTurma();

            const response = await request(app.getHttpServer())
                .post('/api/matriculas')
                .send({
                    idAluno: aluno.id,
                    idTurma: turma.id,
                    nota1: 8,
                    nota2: 7,
                    nota3: 9,
                    status: MatriculaStatus.MATRICULADO,
                })
                .expect(201);

            expect(response.body.id).toBeDefined();
            expect(response.body.idAluno).toBe(aluno.id);
            expect(response.body.idTurma).toBe(turma.id);
            expect(response.body.media).toBe(8);
            expect(response.body.status).toBe(MatriculaStatus.MATRICULADO);
        });

        it('GET /api/matriculas deve listar matrículas', async () => {
            await createMatricula();

            const response = await request(app.getHttpServer())
                .get('/api/matriculas')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('GET /api/matriculas/:id deve buscar matrícula por ID', async () => {
            const matricula = await createMatricula();

            const response = await request(app.getHttpServer())
                .get(`/api/matriculas/${matricula.id}`)
                .expect(200);

            expect(response.body.id).toBe(matricula.id);
        });

        it('PUT /api/matriculas/:id deve atualizar matrícula', async () => {
            const matricula = await createMatricula();

            const response = await request(app.getHttpServer())
                .put(`/api/matriculas/${matricula.id}`)
                .send({
                    nota1: 10,
                    nota2: 9,
                    nota3: 8,
                    status: MatriculaStatus.APROVADO,
                })
                .expect(200);

            expect(response.body.nota1).toBe(10);
            expect(response.body.nota2).toBe(9);
            expect(response.body.nota3).toBe(8);
            expect(response.body.media).toBe(9);
            expect(response.body.status).toBe(MatriculaStatus.APROVADO);
        });

        it('DELETE /api/matriculas/:id deve remover matrícula', async () => {
            const matricula = await createMatricula();

            await request(app.getHttpServer())
                .delete(`/api/matriculas/${matricula.id}`)
                .expect(200);

            await request(app.getHttpServer())
                .get(`/api/matriculas/${matricula.id}`)
                .expect(404);
        });
    });

    describe('Validações e regras de negócio', () => {
        it('deve rejeitar professor com matrícula duplicada', async () => {
            await createProfessor({ matricula: 9001, nome: 'Professor 1' });

            await request(app.getHttpServer())
                .post('/api/professores')
                .send({ matricula: 9001, nome: 'Professor 2' })
                .expect(409);
        });

        it('deve rejeitar aluno com matrícula duplicada', async () => {
            await createAluno({ matricula: 9002, nome: 'Aluno 1' });

            await request(app.getHttpServer())
                .post('/api/alunos')
                .send({ matricula: 9002, nome: 'Aluno 2' })
                .expect(409);
        });

        it('deve rejeitar disciplina com código duplicado', async () => {
            await createDisciplina({ codigo: 'DUP001', nome: 'Disciplina 1' });

            await request(app.getHttpServer())
                .post('/api/disciplinas')
                .send({ codigo: 'DUP001', nome: 'Disciplina 2' })
                .expect(409);
        });

        it('deve rejeitar turma com semestre inválido', async () => {
            const professor = await createProfessor();
            const disciplina = await createDisciplina();

            await request(app.getHttpServer())
                .post('/api/turmas')
                .send({
                    codigo: 'TINV01',
                    idDisciplina: disciplina.id,
                    idProfessor: professor.id,
                    ano: 2026,
                    semestre: 3,
                })
                .expect(400);
        });

        it('deve rejeitar matrícula duplicada para o mesmo aluno e turma', async () => {
            const aluno = await createAluno();
            const turma = await createTurma();

            await createMatricula({ idAluno: aluno.id, idTurma: turma.id });

            await request(app.getHttpServer())
                .post('/api/matriculas')
                .send({ idAluno: aluno.id, idTurma: turma.id })
                .expect(409);
        });

        it('deve rejeitar nota fora do intervalo permitido', async () => {
            const aluno = await createAluno();
            const turma = await createTurma();

            await request(app.getHttpServer())
                .post('/api/matriculas')
                .send({
                    idAluno: aluno.id,
                    idTurma: turma.id,
                    nota1: 11,
                    nota2: 8,
                    nota3: 7,
                })
                .expect(400);
        });
    });
});
