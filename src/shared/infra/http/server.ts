import uploadConfig from '@config/upload';
import '@shared/container';
import AppError from '@shared/errors/AppError';
import routes from '@shared/infra/http/routes';
import '@shared/infra/typeorm';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import 'reflect-metadata';

const app = express();

app.use(express.json());

app.use('/files', express.static(uploadConfig.directory));

app.use(routes);

app.use(
    (error: Error, request: Request, response: Response, _: NextFunction) => {
        if (error instanceof AppError) {
            return response.status(error.statusCode).json({
                status: 'error',
                message: error.message
            });
        }

        return response.status(500).json({
            status: 'error',
            message: 'Internar server error.'
        });
    }
);

app.listen(3333, () => {
    console.log(
        '\x1b[32m',
        '\n_____ 🚀 Server Started on port 3333! _____\n',
        '\x1b[0m'
    );
});
