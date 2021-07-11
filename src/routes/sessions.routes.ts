import { Router } from 'express';
import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

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

sessionsRouter.post('/', async (request, response) => {
    try {
        const { email, password } = request.body;

        const AuthenticateUser = new AuthenticateUserService();

        const { user, token } = await AuthenticateUser.execute({
            email,
            password
        });

        delete user.password;

        return response.json({ user, token });
    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
});

export default sessionsRouter;
