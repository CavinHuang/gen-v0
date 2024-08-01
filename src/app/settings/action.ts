"use server";

import { Prisma, UserSettings } from '@prisma/client';

import { prisma } from '@/lib/prisma';

import { auth } from '@/app/(auth)/auth';

export const getUserSettings = async () => {
  const session = await auth();
  if (!session) {
    return null;
  }
  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: session.user?.id,
    },
  });
  return userSettings;
}

export const updateUserSettings = async (data: UserSettings) => {
  const session = await auth();
  if (!session) {
    return null;
  }
  const userSettings = await prisma.userSettings.update({
    where: {
      userId: session.user?.id,
    },
    data: data as Prisma.UserSettingsUpdateInput,
  });
  return userSettings;
}