'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '../../lib/utils';
import { TooltipRoot, TooltipContent, TooltipProvider, TooltipTrigger } from '../tooltip';
// Note: These icon imports will need to be updated once icons are migrated
import { MdLiveHelp, MdNotificationsNone } from 'react-icons/md';
import ProfileDropdown from './profile-dropdown';

interface NavItemProps {
	label: string;
	href: string;
	icon: React.ReactElement;
}

const NavItem = ({ label, href, icon }: NavItemProps) => {
	const pathname = usePathname();
	const isActive = pathname.startsWith(href);

	return (
		<TooltipProvider>
			<TooltipRoot>
				<TooltipTrigger asChild>
					<Link
						href={href}
						className={cn(
							'flex items-center justify-center p-2 py-3 cursor-pointer transition-colors',
							isActive ? 'bg-gray-800' : 'bg-transparent hover:bg-gray-800/50'
						)}
					>
						<div
							className={cn(
								'transition-colors',
								isActive ? 'text-primary-400' : 'text-gray-400 hover:text-gray-300'
							)}
						>
							{icon}
						</div>
					</Link>
				</TooltipTrigger>
				<TooltipContent side="right">{label}</TooltipContent>
			</TooltipRoot>
		</TooltipProvider>
	);
};

const SideNav = () => {
	return (
		<nav className="sticky top-0 left-0 h-screen pb-2 bg-gray-900 w-12 flex flex-col justify-around">
			<div className="w-full flex items-center p-2 justify-center mb-8">
				<Link href="/">
					{/* VboutIcon placeholder - will be updated when icons are migrated */}
					<div className="w-6 h-6 bg-primary-400 rounded"></div>
				</Link>
			</div>

			<div className="flex flex-col flex-grow text-sm text-gray-600" aria-label="Main Navigation">
				<NavItem
					href="/dashboard"
					label="Dashboard"
					icon={<div className="w-6 h-6 bg-gray-400 rounded"></div>} // Placeholder
				/>
				<NavItem
					href="/campaigns"
					label="Campaigns"
					icon={<div className="w-6 h-6 bg-gray-400 rounded"></div>} // Placeholder
				/>
				<NavItem
					href="/automation"
					label="Automation"
					icon={<div className="w-6 h-6 bg-gray-400 rounded"></div>} // Placeholder
				/>
				<NavItem
					href="/contacts"
					label="Contacts"
					icon={<div className="w-6 h-6 bg-gray-400 rounded"></div>} // Placeholder
				/>
				<NavItem
					href="/social"
					label="Social"
					icon={<div className="w-6 h-6 bg-gray-400 rounded"></div>} // Placeholder
				/>
				<NavItem
					href="/landing-pages"
					label="Landing Pages"
					icon={<div className="w-6 h-6 bg-gray-400 rounded"></div>} // Placeholder
				/>
				<NavItem
					href="/chatbot"
					label="Chatbot"
					icon={<div className="w-6 h-6 bg-gray-400 rounded"></div>} // Placeholder
				/>
				<NavItem
					href="/content"
					label="Content Manager"
					icon={<div className="w-6 h-6 bg-gray-400 rounded"></div>} // Placeholder
				/>
			</div>

			<div className="flex flex-col text-sm text-gray-600" aria-label="Secondary Navigation">
				<NavItem
					href="/support"
					label="Support"
					icon={<MdLiveHelp className="w-6 h-6 text-gray-400" />}
				/>
				<NavItem
					href="/notifications"
					label="Notifications"
					icon={<MdNotificationsNone className="w-6 h-6 text-gray-400" />}
				/>
				<ProfileDropdown />
			</div>
		</nav>
	);
};

export default SideNav;
