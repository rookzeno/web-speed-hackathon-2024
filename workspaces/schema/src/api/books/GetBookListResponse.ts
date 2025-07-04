import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { author, book, image } from '../../models';

export const GetBookListResponseSchema = createSelectSchema(book)
  .pick({
    description: true,
    id: true,
    name: true,
    nameRuby: true,
  })
  .extend({
    author: createSelectSchema(author).pick({
      description: true,
      id: true,
      name: true,
    }),
    image: createSelectSchema(image).pick({
      alt: true,
      id: true,
    }),
  })
  .array();

export type GetBookListResponse = z.infer<typeof GetBookListResponseSchema>;
