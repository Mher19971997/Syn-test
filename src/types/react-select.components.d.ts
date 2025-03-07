import { ReactNode, HTMLProps } from 'react';

export interface ControlProps {
  children: ReactNode;
  innerProps: HTMLProps<HTMLDivElement>;
}
