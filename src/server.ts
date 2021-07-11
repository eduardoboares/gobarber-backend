import express from 'express';
import 'reflect-metadata';
import uploadConfig from './config/upload';
import './database';
import routes from './routes';

const app = express();

app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.listen(3333, () => {
    console.log('Server Started on port 3333!');
});
