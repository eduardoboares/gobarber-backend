import AppError from '@shared/errors/AppError';
import { hash } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
    name: string;
    email: string;
    password: string;
}

interface IResponse {
    name: string;
    email: string;
    password?: string;
}

@injectable()
export default class CreateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository
    ) {}

    public async execute({
        name,
        email,
        password
    }: IRequest): Promise<IResponse> {
        const checkUserExists = await this.usersRepository.findByEmail(email);

        if (checkUserExists) {
            throw new AppError('Email address already used.');
        }

        const hashedPassword = await hash(password, 10);

        const user = await this.usersRepository.create({
            name,
            email,
            password: hashedPassword
        });

        return user;
    }
}
