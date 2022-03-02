import ICreateUsersDTO from '../dtos/ICreateUsersDTO';
import IFindAllProviderDTO from '../dtos/IFindAllProvidersDTO';
import User from '../infra/typeorm/entities/User';

export default interface IUsersRepository {
    findById(id: string): Promise<User | undefined>;
    findByEmail(email: string): Promise<User | undefined>;
    findAllProviders(data: IFindAllProviderDTO): Promise<User[]>;
    create(data: ICreateUsersDTO): Promise<User>;
    save(data: User): Promise<User>;
}
