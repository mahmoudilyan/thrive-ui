'use client';

import { toast, Toaster as SonnerToaster } from 'sonner';

export const toaster = {
	success: (title: string, description?: string) => toast.success(title, { description }),
	error: (title: string, description?: string) => toast.error(title, { description }),
	info: (title: string, description?: string) => toast.info(title, { description }),
	warning: (title: string, description?: string) => toast.warning(title, { description }),
	loading: (title: string, description?: string) => toast.loading(title, { description }),
	dismiss: (id?: string | number) => toast.dismiss(id),
};

export const Toaster = () => {
	return (
		<SonnerToaster
			position="bottom-right"
			toastOptions={{
				style: {
					background: 'hsl(var(--background))',
					color: 'hsl(var(--foreground))',
					border: '1px solid hsl(var(--border))',
				},
			}}
		/>
	);
};
