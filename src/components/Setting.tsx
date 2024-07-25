"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon,RefreshCcwDot } from "lucide-react"
import { Cat,Dog,Fish,Rabbit,Turtle } from "lucide-react";
import { useState } from "react"
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn,knownImageModels } from "@/lib"

import { Button } from "@/components/buttons/Button";
import { MultiSelect } from "@/components/multi-select";
import { Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle,DialogTrigger } from "@/components/ui/dialog"
import { Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage } from "@/components/ui/form";
import { HoverCard,HoverCardContent,HoverCardTrigger } from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input";
function slugToNiceName(slug?: string,float = true) {
  if (slug) {
    const niceSlug = slug.split('/').slice(1,-1).join('')
    let icon: React.ReactNode | undefined
    if (knownImageModels.some(regex => regex.test(niceSlug))) {
      icon = (
        <ImageIcon
          className={cn('mx-1 mt-1 h-3 w-3',float && 'float-left ml-0')}
        />
      )
    }
    return (
      <>
        {icon}
        {slug
          .replace(':latest','')
          .replace('gpt','GPT')
          .replaceAll(/[:-]/g,' ')
          .replaceAll(/\b\w/g,char => char.toUpperCase())}
      </>
    )
  }
  return undefined
}
const frameworksList = [
  { value: "react",label: "React",icon: Turtle },
  { value: "angular",label: "Angular",icon: Cat },
  { value: "vue",label: "Vue",icon: Dog },
  { value: "svelte",label: "Svelte",icon: Rabbit },
  { value: "ember",label: "Ember",icon: Fish },
];

const FormSchema = z.object({
  frameworks: z
    .array(z.string().min(1))
    .min(1)
    .nonempty("Please select at least one framework."),
  apiKey: z.string().nonempty("Please enter an API key."),
  apiHostProxy: z.string().nonempty("Please enter an API host or proxy."),
});
const Settings = ({ trigger }: { trigger: JSX.Element }) => {
  const [model,setModel] = useState('')
  const [temperature,setTemperature] = useState('')
  const [selectedFrameworks,setSelectedFrameworks] = useState<string[]>();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      frameworks: ["react","angular"]
    }
  })
  return (
    <Dialog>
      <HoverCard>
        <DialogTrigger asChild>
          <HoverCardTrigger>{trigger}</HoverCardTrigger>
        </DialogTrigger>

        <HoverCardContent className="border text-sm">
          <div className='font-bold'>设置</div>
          <div className="flex">
            <span className="font-semibold">模型：</span>
            {slugToNiceName(model.split('/').at(-1),false)}
          </div>
          <p>
            <span className='font-semibold'>Temperature:</span> {temperature}
          </p>
        </HoverCardContent>
      </HoverCard>

      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>设置</DialogTitle>
          <DialogDescription>
            选择其他型号、调整设置
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <Form {...form}>
            <form className="space-y-8">
              <FormField
                control={form.control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key</FormLabel>
                    <FormControl>
                      <Input defaultValue={field.value} onChange={field.onChange} placeholder="API Key" />
                    </FormControl>
                    <FormDescription>
                      You can find your API key in your dashboard.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apiHostProxy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API代理地址</FormLabel>
                    <FormControl>
                      <Input defaultValue={field.value} onChange={field.onChange} placeholder="http://api.openai.com/v1" />
                    </FormControl>
                    <FormDescription>
                      符合OpenAI API的代理地址
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frameworks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>模型</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={frameworksList}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        placeholder="Select options"
                        variant="inverted"
                        maxCount={3}
                      />
                    </FormControl>
                    <FormDescription className="flex items-center">
                      <span className="flex-1">Choose the frameworks you are interested in.</span>
                      <div className="flex items-center">
                        <Button variant='ghost' size='sm' className="px-2 py-2">
                          <RefreshCcwDot width={16} height={16} />
                        </Button>
                        <span>获取模型列表</span>
                      </div>
                      <Button type="button" className="ml-5" variant="outline" size="sm">测试连通</Button>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button variant="outline" type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Settings