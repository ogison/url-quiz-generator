import { FC, ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: FC<CardProps> = ({ children, className, hover = false }) => {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl shadow-sm border border-gray-200 p-6',
        hover && 'transition-shadow duration-200 hover:shadow-md',
        className
      )}
    >
      {children}
    </div>
  );
};
