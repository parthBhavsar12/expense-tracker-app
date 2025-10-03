import { useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import Input, { type InputProps } from '.';

type PasswordInputProps<TFormValues extends FieldValues> = Omit<
  InputProps<TFormValues>,
  'type' | 'icon' | 'onIconClick' | 'iconClassName'
>;

const PasswordInput = <TFormValues extends FieldValues>(
  props: PasswordInputProps<TFormValues>
) => {
  const [show, setShow] = useState(false);

  return (
    <Input
      type={show ? 'text' : 'password'}
      icon={show ? '/assets/close-eye.svg' : '/assets/eye.svg'}
      width={24}
      height={24}
      onIconClick={() => setShow(!show)}
      {...props}
    />
  );
};

export default PasswordInput;