'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCallback,useEffect,useState } from 'react'
import { AiOutlineExclamationCircle,AiOutlineLoading } from 'react-icons/ai'

import { Alert,AlertDescription,AlertTitle } from "@/components/ui/alert"
import { Button } from '@/components/ui/button'

import { IconQingzhu } from '@/assets/icons/qingzhu'

import { activateUser } from './action'

export default function ActivateClient() {

  const params = useSearchParams();
  const token = params.get('token');

  const [error,setError] = useState('');
  const [success,setSucess] = useState('');

  const activate = useCallback(() => {

    setError('');
    setSucess('');

    if (!token) {
      return;
    }

    activateUser(token).then((result) => {
      if (result?.error) {
        setError(result.error);
      }
      if (result?.success) {
        setSucess(result.success);
      }
    });
  },[token])

  useEffect(() => {
    activate();
  },[activate]);

  if (!error && !success) {
    return (
      <div className='mt-[20px] min-h-svh flex flex-col justify-center px-[100px]'>
        <Alert>
          <AlertTitle className='flex items-center gap-2'>
            <AiOutlineLoading />
            激活中...
          </AlertTitle>
        </Alert>
      </div>
    )
  }

  if (success) {
    return (
      <div className='mt-[20px] min-h-svh flex flex-col justify-center px-[100px]'>
        <Alert>
          <AlertTitle className='flex items-center'>
            <IconQingzhu className='text-green-500' />
            {success}
          </AlertTitle>
          <AlertDescription>
            <Link href="/auth/login">
              <Button color="green" variant="link">
                返回登录
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className='mt-[20px] min-h-svh flex flex-col justify-center px-[100px]'>
      <Alert>
        <AlertDescription className='flex items-center gap-2'>
          <AiOutlineExclamationCircle className='text-red-700' />
          {error}
        </AlertDescription>
      </Alert>
    </div>
  )
}

