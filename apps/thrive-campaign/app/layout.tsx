import { Provider } from '@/components/ui/provider';
//import { Inter } from 'next/font/google';
import '@/app/global.css';
import '@thrive/ui/style.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html suppressHydrationWarning>
			<body>
				<Provider>{children}</Provider>
			</body>
		</html>
	);
}
