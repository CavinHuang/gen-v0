import Link from 'next/link'

import { Alert,AlertDescription,AlertTitle } from "@/components/ui/alert"
import { Button } from '@/components/ui/button'

import { IconQingzhu } from '@/assets/icons/qingzhu'


export default function RegisterResultPage() {
  return (
    <div className='h-full min-h-svh flex flex-col justify-center px-[100px]'>
      <Alert>
        <AlertTitle className='flex items-center'>
          <IconQingzhu className='text-green-500' />
          注册成功!
        </AlertTitle>
        <AlertDescription>
          您的验证邮件已发送，请前往验证。
          <Link href="/signin">
            <Button color="green" variant="link">
              已验证？返回登录
            </Button>
          </Link>
        </AlertDescription>
      </Alert>
    </div>
  )
}

