<script setup lang="ts">
import { cn } from '../../utils/cn'; //
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all ...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border bg-background text-foreground hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        lg: "h-10 rounded-md px-8",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps = VariantProps<typeof buttonVariants>;

defineProps<{
  variant?: ButtonProps['variant']; // Agora o tipo é "default" | "outline" | ...
  size?: ButtonProps['size'];       // Agora o tipo é "default" | "sm" | ...
  class?: string;
}>();
</script>

<template>
  <button :class="cn(buttonVariants({ variant, size }), $props.class)">
    <slot />
  </button>
</template>