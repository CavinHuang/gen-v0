"use client"
import { useRef,useState } from "react"

import { Prompt } from "@/components/chat/Prompt"

export const Chat = () => {
  const [isEditing, setIsEditing] = useState(false)
  const imageUploadRef = useRef<HTMLInputElement>(null)

  return <>
    <div className="mt-[20%]">
      <h1 className="mb-1 flex-row text-center text-2xl font-medium text-zinc-800 dark:text-zinc-300 md:text-3xl">尽可能详细的描述你的UI需求</h1>
      <h2 className="mb-4 text-center text-lg font-normal text-muted-foreground md:text-xl">提示：您也可以拖动或粘贴参考屏幕截图。（待开发）</h2>
    </div>
    <Prompt isEditing={isEditing} imageUploadRef={imageUploadRef} />
  </>
}