import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(3, { message: 'O nome é obrigatório' }),
  email: z.string().email({ message: 'Email inválido' }),
});
