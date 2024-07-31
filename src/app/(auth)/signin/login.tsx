"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from 'next/navigation'
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/buttons/Button";
import { Form,FormControl,FormField,FormItem,FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

import { loginOrRegister } from "@/app/(auth)/signin/action";

const loginFormSchema = z.object({
  email: z.string().email({
    message: "无效的邮箱格式",
  }),
  password: z.string().min(1,{
    message: "不能为空",
  }),
})

export type LoginFormSchemaType = z.infer<typeof loginFormSchema>;


export const Login = () => {

  const { toast } = useToast();
  const router = useRouter();

  const [loading,setLoading] = useState(false)

  const form = useForm<LoginFormSchemaType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  async function onSubmit(values: LoginFormSchemaType) {
    setLoading(true);
    const { isLogin,error } = await loginOrRegister(values);

    if (error) {
      toast({
        title: isLogin ? '登录失败' : '注册失败,请重试～',
        description: error,
        variant: 'destructive',
      });
    } else {
      if (isLogin) {
        router.push('/');
        toast({
          title: '登录成功',
          description: '欢迎回来',
          variant: 'success',
        })
      } else {
        router.push('/signin/result');
      }
    }
    setLoading(false);
  }

  return (
    <Form {...form}>
      <div className="flex justify-center">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[420px]"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="请输入邮箱" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className='mt-[20px]'>
                <FormControl>
                  <Input type='password' {...field} placeholder="请输入密码" />
                </FormControl>
              </FormItem>
            )}
          />
          <div className='flex justify-between mt-[20px]'>
            <Button size='lg' disabled={loading} className='w-full' type="submit">
              {loading ? <LoaderCircle className="animate-spin mr-2" /> : null}
              {loading ? '请稍后...' : '登录/注册'}
            </Button>
          </div>
        </form>
      </div>
    </Form>
  )
}