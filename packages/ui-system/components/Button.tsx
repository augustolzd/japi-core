import type React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const variantClass =
    variant === 'primary' ? styles['japi-button--primary'] : styles['japi-button--secondary'];

  return (
    <button className={`${styles['japi-button']} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
};
