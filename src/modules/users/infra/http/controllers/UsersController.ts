import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class UsersController {
    async create(request: Request, response: Response): Promise<Response> {
        try {
            const { email, password } = request.body;

            const AuthenticateUser = container.resolve(AuthenticateUserService);

            const { user, token } = await AuthenticateUser.execute({
                email,
                password
            });

            return response.json({ user, token });
        } catch (error) {
            return response.json(error);
        }
    }
}
