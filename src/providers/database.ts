import { Injectable } from '@nestjs/common';
import { createPool } from 'mysql2';
import { Kysely, MysqlDialect, Generated } from 'kysely';

export interface DatabaseStructure {
  roles: {
    id: Generated<number>;
    name: string;
    created_at: Generated<Date>;
    updated_at: Generated<Date>;
  };
  users: {
    id: Generated<number>;
    name: string;
    email: string;
    password: string;
    salt: Buffer;
    created_at: Generated<Date>;
    updated_at: Generated<Date>;
  };
  user_roles: {
    id: Generated<number>;
    user_id: number;
    role_id: number;
    created_at: Generated<Date>;
    updated_at: Generated<Date>;
  };
  sessions: {
    id: Buffer;
    user_id: number;
    created_at: Generated<Date>;
    updated_at: Generated<Date>;
  };
  posts: {
    id: Generated<number>;
    title: string;
    content: string;
    user_id: number;
    created_at: Generated<Date>;
    updated_at: Generated<Date>;
  };
}

@Injectable()
export class Database extends Kysely<DatabaseStructure> {
  constructor() {
    super({
      dialect: new MysqlDialect({
        pool: createPool({
          host: '172.23.0.2',
          user: 'root',
          password: 'example',
          database: 'backendapi',
        }),
      }),
    });
  }
}
