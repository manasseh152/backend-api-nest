import { Injectable } from '@nestjs/common';
import { Database } from 'src/providers/database';

@Injectable()
export class SessionModel {
  constructor(private readonly database: Database) {}

  async createSession(id: Buffer, userId: number) {
    this.database
      .insertInto('sessions')
      .values({
        id,
        user_id: userId,
      })
      .returning(['id'])
      .executeTakeFirstOrThrow();

    return id.toString('hex');
  }

  async deleteSession(session: string) {
    const res = await this.database
      .deleteFrom('sessions')
      .where('id', '=', Buffer.from(session, 'hex'))
      .executeTakeFirstOrThrow();

    return res;
  }
}
