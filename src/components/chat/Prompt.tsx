import { ImageIcon,RefreshCwIcon,SparklesIcon } from 'lucide-react'
import { ChangeEvent,useCallback,useEffect,useRef,useState } from 'react';

import { cn,EXAMPLES } from '@/lib';

import IconButton from '@/components/buttons/IconButton';

import { Textarea,Tooltip,TooltipContent,TooltipTrigger } from '../ui';

export const Prompt = ({
  isEditing,
  imageUploadRef,
}: {
  isEditing: boolean;
  imageUploadRef: React.RefObject<HTMLInputElement>;
}) => {
  const [isFocused,setIsFocused] = useState(false);
  const [animate,setAnimate] = useState(false)
  const [textareaHeight,setTextareaHeight] = useState<number | undefined>()
  const [screenshot,setScreenshot] = useState(false)
  const [bufferedExample,setBufferedExample] = useState<string>('')
  const [inspectorEnabled,setInspectorEnabled] = useState(false)
  const [modelSupportsImages,setModelSupportsImages] = useState(false)
  const [rendering,setRendering] = useState(false)
  const nextExampleRef = useRef<NodeJS.Timeout>()

  const [example,setExample] = useState<string>(EXAMPLES[0])
  const queryRef = useRef<HTMLTextAreaElement>(null)
  const randomExample = useCallback((existingExample: string) => {
    let ex = EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)]
    while (ex === existingExample) {
      ex = EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)]
    }
    setExample(ex)
    setBufferedExample(ex.slice(0,1))
  },[])
  // Random example on mount
  useEffect(() => {
    randomExample('')
    if (document.activeElement === queryRef.current) {
      setIsFocused(true)
    }
  },[randomExample])
  // 每10s切换示例
  useEffect(() => {
    if (isEditing) {
      clearTimeout(nextExampleRef.current)
    } else if (queryRef.current?.value === '') {
      nextExampleRef.current = setTimeout(() => {
        setTextareaHeight(undefined)
        randomExample(example)
      },10_000)
      setAnimate(true)
      setTimeout(() => setAnimate(false),1000)
    }
    return () => clearTimeout(nextExampleRef.current)
  },[randomExample,example,isEditing])
  useEffect(() => {
    if (isEditing) {
      setTextareaHeight(undefined)
      return
    }
    if (bufferedExample.length < example.length) {
      const minTime = 5
      const maxTime = 80
      const randomTime =
        Math.floor(Math.random() ** 2 * (maxTime - minTime + 1)) + minTime
      setTimeout(
        () => setBufferedExample(prev => example.slice(0,prev.length + 1)),
        randomTime
      )
      const { scrollHeight,clientHeight } = queryRef.current ?? {
        scrollHeight: 0,
        clientHeight: 0
      }
      if (scrollHeight > clientHeight) {
        setTextareaHeight(scrollHeight)
      } else if (scrollHeight !== clientHeight) {
        setTextareaHeight(undefined)
      }
    }
  },[example,bufferedExample,isEditing])

  async function onSubmit(event: React.FormEvent | React.KeyboardEvent) {
    event.preventDefault();

    const formData = new FormData();
    const response = await fetch('/api/submit',{
      method: 'POST',
      body: formData,
    });

    // Handle response if necessary
    const data = await response.json();
    // ...
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? undefined;
    if (file === undefined) {
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load',() => {
      // resizeImage(reader.result as string,1024).then(
      //   img => {
      //     setScreenshot(img.url)
      //     setImage(img).catch(() => {
      //       console.error('Failed to set image')
      //     })
      //   },
      //   () => console.error('Resize failed')
      // )
    });
    reader.readAsDataURL(file);
  }

  function onTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const { scrollHeight,clientHeight,value } = e.target
    if (scrollHeight > clientHeight) {
      setTextareaHeight(scrollHeight)
    } else if (scrollHeight !== clientHeight) {
      setTextareaHeight(undefined)
    }
    if (value === '') {
      // randomExample(example)
    } else {
      // clearTimeout(nextExampleRef.current)
      if (value.length === 1) {
        setTextareaHeight(undefined)
      }
    }
  }
  return (
    <div
      id='llm-input'
      className={cn(
        `z-0 mx-auto my-20 flex w-full max-w-full justify-center rounded-full bg-muted px-4 py-3 align-middle transition-all md:w-full lg:w-10/12`,
        isFocused ? 'border-2 border-primary bg-white dark:bg-muted' : ''
      )}
    >
      <form
        onSubmit={onSubmit}
        className={cn(
          'flex min-h-16 w-full items-center justify-center',
          isEditing ? 'min-h-8' : ''
        )}
      >
        <input
          ref={imageUploadRef}
          id='file-input'
          type='file'
          className='hidden'
          accept='image/*'
          onChange={onFileChange}
        />

        {!isEditing && (
          <IconButton variant='ghost' className='mx-4 h-6 w-6 flex-none rounded-full border-none bg-transparent' icon={() => <RefreshCwIcon
            strokeWidth='1'
            className={`${animate ? 'animate-rotate-180' : ''} h-5 w-5`}
          />} />
          // <Button
          //   className='mx-4 h-6 w-6 flex-none rounded-full border-none bg-transparent'
          //   variant='outline'
          //   type='button'
          //   onClick={() => {
          //     // clearTimeout(nextExampleRef.current);
          //     // randomExample(example);
          //   }}
          // >
          //   <RefreshCwIcon
          //     strokeWidth='1'
          //     className={`${animate ? 'animate-rotate-180' : ''} h-5 w-5`}
          //   />
          // </Button>
        )}
        <Textarea
          name='query'
          rows={Math.floor(textareaHeight ? textareaHeight / 33 : 1)}
          className={
            cn(
              'my-auto max-h-[130px] flex-1 resize-none items-center justify-center overflow-y-hidden rounded-none align-middle text-lg placeholder:text-lg',
              'border-none bg-muted outline-none ring-0 transition-all focus-visible:bg-white focus-visible:ring-0 focus-visible:ring-offset-0 dark:focus-visible:bg-muted'
            )
          }
          style={{
            height: textareaHeight ? `${textareaHeight}px` : undefined
          }}
          onChange={onTextareaChange}
          onFocus={() => {
            setIsFocused(true)
          }}
          onBlur={() => {
            setIsFocused(false)
          }}
          placeholder={
            isEditing
              ? 'Ask for changes to the current UI'
              : screenshot
                ? 'Describe the screenshot you uploaded (Optional)'
                : bufferedExample
          }
          ref={queryRef}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
              onSubmit(e)
              e.preventDefault()
            }
          }}
        />

        <div className='flex items-center'>
          {isEditing ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton
                  onClick={() => {
                    // TODO: likely sync the state
                    setInspectorEnabled(!inspectorEnabled)
                  }}
                  // size='icon'
                  icon={() => <svg
                    className='h-5 w-5'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    strokeWidth={1}
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M2.89661 3.15265C2.83907 2.99331 2.99331 2.83907 3.15265 2.89661L21.5721 9.5481C22.0611 9.72467 22.1094 10.3972 21.6507 10.6418L14.7396 14.3278C14.5645 14.4212 14.4212 14.5645 14.3278 14.7396L10.6418 21.6507C10.3972 22.1094 9.72467 22.0611 9.5481 21.5722L2.89661 3.15265ZM5.24811 5.24811L10.2712 19.1582L13.2191 13.6309C13.3125 13.4558 13.4558 13.3125 13.6309 13.2191L19.1582 10.2712L5.24811 5.24811Z'
                      fill='currentColor'
                    />
                  </svg>}
                  variant='ghost'
                  type='button'
                  className={cn(
                    'h-8 w-8 flex-none bg-transparent',
                    inspectorEnabled
                      ? 'border-1 rounded-full border-primary text-white'
                      : ''
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>在HTML中选择元素</TooltipContent>
            </Tooltip>
          ) :
            modelSupportsImages ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton
                    className='mr-2 h-8 w-8 flex-none rounded-full border-none bg-transparent'
                    variant='ghost'
                    // size='icon'
                    type='button'
                    icon={() => <ImageIcon strokeWidth={1} className='h-5 w-5' />}
                    onClick={() => imageUploadRef.current?.click()}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  上传要创建的网页屏幕截图
                </TooltipContent>
              </Tooltip>
            ) : undefined}
          {rendering ? (
            <div className='rendering h-8 w-8 flex-none animate-spin rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500' />
          ) : (
            <IconButton
              className={cn(
                'mr-4 h-8 w-8 flex-none rounded-full border-none bg-muted',
                isFocused
                  ? 'border-1 border-primary bg-primary/20 text-primary'
                  : ''
              )}
              icon={() => <SparklesIcon strokeWidth={2} className='h-5 w-5' />}
              variant='ghost'
              type='submit'
            />
          )}
        </div>
      </form>
    </div>
  );
};
