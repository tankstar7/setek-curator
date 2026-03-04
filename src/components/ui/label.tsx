"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Radix UI의 Label primitive가 객체로 반환되어 발생하는 에러를 방지하기 위해
 * 표준 label 태그를 기반으로 한 shadcn 스타일의 Label 컴포넌트를 구현합니다.
 */
function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "text-sm font-medium leading-none font-sans select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  )
}

export { Label }
