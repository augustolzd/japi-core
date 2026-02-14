import * as v from 'valibot';

export const RegistrationSchema = v.object({
  email: v.pipe(v.string(), v.email('Email inválido')),
  password: v.pipe(v.string(), v.minLength(8, 'La contraseña debe tener al menos 8 caracteres')),
  firstName: v.pipe(v.string(), v.minLength(2, 'Nombre muy corto')),
  lastName: v.pipe(v.string(), v.minLength(2, 'Apellido muy corto')),
});

export type RegistrationInput = v.InferOutput<typeof RegistrationSchema>;

export const LoginSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.string(),
});

export type LoginInput = v.InferOutput<typeof LoginSchema>;
