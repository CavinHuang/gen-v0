"use server";

import { prisma } from '@/lib/prisma';

export const getUserSettings = async (userId: string) => {
  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId,
    },
  });
  return userSettings;
}