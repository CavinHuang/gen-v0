'use client';

import Head from 'next/head';
import * as React from 'react';
import '@/lib/env';

import { Chat } from '@/components/chat';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default function HomePage() {
  return (
    <main className='flex h-screen w-full flex-col'>
      <Head>
        <title>Hi</title>
      </Head>
      <div className='flex h-full flex-1 flex-col overflow-hidden bg-muted/40 md:gap-8'>
        <Chat />
      </div>
    </main>
  );
}
