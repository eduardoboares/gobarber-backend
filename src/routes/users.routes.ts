import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
    try {
        const { name, email, password } = request.body;

        const createUser = new CreateUserService();

        const user = await createUser.execute({
            name,
            email,
            password
        });

        delete user.password;

        return response.json(user);
    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
});

usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async (request, response) => {
        try {
            const UpdateUserAvatar = new UpdateUserAvatarService();

            if (!request.file?.filename) {
                return response
                    .status(400)
                    .json({ error: 'No avatar file informed.' });
            }

            const user = await UpdateUserAvatar.execute({
                user_id: request.user.id,
                avatarFilename: request.file.filename
            });

            delete user.password;

            return response.json(user);
        } catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
);

export default usersRouter;
