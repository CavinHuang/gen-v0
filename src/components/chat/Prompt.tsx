import { RefreshCwIcon } from 'lucide-react'
import { ChangeEvent,useState } from 'react';

import { cn } from '@/lib';

import Button from '@/components/buttons/Button';

import { Textarea } from '../ui';

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
        `z-0 mx-auto my-4 flex w-full max-w-full justify-center rounded-full bg-muted px-4 py-3 align-middle transition-all md:w-full lg:w-10/12`,
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
          <Button
            className='mx-4 h-6 w-6 flex-none rounded-full border-none bg-transparent'
            variant='outline'
            type='button'
            onClick={() => {
              // clearTimeout(nextExampleRef.current);
              // randomExample(example);
            }}
          >
            <RefreshCwIcon
              strokeWidth='1'
              className={`${animate ? 'animate-rotate-180' : ''} h-5 w-5`}
            />
          </Button>
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
          // ref={queryRef}
          // eslint-disable-next-line react/jsx-handler-names
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
              onSubmit(e)
              e.preventDefault()
            }
          }}
        />
      </form>
    </div>
  );
};
