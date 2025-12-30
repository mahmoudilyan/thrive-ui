'use client';

import { Box, Panel, SideNavigation } from '@thrive/ui';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<Box className="flex h-screen overflow-hidden relative">
			<SideNavigation />
			<Panel className="flex flex-col flex-1 overflow-y-auto">{children}</Panel>
		</Box>
	);
}
