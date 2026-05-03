import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { MatriculaService } from '../../application/matricula.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Matrículas')
@Controller('matriculas')
export class MatriculaController {
    constructor(private readonly matriculaService: MatriculaService) { }

    @Get()
    @ApiOperation({ summary: 'Lista todos as matrículas' })
    @ApiResponse({ status: 200, description: 'Lista de matrículas retornada com sucesso.' })
    findAll() {
        return this.matriculaService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Busca uma matrícula pelo ID' })
    @ApiResponse({ status: 200, description: 'Matrícula encontrada.' })
    @ApiResponse({ status: 404, description: 'Matrícula não encontrada.' })
    findById(@Param('id', ParseUUIDPipe) id: string) {
        return this.matriculaService.findById(id);
    }

    @Post()
    create(@Body() dto: CreateMatriculaDto) {
        return this.matriculaService.create(dto);
    }

    @Put(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateMatriculaDto) {
        return this.matriculaService.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.matriculaService.delete(id);
    }
}
