import { formatNumberWithDecimal } from '@/lib/utils';
import { z } from 'zod';

export const insertProductSchema = z.object({
  name: z.string().min(1, { message: 'O nome é obrigatório' }),
  description: z.string().min(1, { message: 'A descrição é obrigatória' }),
  stock: z.number().min(0, { message: 'O estoque é obrigatório' }),
  category: z.string().min(1, { message: 'A categoria é obrigatória' }),
  brand: z.string().min(1, { message: 'A marca é obrigatória' }),
  images: z
    .array(z.string())
    .min(1, { message: 'As imagens são obrigatórias' }),
  slug: z.string().optional(),
  isFeatured: z.boolean(),
  banner: z.string().optional(),
  price: z
    .string()
    .refine(
      (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
      'O preço deve ser um número válido com duas casas decimais'
    ),
});

export const signinFormSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z
    .string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});

