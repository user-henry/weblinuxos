declare module 'input-otp' {
  import type { Context, FC, ComponentPropsWithoutRef } from 'react';

  interface Slot {
    char: string | null;
    hasFakeCaret: boolean;
    isActive: boolean;
  }

  interface OTPInputContextType {
    slots: Slot[];
  }

  export const OTPInput: FC<ComponentPropsWithoutRef<'input'> & {
    containerClassName?: string;
    maxLength?: number;
    pattern?: string;
    onComplete?: (value: string) => void;
  }>;

  export const OTPInputContext: Context<OTPInputContextType>;
}
