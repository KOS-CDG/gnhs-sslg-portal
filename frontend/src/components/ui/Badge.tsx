import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:    'bg-gray-100 text-gray-700',
  primary:    'bg-primary-100 text-primary-700',
  secondary:  'bg-secondary-100 text-secondary-700',
  success:    'bg-green-100 text-green-700',
  warning:    'bg-yellow-100 text-yellow-700',
  danger:     'bg-red-100 text-red-700',
  info:       'bg-blue-100 text-blue-700',
};

export function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
