import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IUserResponse } from '../models/IUserResponse.model';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
    user_id: string;
}

@injectable()
export default class ShowProfileService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository
    ) {}

    public async execute({ user_id }: IRequest): Promise<IUserResponse> {
        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError('User not found.');
        }

        return user;
    }
}
