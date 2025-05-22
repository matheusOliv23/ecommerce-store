import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function convertToPlainObject<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function formatError(error: any) {
  if(error.name === 'ZodError') {
    // ZodError
    const fieldErrors = Object.keys(error.errors).map(field => error.errors[field].message)

    return fieldErrors.join('. ')
  } else if (error.name === 'PrismaClientKnownRequestError' && error.code === 'P2002') 
  {
    // PrismaError
    const field = error.meta?.target?.[0] || 'Field';
    return `${field.charAt(0).toUpperCase() + field.slice(1)} já existe.`;
  } else {
    // Other error
    return typeof error.message === 'string' ? error.message : JSON.stringify(error.message); 
  }
}



export function round2(value: number) {
  if (typeof value === 'number') {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === 'string') {
    return Math.round((parseFloat(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error('Invalid value type');
  }
  return Math.round(value * 100) / 100;
}

const CURRENCY_FORMATTER = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
});

export function formatCurrency(value: number | string): string {
  if (typeof value === 'number') {
    return CURRENCY_FORMATTER.format(value);
  } else if (typeof value === 'string') {
    return CURRENCY_FORMATTER.format(parseFloat(value));
  } else {
    throw new Error('Invalid value type');
  }
}