import { OpenAPIHono } from '@hono/zod-openapi';

import { getTextsApp } from './getTexts';

const app = new OpenAPIHono();

app.route('/', getTextsApp);

export { app as textApp };
