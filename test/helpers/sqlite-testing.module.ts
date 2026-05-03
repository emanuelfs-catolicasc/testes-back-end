import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const sqliteTestingOptions: TypeOrmModuleOptions = {
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    synchronize: true,
    logging: false,
    autoLoadEntities: true,
};

export const SqliteTestingModule = TypeOrmModule.forRoot(sqliteTestingOptions);
