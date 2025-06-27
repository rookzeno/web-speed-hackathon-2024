import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { z } from 'zod';

import { COMPANY } from '../../../constants/Company';
import { CONTACT } from '../../../constants/Contact';
import { OVERVIEW } from '../../../constants/Overview';
import { QUESTION } from '../../../constants/Question';
import { TERM } from '../../../constants/Term';

const app = new OpenAPIHono();

const ParamsSchema = z.object({
  type: z.enum(['term', 'contact', 'question', 'company', 'overview']),
});

const ResponseSchema = z.object({
  content: z.string(),
  type: z.string(),
});

const route = createRoute({
  method: 'get',
  path: '/api/v1/texts/{type}',
  request: {
    params: ParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ResponseSchema,
        },
      },
      description: 'OK',
    },
    404: {
      description: 'Not Found',
    },
  },
});

app.openapi(route, async (c) => {
  const { type } = c.req.param();

  let content: string;
  switch (type) {
    case 'term':
      content = TERM;
      break;
    case 'contact':
      content = CONTACT;
      break;
    case 'question':
      content = QUESTION;
      break;
    case 'company':
      content = COMPANY;
      break;
    case 'overview':
      content = OVERVIEW;
      break;
    default:
      return c.json({ error: 'Invalid text type' }, 404);
  }

  return c.json({ content, type });
});

export { app as getTextsApp };
