'use server';

import bcrypt, { compare } from 'bcrypt';
import { AuthError } from 'next-auth';
import { v4 as uuid } from 'uuid';

import { sendEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';

import { signIn } from '@/app/(auth)/auth';

import type { LoginFormSchemaType } from './login';

export const loginWithGithub = async () => {
  await signIn('github', {
    redirectTo: '/',
  });
};

export const loginWithGoogle = async () => {
  await signIn('google', {
    redirectTo: '/',
  });
};

export const loginWithCredentials = async (
  credentials: LoginFormSchemaType
): Promise<void | { error?: string }> => {
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

  try {
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
      html: `点击激活账号 <a href="http://localhost:3000/signin/activate?token=${token}">激活</a>`,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: error.message,
      };
    }

    // 这里一定要抛出异常，不然成功登录后不会重定向
    throw error;
  }
};

export const loginOrRegister = async (data: LoginFormSchemaType) => {
  const existUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  const result = {
    isLogin: false,
    error: '',
  };

  if (existUser) {
    const loginRes = await loginWithCredentials(data);
    result.isLogin = true
    if (loginRes?.error) {
      result.error = loginRes.error;
    }
  } else {
    const registerRes = await register(data);
    if (registerRes?.error) {
      result.error = registerRes.error;
    }
  }
  return result;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return await compare(password, hashedPassword);
};

export const initUserSettings = async (userId: string) => {
  const exitsSettings = await prisma.userSettings.findFirst({
    where: {
      userId,
    },
  });
  if (exitsSettings) {
    return;
  }
  await prisma.userSettings.create({
    data: {
      userId,
      theme: 'light',
      locale: 'zh-CN',
      openAiDisabled: false,
      openAiSelectedModels: ['gpt-4o-mini'],
      openHostProxy: '',
      openAiApiKey: '',
      ollamaDisabled: true,
      ollamaSelectedModels: [],
      ollamaHost: '',
      supportVisual: false,
      temperature: 0.6,
      systemPrompt: `🎉 Greetings, TailwindCSS Virtuoso! 🌟

You've mastered the art of frontend design and TailwindCSS! Your mission is to transform detailed descriptions or compelling images into stunning HTML using the versatility of TailwindCSS. Ensure your creations are seamless in both dark and light modes! Your designs should be responsive and adaptable across all devices – be it desktop, tablet, or mobile.

*Design Guidelines:*
- Utilize placehold.co for placeholder images and descriptive alt text.
- For interactive elements, leverage modern ES6 JavaScript and native browser APIs for enhanced functionality.
- Inspired by shadcn, we provide the following colors which handle both light and dark mode:

\`\`\`css
  --background
  --foreground
  --primary
	--border
  --input
  --ring
  --primary-foreground
  --secondary
  --secondary-foreground
  --accent
  --accent-foreground
  --destructive
  --destructive-foreground
  --muted
  --muted-foreground
  --card
  --card-foreground
  --popover
  --popover-foreground
\`\`\`

Prefer using these colors when appropriate, for example:

\`\`\`html
<button class="bg-secondary text-secondary-foreground hover:bg-secondary/80">Click me</button>
<span class="text-muted-foreground">This is muted text</span>
\`\`\`

*Implementation Rules:*
- Only implement elements within the \`<body>\` tag, don't bother with \`<html>\` or \`<head>\` tags.
- Avoid using SVGs directly. Instead, use the \`<img>\` tag with a descriptive title as the alt attribute and add .svg to the placehold.co url, for example:

\`\`\`html
<img aria-hidden="true" alt="magic-wand" src="/icons/24x24.svg?text=🪄" />
\`\`\`
`
    },
  });
}