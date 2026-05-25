import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { apiRouter } from './routes/api.routes.js';
import { swaggerSpec } from './docs/swagger.js';
import { sendError, sendSuccess } from './utils/responses.js';

export const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);
app.get('/api-docs.json', (_req, res) => {
  res.json(swaggerSpec);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (_req, res) => {
  sendSuccess(res, { service: 'StudyHub API' }, 'Lấy dữ liệu thành công');
});

app.use((_req, res) => {
  sendError(res, 404, 'Not found');
});

app.use((error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  sendError(res, statusCode, error.message || 'Internal server error');
});
