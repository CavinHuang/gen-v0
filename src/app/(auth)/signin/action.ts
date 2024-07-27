'use server';

import bcrypt from 'bcrypt';
import { AuthError } from 'next-auth';
import { v4 as uuid } from 'uuid';

import { sendEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';

import { signIn } from '@/app/(auth)/auth';

import type { LoginFormSchemaType } from './login';

export const loginWithGithub = async () => {
  await signIn('github', {
    redirectTo: '/user',
  });
};

export const loginWithGoogle = async () => {
  await signIn('google', {
    redirectTo: '/user',
  });
};

export const loginWithCredentials = async (
  credentials: LoginFormSchemaType
): Promise<void | {error?: string}> => {
  const existUser = await prisma.user.findUnique({
    where: {
      email: credentials.email,
    },
  });

  if (!existUser || !existUser.email) {
    return {
      error: '用户名不存在',
    };
  }

  if (!existUser.emailVerified) {
    return {
      error: '用户未激活，请激活后登录',
    };
  }

  try {
    await signIn('credentials', {
      ...credentials,
      redirectTo: '/user',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: '用户名或密码错误',
      };
    }

    // 这里一定要抛出异常，不然成功登录后不会重定向
    throw error;
  }
};

export const register = async (data: LoginFormSchemaType) => {
  const existUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existUser) {
    return {
      error: '当前邮箱已存在！',
    };
  }

  // 给密码加盐，密码明文存数据库不安全
  const hashedPassword = await bcrypt.hash(data.password, 10);

  await prisma.user.create({
    data: {
      name: data.email,
      password: hashedPassword,
      email: data.email,
    },
  });

  const token = uuid();

  // 数据中生成一个验证token，过期时间为1小时
  await prisma.verificationToken.create({
    data: {
      identifier: data.email,
      token,
      expires: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  await sendEmail({
    to: data.email,
    subject: '注册成功',
    html: `点击激活账号 <a href="https://localhost:3000/signin/activate?token=${token}">激活</a>`,
  });

};

export const loginOrRegister = async (data: LoginFormSchemaType) => {
  const existUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existUser) {
    return loginWithCredentials(data);
  }
  return register(data);
}