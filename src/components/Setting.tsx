"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronUp,ImageIcon,RefreshCcwDot } from "lucide-react"
import { Cat,Dog,Fish,Rabbit,Turtle } from "lucide-react";
import { useState } from "react"
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn,knownImageModels } from "@/lib"

import { Button } from "@/components/buttons/Button";
import { MultiSelect } from "@/components/multi-select";
import { Collapsible,CollapsibleContent,CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle,DialogTrigger } from "@/components/ui/dialog"
import { Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage } from "@/components/ui/form";
import { HoverCard,HoverCardContent,HoverCardTrigger } from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/Textarea";
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
  const [open,setOpen] = useState(false);

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
              {/* OpenAi */}
              <Collapsible open={open} onOpenChange={setOpen} className="border rounded-lg">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center py-2 px-2 bg-gray-100">
                    <div onClick={(e) => { e.stopPropagation(); e.preventDefault() }}>
                      <Switch className="mr-4" />
                    </div>
                    <div className="flex-1 flex items-center">
                      <svg fill="currentColor" fill-rule="evenodd" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><title>OpenAI</title><path d="M21.55 10.004a5.416 5.416 0 00-.478-4.501c-1.217-2.09-3.662-3.166-6.05-2.66A5.59 5.59 0 0010.831 1C8.39.995 6.224 2.546 5.473 4.838A5.553 5.553 0 001.76 7.496a5.487 5.487 0 00.691 6.5 5.416 5.416 0 00.477 4.502c1.217 2.09 3.662 3.165 6.05 2.66A5.586 5.586 0 0013.168 23c2.443.006 4.61-1.546 5.361-3.84a5.553 5.553 0 003.715-2.66 5.488 5.488 0 00-.693-6.497v.001zm-8.381 11.558a4.199 4.199 0 01-2.675-.954c.034-.018.093-.05.132-.074l4.44-2.53a.71.71 0 00.364-.623v-6.176l1.877 1.069c.02.01.033.029.036.05v5.115c-.003 2.274-1.87 4.118-4.174 4.123zM4.192 17.78a4.059 4.059 0 01-.498-2.763c.032.02.09.055.131.078l4.44 2.53c.225.13.504.13.73 0l5.42-3.088v2.138a.068.068 0 01-.027.057L9.9 19.288c-1.999 1.136-4.552.46-5.707-1.51h-.001zM3.023 8.216A4.15 4.15 0 015.198 6.41l-.002.151v5.06a.711.711 0 00.364.624l5.42 3.087-1.876 1.07a.067.067 0 01-.063.005l-4.489-2.559c-1.995-1.14-2.679-3.658-1.53-5.63h.001zm15.417 3.54l-5.42-3.088L14.896 7.6a.067.067 0 01.063-.006l4.489 2.557c1.998 1.14 2.683 3.662 1.529 5.633a4.163 4.163 0 01-2.174 1.807V12.38a.71.71 0 00-.363-.623zm1.867-2.773a6.04 6.04 0 00-.132-.078l-4.44-2.53a.731.731 0 00-.729 0l-5.42 3.088V7.325a.068.068 0 01.027-.057L14.1 4.713c2-1.137 4.555-.46 5.707 1.513.487.833.664 1.809.499 2.757h.001zm-11.741 3.81l-1.877-1.068a.065.065 0 01-.036-.051V6.559c.001-2.277 1.873-4.122 4.181-4.12.976 0 1.92.338 2.671.954-.034.018-.092.05-.131.073l-4.44 2.53a.71.71 0 00-.365.623l-.003 6.173v.002zm1.02-2.168L12 9.25l2.414 1.375v2.75L12 14.75l-2.415-1.375v-2.75z"></path></svg>
                      <span className="ml-2">OpenAi</span>
                    </div>
                    <ChevronUp className={
                      cn('w-5 h-5 transition-transform duration-300',open && 'transform rotate-180')
                    } />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 px-3 py-3">
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
                </CollapsibleContent>
              </Collapsible>

              {/* Ollama */}
              <Collapsible open={open} onOpenChange={setOpen} className="border rounded-lg">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center py-2 px-2 bg-gray-100">
                    <div onClick={(e) => { e.stopPropagation(); e.preventDefault() }}>
                      <Switch className="mr-4" />
                    </div>
                    <div className="flex-1 flex items-center">
                      <svg fill="currentColor" fill-rule="evenodd" height="28" viewBox="0 0 24 24" width="28" xmlns="http://www.w3.org/2000/svg" ><title>Ollama</title><path d="M7.905 1.09c.216.085.411.225.588.41.295.306.544.744.734 1.263.191.522.315 1.1.362 1.68a5.054 5.054 0 012.049-.636l.051-.004c.87-.07 1.73.087 2.48.474.101.053.2.11.297.17.05-.569.172-1.134.36-1.644.19-.52.439-.957.733-1.264a1.67 1.67 0 01.589-.41c.257-.1.53-.118.796-.042.401.114.745.368 1.016.737.248.337.434.769.561 1.287.23.934.27 2.163.115 3.645l.053.04.026.019c.757.576 1.284 1.397 1.563 2.35.435 1.487.216 3.155-.534 4.088l-.018.021.002.003c.417.762.67 1.567.724 2.4l.002.03c.064 1.065-.2 2.137-.814 3.19l-.007.01.01.024c.472 1.157.62 2.322.438 3.486l-.006.039a.651.651 0 01-.747.536.648.648 0 01-.54-.742c.167-1.033.01-2.069-.48-3.123a.643.643 0 01.04-.617l.004-.006c.604-.924.854-1.83.8-2.72-.046-.779-.325-1.544-.8-2.273a.644.644 0 01.18-.886l.009-.006c.243-.159.467-.565.58-1.12a4.229 4.229 0 00-.095-1.974c-.205-.7-.58-1.284-1.105-1.683-.595-.454-1.383-.673-2.38-.61a.653.653 0 01-.632-.371c-.314-.665-.772-1.141-1.343-1.436a3.288 3.288 0 00-1.772-.332c-1.245.099-2.343.801-2.67 1.686a.652.652 0 01-.61.425c-1.067.002-1.893.252-2.497.703-.522.39-.878.935-1.066 1.588a4.07 4.07 0 00-.068 1.886c.112.558.331 1.02.582 1.269l.008.007c.212.207.257.53.109.785-.36.622-.629 1.549-.673 2.44-.05 1.018.186 1.902.719 2.536l.016.019a.643.643 0 01.095.69c-.576 1.236-.753 2.252-.562 3.052a.652.652 0 01-1.269.298c-.243-1.018-.078-2.184.473-3.498l.014-.035-.008-.012a4.339 4.339 0 01-.598-1.309l-.005-.019a5.764 5.764 0 01-.177-1.785c.044-.91.278-1.842.622-2.59l.012-.026-.002-.002c-.293-.418-.51-.953-.63-1.545l-.005-.024a5.352 5.352 0 01.093-2.49c.262-.915.777-1.701 1.536-2.269.06-.045.123-.09.186-.132-.159-1.493-.119-2.73.112-3.67.127-.518.314-.95.562-1.287.27-.368.614-.622 1.015-.737.266-.076.54-.059.797.042zm4.116 9.09c.936 0 1.8.313 2.446.855.63.527 1.005 1.235 1.005 1.94 0 .888-.406 1.58-1.133 2.022-.62.375-1.451.557-2.403.557-1.009 0-1.871-.259-2.493-.734-.617-.47-.963-1.13-.963-1.845 0-.707.398-1.417 1.056-1.946.668-.537 1.55-.849 2.485-.849zm0 .896a3.07 3.07 0 00-1.916.65c-.461.37-.722.835-.722 1.25 0 .428.21.829.61 1.134.455.347 1.124.548 1.943.548.799 0 1.473-.147 1.932-.426.463-.28.7-.686.7-1.257 0-.423-.246-.89-.683-1.256-.484-.405-1.14-.643-1.864-.643zm.662 1.21l.004.004c.12.151.095.37-.056.49l-.292.23v.446a.375.375 0 01-.376.373.375.375 0 01-.376-.373v-.46l-.271-.218a.347.347 0 01-.052-.49.353.353 0 01.494-.051l.215.172.22-.174a.353.353 0 01.49.051zm-5.04-1.919c.478 0 .867.39.867.871a.87.87 0 01-.868.871.87.87 0 01-.867-.87.87.87 0 01.867-.872zm8.706 0c.48 0 .868.39.868.871a.87.87 0 01-.868.871.87.87 0 01-.867-.87.87.87 0 01.867-.872zM7.44 2.3l-.003.002a.659.659 0 00-.285.238l-.005.006c-.138.189-.258.467-.348.832-.17.692-.216 1.631-.124 2.782.43-.128.899-.208 1.404-.237l.01-.001.019-.034c.046-.082.095-.161.148-.239.123-.771.022-1.692-.253-2.444-.134-.364-.297-.65-.453-.813a.628.628 0 00-.107-.09L7.44 2.3zm9.174.04l-.002.001a.628.628 0 00-.107.09c-.156.163-.32.45-.453.814-.29.794-.387 1.776-.23 2.572l.058.097.008.014h.03a5.184 5.184 0 011.466.212c.086-1.124.038-2.043-.128-2.722-.09-.365-.21-.643-.349-.832l-.004-.006a.659.659 0 00-.285-.239h-.004z"></path></svg>
                      <span className="ml-2">Ollama</span>
                    </div>
                    <ChevronUp className={
                      cn('w-5 h-5 transition-transform duration-300',open && 'transform rotate-180')
                    } />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 px-3 py-3">
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
                </CollapsibleContent>
              </Collapsible>

              {/* 支持视觉 */}
              <FormField
                control={form.control}
                name="apiHostProxy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>是否支持视觉</FormLabel>
                    <FormControl>
                      <Switch defaultValue={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormDescription>
                      所选择的模型是否支持视觉，可以覆盖全局设置
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 全局的系统提示词设置 */}
              <FormField
                control={form.control}
                name="apiHostProxy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>全局的系统提示词设置</FormLabel>
                    <FormControl>
                      <Textarea defaultValue={field.value} onChange={field.onChange} placeholder="输出系统提示词" />
                    </FormControl>
                    <FormDescription>
                      符合OpenAI API的代理地址
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 温度 */}
              <FormField
                control={form.control}
                name="apiHostProxy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>全局的系统提示词设置</FormLabel>
                    <FormControl>
                      <Slider defaultValue={[5]} max={1} step={0.1} onChange={field.onChange} />
                    </FormControl>
                    <FormDescription>
                      模型温度，值越大，生成的内容越有创意
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