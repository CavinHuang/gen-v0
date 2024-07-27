import { zodResolver } from "@hookform/resolvers/zod";
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

  const form = useForm<LoginFormSchemaType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  async function onSubmit(values: LoginFormSchemaType) {
    const result = await loginOrRegister(values);

    if (result?.error) {
      toast({
        title: '登录失败',
        description: result.error,
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <div>
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
            <Button size='lg' className='w-full' type="submit">
              登录/注册
            </Button>
          </div>
        </form>
      </div>
    </Form>
  )
}