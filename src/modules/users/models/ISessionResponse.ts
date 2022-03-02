import { IUserResponse } from './IUserResponse.model';

export interface ISessionResponse {
    user: IUserResponse;
    token: string;
}
