import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import authConfig from '../config/auth';
import AppError from '../errors/AppError';
import User from '../models/User';

interface Request {
    email: string;
    password: string;
}

interface Response {
    user: {
        id: string;
        email: string;
        password?: string;
        avatar?: string;
        created_at: Date;
        updated_at: Date;
    };
    token: string;
}

export default class AuthenticateUserService {
    public async execute({ email, password }: Request): Promise<Response> {
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne({ where: { email } });

        if (!user) {
            throw new AppError('Incorrect email/password combination.', 401);
        }

        const passwordMatched = await compare(password, user.password);

        if (!passwordMatched) {
            throw new AppError('Incorrect email/password combination.', 401);
        }

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn
        });

        return {
            user,
            token
        };
    }
}
