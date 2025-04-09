import { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  heading: string
  text?: string
  children?: React.ReactNode
}

export function PageHeader({ heading, text, children, className, ...props }: PageHeaderProps) {
  return (
    <div className={cn("grid gap-1", className)} {...props}>
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{heading}</h1>
      {text && <p className="text-lg text-muted-foreground">{text}</p>}
      {children}
    </div>
  )
}