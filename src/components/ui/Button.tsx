import type { CSSProperties, ReactNode } from 'react';

export interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  style?: CSSProperties;
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, CSSProperties> = {
  primary: {
    backgroundColor: '#16a34a',
    color: '#ffffff',
    border: 'none',
  },
  secondary: {
    backgroundColor: '#f3f4f6',
    color: '#111827',
    border: '1px solid #e5e7eb',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: '#16a34a',
    border: 'none',
  },
};

export function Button({
  children,
  variant = 'primary',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  style,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={{
        padding: '12px 24px',
        borderRadius: 12,
        fontSize: 16,
        fontWeight: 600,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.6 : 1,
        ...variantStyles[variant],
        ...style,
      }}
    >
      {loading ? 'Loading…' : children}
    </button>
  );
}

export { Button as DistrictMartButton };

