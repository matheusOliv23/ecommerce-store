'use server';

import { signinFormSchema } from '@/validation/validators';
import { signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

export async function signInWithCredentials(prevState: unknown, formData: FormData) {
  try {
    const user = signinFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    await signIn('credentials', user);
    return { success: true, message: 'Login realizado com sucesso' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: 'Email ou senha inválidos' };
  }
}

export async function signOutUser() {
  await signOut();
}
