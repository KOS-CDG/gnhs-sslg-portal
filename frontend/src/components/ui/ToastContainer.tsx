import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useUIStore, type Toast } from '@/store/uiStore';
import { cn } from '@/lib/utils';

const ICONS = {
  success: <CheckCircle size={16} className="text-green-500" />,
  error:   <AlertCircle size={16} className="text-red-500" />,
  warning: <AlertTriangle size={16} className="text-yellow-500" />,
  info:    <Info size={16} className="text-blue-500" />,
};

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useUIStore((s) => s.removeToast);

  useEffect(() => {
    const t = setTimeout(() => removeToast(toast.id), 4000);
    return () => clearTimeout(t);
  }, [toast.id, removeToast]);

  return (
    <div
      className={cn(
        'flex items-start gap-3 px-4 py-3 bg-white rounded-xl shadow-lg border border-gray-100',
        'animate-in slide-in-from-right-full duration-300 max-w-sm w-full'
      )}
    >
      <span className="mt-0.5 shrink-0">{ICONS[toast.variant]}</span>
      <p className="text-sm text-gray-700 flex-1">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-gray-400 hover:text-gray-600 shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
