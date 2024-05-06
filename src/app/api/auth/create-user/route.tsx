import { container } from '@/dependency-injection/inversify.config';
import { TYPES } from '@/dependency-injection/types';
import { UserCreator } from '@/modules/User/application/UserCreator';
import { hash } from 'bcryptjs';
import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return new NextResponse('Invalid credentials', { status: 400 });
  }

  const hashedPassword = await hash(password, 10);

  try {
    const userCreator = container.get<UserCreator>(TYPES.UserCreator);
    await userCreator.run({
      id: randomUUID(),
      email,
      password: hashedPassword,
    });
  } catch (error) {
    return new NextResponse('Error creating user', { status: 400 });
  }

  return NextResponse.json({ email });
}
