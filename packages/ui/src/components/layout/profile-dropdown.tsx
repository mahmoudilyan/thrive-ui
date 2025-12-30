import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuGroup,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
} from '../dropdown-menu';
import { Button } from '../button';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar';
import { cn } from '../../lib/utils';

import {
	MdBusinessCenter,
	MdSettings,
	MdPeople,
	MdExtension,
	MdPower,
	MdReceipt,
	MdLogout,
} from 'react-icons/md';

const ProfileDropdown = () => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative hover:bg-transparent active:bg-transparent p-2">
					<div className="flex items-center gap-2">
						<div className="relative">
							<Avatar className="w-8 h-8 rounded-lg">
								<AvatarImage src="/images/v2/empty-company.png" alt="Company" />
								<AvatarFallback className="rounded-lg bg-gray-600" variant="normal">
									C
								</AvatarFallback>
							</Avatar>
							<Avatar className="absolute -top-1 -left-1 w-4 h-4 border border-gray-800">
								<AvatarImage src="/avatar-placeholder.svg" alt="User" />
								<AvatarFallback className="text-[10px]" variant="normal">
									U
								</AvatarFallback>
							</Avatar>
						</div>
					</div>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-80" align="end" side="right">
				<div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
					<div className="flex items-center gap-3 pr-12">
						<Avatar className="w-12 h-12 rounded-lg">
							<AvatarImage src="/path-to-avatar.jpg" alt="Richard Fallah" />
							<AvatarFallback className="rounded-lg" variant="normal">
								RF
							</AvatarFallback>
						</Avatar>
						<div className="space-y-1">
							<p className="font-medium">Richard Fallah</p>
							<p className="text-sm text-gray-600 dark:text-gray-400">VBOUT Agency</p>
						</div>
					</div>
				</div>

				<DropdownMenuGroup className="mt-1">
					<DropdownMenuSub>
						<DropdownMenuSubTrigger className="justify-between">
							<div className="px-2 py-0 space-y-1">
								<p className="font-medium">VBOUT Inc</p>
								<p className="text-sm text-gray-600 dark:text-gray-400">Change Workspace</p>
							</div>
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<DropdownMenuRadioGroup value="VBOUT Inc">
								<DropdownMenuRadioItem value="VBOUT Inc">VBOUT Inc</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="Open Build">Open Build</DropdownMenuRadioItem>
							</DropdownMenuRadioGroup>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuItem>
					<MdSettings className="mr-2 w-4 h-4" />
					Settings
				</DropdownMenuItem>
				<DropdownMenuItem>
					<MdPeople className="mr-2 w-4 h-4" />
					Team
				</DropdownMenuItem>
				<DropdownMenuItem>
					<MdPower className="mr-2 w-4 h-4" />
					Integrations
				</DropdownMenuItem>
				<DropdownMenuItem>
					<MdExtension className="mr-2 w-4 h-4" />
					Add-ons
				</DropdownMenuItem>
				<DropdownMenuItem>
					<MdReceipt className="mr-2 w-4 h-4" />
					Billing & Upgrade
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem>
					<MdBusinessCenter className="mr-2 w-4 h-4" />
					Hire an Expert
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem className="mb-1">
					<MdLogout className="mr-2 w-4 h-4" />
					Logout
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ProfileDropdown;
