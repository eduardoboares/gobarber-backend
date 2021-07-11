import { hash } from 'bcryptjs';
import { getRepository } from 'typeorm';
import User from '../models/User';

interface Request {
    name: string;
    email: string;
    password: string;
}

interface Response {
    name: string;
    email: string;
    password?: string;
}

export default class CreateUserService {
    public async execute({ name, email, password }: Request): Promise<Response> {
        const usersRepository = getRepository(User);

        const checkUserExists = await usersRepository.findOne({
            where: { email }
        });

        if (checkUserExists) {
            throw new Error('Email address already used.')
        }

        const hashedPassword = await hash(password, 10);

        const user = usersRepository.create({
            name,
            email,
            password: hashedPassword
        });

        await usersRepository.save(user);

        return user;
    }
}
