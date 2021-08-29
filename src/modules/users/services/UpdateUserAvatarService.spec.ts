import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
    it('should be able to update user avatar', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider
        );

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar_example.jpg'
        });

        expect(user.avatar).toBe('avatar_example.jpg');
    });

    describe('UpdateUserAvatar', () => {
        it('should be able to update user avatar', async () => {
            const fakeUsersRepository = new FakeUsersRepository();
            const fakeStorageProvider = new FakeStorageProvider();

            const updateUserAvatar = new UpdateUserAvatarService(
                fakeUsersRepository,
                fakeStorageProvider
            );

            await expect(
                updateUserAvatar.execute({
                    user_id: 'non-existing-user',
                    avatarFilename: 'avatar_example.jpg'
                })
            ).rejects.toBeInstanceOf(AppError);
        });
    });

    it('should delete old avatar when updating new one', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider
        );

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar_example.jpg'
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar2_example.jpg'
        });

        expect(deleteFile).toHaveBeenCalledWith('avatar_example.jpg');
        expect(user.avatar).toBe('avatar2_example.jpg');
    });
});
