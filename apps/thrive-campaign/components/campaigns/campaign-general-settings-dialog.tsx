'use client';

import { useState } from 'react';
import { DialogHeader, DialogTitle, DialogFooter, Button, Input, Field } from '@thrive/ui';
import { MdSettings, MdCode } from 'react-icons/md';
import { cn } from '@thrive/ui';

interface CampaignGeneralSettingsDialogProps {
	onClose: () => void;
	dialogTitle?: string;
	dialogDescription?: string;
	campaignId?: string;
	initialSettings?: {
		replyTo?: string;
		from?: string;
		fromName?: string;
		preventAutoReplies?: boolean;
	};
	onSave?: (settings: any) => void;
}

type Tab = 'general' | 'shortcodes';

export default function CampaignGeneralSettingsDialog({
	onClose,
	dialogTitle = 'Campaign Settings',
	campaignId,
	initialSettings = {},
	onSave,
}: CampaignGeneralSettingsDialogProps) {
	const [activeTab, setActiveTab] = useState<Tab>('general');
	const [replyTo, setReplyTo] = useState(initialSettings.replyTo || '');
	const [from, setFrom] = useState(initialSettings.from || '');
	const [fromName, setFromName] = useState(initialSettings.fromName || '');
	const [preventAutoReplies, setPreventAutoReplies] = useState(
		initialSettings.preventAutoReplies || false
	);

	const handleSubmit = () => {
		if (onSave) {
			onSave({
				replyTo,
				from,
				fromName,
				preventAutoReplies,
			});
		}
		onClose();
	};

	return (
		<>
			{/* Header with border bottom */}
			<div className="border-b border-[#e7ebee] px-6 py-3 -mx-6 -mt-6">
				<DialogHeader>
					<DialogTitle className="text-xl font-medium text-[#2b384a]">{dialogTitle}</DialogTitle>
				</DialogHeader>
			</div>

			{/* Content with sidebar tabs */}
			<div className="flex gap-6 h-[541px] -mx-6 -mb-6">
				{/* Sidebar tabs */}
				<div className="bg-[#f6f8f9] w-[227px] p-5 flex flex-col gap-1">
					<button
						onClick={() => setActiveTab('general')}
						className={cn(
							'flex items-center gap-1 px-2 py-2 rounded text-sm text-[#364152] transition-colors',
							activeTab === 'general'
								? 'bg-[#e8ecef] font-normal'
								: 'hover:bg-[#e8ecef]/50 font-normal'
						)}
					>
						<MdSettings className="w-5 h-5" />
						<span className="leading-5">General Settings</span>
					</button>

					<button
						onClick={() => setActiveTab('shortcodes')}
						className={cn(
							'flex items-center gap-1 px-2 py-2 rounded text-sm text-[#364152] transition-colors',
							activeTab === 'shortcodes'
								? 'bg-[#e8ecef] font-normal'
								: 'hover:bg-[#e8ecef]/50 font-normal'
						)}
					>
						<MdCode className="w-5 h-5" />
						<span className="leading-5">Shortcodes</span>
					</button>
				</div>

				{/* Content area */}
				<div className="flex-1 py-6 pr-6 overflow-y-auto">
					{activeTab === 'general' && (
						<div className="flex flex-col gap-4">
							<div>
								<h3 className="text-xl font-medium text-[#364152] mb-1">Default Sending Values</h3>
								<p className="text-[13px] text-[#364152] leading-5 mb-4">
									Sending Defaults will prefill the required send data when composing a campaign so
									that you don&apos;t have to reinsert them each time. You can always modify those
									defaults when composing a campaign.
								</p>
							</div>

							{/* Reply To Field */}
							<Field label="Reply To" required className="max-w-[343px]">
								<Input
									value={replyTo}
									onChange={e => setReplyTo(e.target.value)}
									placeholder="email@example.com"
									className="w-full"
								/>
							</Field>

							{/* From Field */}
							<div className="max-w-[343px]">
								<div className="flex items-center justify-between mb-1">
									<label className="text-base font-medium text-[#2b384a]">From</label>
									<button className="text-[13px] text-[#00868c] hover:underline">
										Select Private Domain
									</button>
								</div>
								<Input
									value={from}
									onChange={e => setFrom(e.target.value)}
									placeholder="email@example.com"
									className="w-full"
								/>
							</div>

							{/* From Name Field */}
							<Field label="From Name" className="max-w-[343px]">
								<Input
									value={fromName}
									onChange={e => setFromName(e.target.value)}
									placeholder="https://www.example.com"
									className="w-full"
								/>
							</Field>

							{/* Prevent Auto Replies Switch */}
							<div className="flex gap-2 items-start max-w-[745px]">
								<div className="pt-1">
									<button
										onClick={() => setPreventAutoReplies(!preventAutoReplies)}
										className={cn(
											'relative inline-flex h-5 w-8 items-center rounded-full transition-colors',
											preventAutoReplies ? 'bg-[#00868c]' : 'bg-[#d1d7de]'
										)}
									>
										<span
											className={cn(
												'inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform',
												preventAutoReplies ? 'translate-x-4' : 'translate-x-0.5'
											)}
										/>
									</button>
								</div>
								<div className="flex-1">
									<p className="text-base text-[#364152] leading-6">
										Prevent Automatic Replies To My Campaigns?
									</p>
									<p className="text-[13px] text-[#8493a8] leading-5">
										Auto-responders, such as out-of-office notifications, won&apos;t be sent by your
										recipients and you won&apos;t receive copy from them.
									</p>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'shortcodes' && (
						<div className="flex flex-col gap-4">
							<h3 className="text-xl font-medium text-[#364152] mb-1">Shortcodes</h3>
							<p className="text-[13px] text-[#364152] leading-5 mb-4">
								Shortcodes are a simple line of text that replace long values. Ex: instead of
								inserting www.facebook.com/mypage you can simply use [FB_LINK] inside your content.
							</p>

							<div className="space-y-4">
								<div className="p-4 border border-[#d1d7de] rounded">
									<h4 className="text-sm font-medium text-[#364152] mb-2 flex items-center gap-2">
										<MdSettings className="w-5 h-5" />
										Address Shortcode [ADDRESS]
									</h4>
									<p className="text-xs text-[#8493a8] mb-3">
										(Insert a valid physical address in order for you to comply with the CAN-SPAM
										ACT)
									</p>

									<div className="grid grid-cols-2 gap-4">
										<Field label="Address 1" required>
											<Input placeholder="1412 Broadway" />
										</Field>
										<Field label="Address 2">
											<Input placeholder="21st Floor" />
										</Field>
										<Field label="Country" required>
											<Input placeholder="United States of America" />
										</Field>
										<Field label="State">
											<Input placeholder="NY" />
										</Field>
										<Field label="City">
											<Input placeholder="New York" />
										</Field>
										<Field label="Zip Code">
											<Input placeholder="10018" />
										</Field>
									</div>
								</div>

								<div className="p-4 border border-[#d1d7de] rounded">
									<h4 className="text-sm font-medium text-[#364152] mb-2 flex items-center gap-2">
										<MdSettings className="w-5 h-5" />
										Company Shortcodes
									</h4>
								</div>

								<div className="p-4 border border-[#d1d7de] rounded">
									<h4 className="text-sm font-medium text-[#364152] mb-2 flex items-center gap-2">
										<MdCode className="w-5 h-5" />
										Email Campaign Shortcodes
									</h4>
								</div>

								<div className="p-4 border border-[#d1d7de] rounded">
									<h4 className="text-sm font-medium text-[#364152] mb-2 flex items-center gap-2">
										<MdCode className="w-5 h-5" />
										Social Media Shortcodes
									</h4>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Footer - positioned outside content */}
			<div className="border-t border-[#e7ebee] px-6 py-4 -mx-6 -mb-6 mt-auto">
				<DialogFooter>
					<Button variant="secondary" onClick={onClose}>
						Cancel
					</Button>
					<Button variant="primary" onClick={handleSubmit}>
						Submit Changes
					</Button>
				</DialogFooter>
			</div>
		</>
	);
}
