import { PrismaClient } from '@japi/database';
import { RegistrationSchema } from '@japi/events-schema';
import type { APIRoute } from 'astro';
import * as bcrypt from 'bcryptjs';
import * as v from 'valibot';

const prisma = new PrismaClient();

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const result = v.parse(RegistrationSchema, body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: result.email },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ message: 'El usuario ya existe' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(result.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: result.email,
        passwordHash,
        firstName: result.firstName,
        lastName: result.lastName,
        role: 'user', // Default role
      },
    });

    return new Response(
      JSON.stringify({
        message: 'Usuario creado exitosamente',
        userId: user.id,
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (err: unknown) {
    console.error('Registration Error:', err);
    const message = err instanceof Error ? err.message : 'Error interno del servidor';
    return new Response(
      JSON.stringify({
        message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};
