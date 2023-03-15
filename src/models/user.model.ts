import { Injectable } from '@nestjs/common';
import { Database } from 'src/providers/database';

@Injectable()
export class UserModel {
  constructor(private readonly database: Database) {}

  // This function takes an email and returns the user object associated with it.
  async getUserByEmail(email: string) {
    const res = await this.database
      .selectFrom('users')
      .where('email', '=', email)
      .selectAll()
      .executeTakeFirstOrThrow();

    return res;
  }

  // This function gets a user by their id. It uses the database to do so.
  async getUserById(id: number) {
    const res = await this.database
      .selectFrom('users')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirstOrThrow();

    return res;
  }

  // This function gets a user by their session. It uses the database to do so.
  async getUserBySession(session: string) {
    const res = await this.database
      .selectFrom('users')
      .innerJoin('sessions', 'users.id', 'sessions.user_id')
      .where('sessions.id', '=', Buffer.from(session, 'hex'))
      .select(['users.id', 'users.name', 'users.email'])
      .executeTakeFirstOrThrow();

    return res;
  }

  async getUserRoles(id: number) {
    const res = await this.database
      .selectFrom('roles')
      .innerJoin('user_roles', 'roles.id', 'user_roles.role_id')
      .where('user_roles.user_id', '=', id)
      .select(['roles.id', 'roles.name'])
      .execute();

    return res;
  }

  // This function creates a new user in the database.
  async createUser(
    name: string,
    email: string,
    password: string,
    salt: Buffer,
  ) {
    const res = await this.database
      .insertInto('users')
      .values({
        name,
        email,
        password,
        salt,
      })
      .executeTakeFirstOrThrow();

    return res;
  }

  async updateUser(id: number, name: string, email: string) {
    const res = await this.database
      .updateTable('users')
      .set({
        name,
        email,
      })
      .where('id', '=', id)
      .execute();

    return res;
  }

  async deleteUser(id: number) {
    const res = await this.database
      .deleteFrom('users')
      .where('id', '=', id)
      .execute();

    return res;
  }
}
