import * as React from "react"
// Radix UI not installed
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-md",
      secondary: "bg-secondary text-secondary-foreground hover:opacity-90 shadow-md",
      outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary/10",
      ghost: "bg-transparent text-foreground hover:bg-neutral-gray",
      danger: "bg-danger text-danger-foreground hover:opacity-90",
      success: "bg-success text-success-foreground hover:opacity-90",
    }
    
    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-11 px-6 text-base font-medium",
      lg: "h-14 px-8 text-lg font-semibold",
      icon: "h-11 w-11 flex items-center justify-center",
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, cn }
