import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { hash } from 'argon2';

import { SessionModel } from 'src/models/session.model';
import { UserModel } from 'src/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userModel: UserModel,
    private readonly sessionModel: SessionModel,
  ) {}

  /**
   * This function creates a random binary buffer of the specified length. It
   * uses the Node.js randomBytes function to generate the buffer.
   *
   * @param {number} length
   * @returns {Promise<Buffer>}
   * @throws {Error} If the length is less than 1.
   * @throws {Error} If the buffer length is not equal to the specified length.
   */
  async createBin(length: number): Promise<Buffer> {
    if (length < 1) {
      throw new Error(`Invalid length: ${length}`);
    }

    return new Promise((resolve, reject) => {
      randomBytes(length, (err, buf) => {
        if (err) return reject(err);
        if (buf.length !== length) {
          return reject(
            new Error(
              `Unexpected buffer length: ${buf.length} (expected: ${length})`,
            ),
          );
        }
        resolve(buf);
      });
    });
  }

  /**
   * Creates a new user in the database.
   *
   * @param name The name of the new user.
   * @param email The email address of the new user.
   * @param password The password of the new user.
   * @returns Promise<InsertResult> The result of the insert operation.
   * @throws InternalServerErrorException if the user could not be created.
   */
  async createUser(name: string, email: string, password: string) {
    const salt = await this.createBin(16);
    const pwHash = await hash(password, { salt });
    if (!salt || !pwHash) {
      throw new InternalServerErrorException('Failed to create user');
    }
    return this.userModel.createUser(name, email, pwHash, salt);
  }

  /**
   * Creates a new session for the specified user.
   * @param userId The id of the user to create a session for.
   * @returns Promise<string> The session id.
   * @throws InternalServerErrorException if the session could not be created.
   */
  async createSession(userId: number | bigint): Promise<string> {
    const res = this.sessionModel.createSession(
      await this.createBin(32),
      Number(userId),
    );

    if (!res) {
      throw new InternalServerErrorException('Failed to create session');
    }

    return res;
  }
}
