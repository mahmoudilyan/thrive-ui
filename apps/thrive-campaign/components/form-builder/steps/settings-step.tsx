'use client';

import { useState } from 'react';
import { Box, Text, Input, Switch } from '@thrive/ui';
import { useFormBuilderStore } from '@/store/form-builder/use-form-builder-store';
import { TiptapEditor } from '../tiptap-editor';
import type { FormSettings } from '@/types/form-builder';

interface SettingsStepProps {
	onNext?: () => void;
	onPrev?: () => void;
}

export function SettingsStep({ onNext, onPrev }: SettingsStepProps) {
	const { settings, updateSettings } = useFormBuilderStore();
	const [activeTab, setActiveTab] = useState('subscription');

	return (
		<Box className="flex gap-6 h-full">
			{/* Left: Vertical Tabs */}
			<Box className="w-56 flex-shrink-0">
				<div className="space-y-1">
					<TabButton
						active={activeTab === 'subscription'}
						onClick={() => setActiveTab('subscription')}
					>
						Subscription Settings
					</TabButton>
					<TabButton active={activeTab === 'sender'} onClick={() => setActiveTab('sender')}>
						Sender Details
					</TabButton>
					<TabButton
						active={activeTab === 'communications'}
						onClick={() => setActiveTab('communications')}
					>
						Email Communications
					</TabButton>
					<TabButton active={activeTab === 'advanced'} onClick={() => setActiveTab('advanced')}>
						Advanced Options
					</TabButton>
				</div>
			</Box>

			{/* Right: Settings Content */}
			<Box className="flex-1 border border-border rounded-lg bg-white p-6 overflow-y-auto">
				{activeTab === 'subscription' && (
					<SubscriptionSettings settings={settings} onUpdate={updateSettings} />
				)}
				{activeTab === 'sender' && (
					<SenderDetailsSettings settings={settings} onUpdate={updateSettings} />
				)}
				{activeTab === 'communications' && (
					<EmailCommunicationsSettings settings={settings} onUpdate={updateSettings} />
				)}
				{activeTab === 'advanced' && (
					<AdvancedSettings settings={settings} onUpdate={updateSettings} />
				)}
			</Box>
		</Box>
	);
}

interface TabButtonProps {
	active: boolean;
	onClick: () => void;
	children: React.ReactNode;
}

function TabButton({ active, onClick, children }: TabButtonProps) {
	return (
		<button
			onClick={onClick}
			className={`
				w-full text-left px-4 py-2 rounded-lg transition-colors text-sm font-medium
				${active ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-700'}
			`}
		>
			{children}
		</button>
	);
}

interface SettingsComponentProps {
	settings: FormSettings;
	onUpdate: (updates: Partial<FormSettings>) => void;
}

function SubscriptionSettings({ settings, onUpdate }: SettingsComponentProps) {
	return (
		<div className="space-y-6">
			<div>
				<Text className="text-lg font-semibold mb-4">Subscription Settings</Text>
			</div>

			<SettingRow
				label="Allow multiple submissions from the same contact?"
				description="Enable if contacts can submit the form multiple times"
			>
				<Switch
					checked={settings.multipleSubmissions}
					onCheckedChange={checked => onUpdate({ multipleSubmissions: checked })}
				/>
			</SettingRow>

			<SettingRow
				label="Email confirmation required (Double opt-in)?"
				description="Contacts must confirm their email address before being added"
			>
				<Switch
					checked={settings.doubleOptIn}
					onCheckedChange={checked => onUpdate({ doubleOptIn: checked })}
				/>
			</SettingRow>

			{settings.doubleOptIn && (
				<Box className="ml-6 space-y-4 p-4 bg-gray-50 rounded-lg">
					<SettingRow label="Hide 'Subscribe Again' button?">
						<Switch
							checked={settings.hideSubscribeAgain}
							onCheckedChange={checked => onUpdate({ hideSubscribeAgain: checked })}
						/>
					</SettingRow>

					<SettingRow label="Redirect after confirmation?">
						<Switch
							checked={settings.confirmRedirect}
							onCheckedChange={checked => onUpdate({ confirmRedirect: checked })}
						/>
					</SettingRow>

					{settings.confirmRedirect && (
						<Box className="ml-6 space-y-3">
							<div>
								<label className="block text-sm font-medium mb-1">Redirect URL</label>
								<Input
									value={settings.confirmRedirectUrl || ''}
									onChange={e => onUpdate({ confirmRedirectUrl: e.target.value })}
									placeholder="https://example.com/thank-you"
								/>
							</div>
							<SettingRow label="Disable confirm message?">
								<Switch
									checked={settings.confirmRedirectDirect}
									onCheckedChange={checked => onUpdate({ confirmRedirectDirect: checked })}
								/>
							</SettingRow>
						</Box>
					)}
				</Box>
			)}

			<SettingRow
				label="Turn on Autoresponder?"
				description="Send automated emails to new subscribers"
			>
				<Switch
					checked={settings.autoresponder}
					onCheckedChange={checked => onUpdate({ autoresponder: checked })}
				/>
			</SettingRow>

			<SettingRow
				label="Notify admins of new contacts?"
				description="Send email notifications when someone subscribes"
			>
				<Switch
					checked={settings.notifyAdmins}
					onCheckedChange={checked => onUpdate({ notifyAdmins: checked })}
				/>
			</SettingRow>

			{settings.notifyAdmins && (
				<Box className="ml-6">
					<label className="block text-sm font-medium mb-1">Admin Emails</label>
					<Input
						value={settings.notifyEmails?.join(', ') || ''}
						onChange={e =>
							onUpdate({
								notifyEmails: e.target.value.split(',').map(email => email.trim()),
							})
						}
						placeholder="admin@example.com, manager@example.com"
					/>
					<Text className="text-xs text-gray-600 mt-1">Comma-separated email addresses</Text>
				</Box>
			)}

			<SettingRow label="Redirect after subscription?">
				<Switch
					checked={settings.redirect}
					onCheckedChange={checked => onUpdate({ redirect: checked })}
				/>
			</SettingRow>

			{settings.redirect && (
				<Box className="ml-6 space-y-3">
					<div>
						<label className="block text-sm font-medium mb-1">Redirect URL</label>
						<Input
							value={settings.redirectUrl || ''}
							onChange={e => onUpdate({ redirectUrl: e.target.value })}
							placeholder="https://example.com/thank-you"
						/>
					</div>
					<SettingRow label="Disable success message?">
						<Switch
							checked={settings.redirectDirect}
							onCheckedChange={checked => onUpdate({ redirectDirect: checked })}
						/>
					</SettingRow>
				</Box>
			)}

			<SettingRow label="Don't show success message after subscription">
				<Switch
					checked={settings.skipSuccessMessage}
					onCheckedChange={checked => onUpdate({ skipSuccessMessage: checked })}
				/>
			</SettingRow>

			<SettingRow label="Override error messages?">
				<Switch
					checked={settings.overrideErrorMessages}
					onCheckedChange={checked => onUpdate({ overrideErrorMessages: checked })}
				/>
			</SettingRow>

			<SettingRow label="Update field when new value is empty?">
				<Switch
					checked={settings.allowEmptyFields}
					onCheckedChange={checked => onUpdate({ allowEmptyFields: checked })}
				/>
			</SettingRow>

			<SettingRow label="Auto tag when a contact joins the list?">
				<Switch
					checked={settings.autoTag}
					onCheckedChange={checked => onUpdate({ autoTag: checked })}
				/>
			</SettingRow>

			{settings.autoTag && (
				<Box className="ml-6">
					<label className="block text-sm font-medium mb-1">Tags</label>
					<Input
						value={settings.autoTagTags?.join(', ') || ''}
						onChange={e =>
							onUpdate({
								autoTagTags: e.target.value.split(',').map(tag => tag.trim()),
							})
						}
						placeholder="tag1, tag2, tag3"
					/>
				</Box>
			)}
		</div>
	);
}

function SenderDetailsSettings({ settings, onUpdate }: SettingsComponentProps) {
	return (
		<div className="space-y-6">
			<div>
				<Text className="text-lg font-semibold mb-4">Sender Details</Text>
			</div>

			<div>
				<label className="block text-sm font-medium mb-1">From Address</label>
				<Input
					type="email"
					value={settings.fromEmail}
					onChange={e => onUpdate({ fromEmail: e.target.value })}
					placeholder="noreply@example.com"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium mb-1">From Name</label>
				<Input
					value={settings.fromName}
					onChange={e => onUpdate({ fromName: e.target.value })}
					placeholder="Company Name"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium mb-1">Reply-to</label>
				<Input
					type="email"
					value={settings.replyTo}
					onChange={e => onUpdate({ replyTo: e.target.value })}
					placeholder="support@example.com"
				/>
			</div>
		</div>
	);
}

function EmailCommunicationsSettings({ settings, onUpdate }: SettingsComponentProps) {
	const [activeEmailTab, setActiveEmailTab] = useState('confirmation');

	const showConfirmationEmail = settings.doubleOptIn;
	const showSuccessEmail = settings.doubleOptIn || settings.autoresponder;

	return (
		<div className="space-y-6">
			<div>
				<Text className="text-lg font-semibold mb-4">Email Communications</Text>
			</div>

			{/* Email Template Tabs */}
			<div className="flex gap-2 border-b border-border pb-2 mb-4 overflow-x-auto">
				{showConfirmationEmail && (
					<EmailTabButton
						active={activeEmailTab === 'confirmation'}
						onClick={() => setActiveEmailTab('confirmation')}
					>
						Confirmation Email
					</EmailTabButton>
				)}
				{showSuccessEmail && (
					<EmailTabButton
						active={activeEmailTab === 'success'}
						onClick={() => setActiveEmailTab('success')}
					>
						Success Email
					</EmailTabButton>
				)}
				{showConfirmationEmail && (
					<EmailTabButton
						active={activeEmailTab === 'confirmMessage'}
						onClick={() => setActiveEmailTab('confirmMessage')}
					>
						Confirmation Message
					</EmailTabButton>
				)}
				<EmailTabButton
					active={activeEmailTab === 'successMessage'}
					onClick={() => setActiveEmailTab('successMessage')}
				>
					Success Message
				</EmailTabButton>
				<EmailTabButton
					active={activeEmailTab === 'errorMessage'}
					onClick={() => setActiveEmailTab('errorMessage')}
				>
					Error Message
				</EmailTabButton>
				{settings.notifyAdmins && (
					<EmailTabButton
						active={activeEmailTab === 'adminCopy'}
						onClick={() => setActiveEmailTab('adminCopy')}
					>
						Admin Copy
					</EmailTabButton>
				)}
			</div>

			<Box>
				{/* Confirmation Email */}
				{activeEmailTab === 'confirmation' && showConfirmationEmail && (
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium mb-1">Subject Line</label>
							<Input
								value={settings.confirmationEmail.subject}
								onChange={e =>
									onUpdate({
										confirmationEmail: {
											...settings.confirmationEmail,
											subject: e.target.value,
										},
									})
								}
								placeholder="Please confirm your subscription"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">Email Content</label>
							<TiptapEditor
								content={settings.confirmationEmail.content}
								onUpdate={content =>
									onUpdate({
										confirmationEmail: {
											...settings.confirmationEmail,
											content,
										},
									})
								}
							/>
							<Box className="mt-2 p-3 bg-blue-50 rounded text-xs space-y-1">
								<Text>
									<strong>[CONFIRMATION_URL]:</strong> Confirmation link button
								</Text>
								<Text>
									<strong>[BUSINESS_NAME]:</strong> Your business name
								</Text>
							</Box>
						</div>
					</div>
				)}

				{/* Success Email */}
				{activeEmailTab === 'success' && showSuccessEmail && (
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium mb-1">Subject Line</label>
							<Input
								value={settings.successEmail.subject}
								onChange={e =>
									onUpdate({
										successEmail: {
											...settings.successEmail,
											subject: e.target.value,
										},
									})
								}
								placeholder="Welcome to our newsletter!"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">Email Content</label>
							<TiptapEditor
								content={settings.successEmail.content}
								onUpdate={content =>
									onUpdate({
										successEmail: {
											...settings.successEmail,
											content,
										},
									})
								}
							/>
						</div>
					</div>
				)}

				{/* Confirmation Message */}
				{activeEmailTab === 'confirmMessage' && (
					<div>
						<label className="block text-sm font-medium mb-1">Confirmation Message</label>
						<TiptapEditor
							content={settings.confirmationMessage}
							onUpdate={content => onUpdate({ confirmationMessage: content })}
						/>
					</div>
				)}

				{/* Success Message */}
				{activeEmailTab === 'successMessage' && (
					<div>
						<label className="block text-sm font-medium mb-1">Success Message</label>
						<TiptapEditor
							content={settings.successMessage}
							onUpdate={content => onUpdate({ successMessage: content })}
						/>
					</div>
				)}

				{/* Error Message */}
				{activeEmailTab === 'errorMessage' && (
					<div>
						<label className="block text-sm font-medium mb-1">Error Message</label>
						<TiptapEditor
							content={settings.errorMessage}
							onUpdate={content => onUpdate({ errorMessage: content })}
						/>
					</div>
				)}

				{/* Admin Copy */}
				{activeEmailTab === 'adminCopy' && settings.notifyAdmins && (
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium mb-1">Subject Line</label>
							<Input
								value={settings.notifyEmailSubject || ''}
								onChange={e => onUpdate({ notifyEmailSubject: e.target.value })}
								placeholder="New subscriber: [NEW_SUBSCRIBER_EMAIL]"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">Email Content</label>
							<TiptapEditor
								content={settings.notifyEmailMessage || ''}
								onUpdate={content => onUpdate({ notifyEmailMessage: content })}
							/>
						</div>
					</div>
				)}
			</Box>
		</div>
	);
}

function AdvancedSettings({ settings, onUpdate }: SettingsComponentProps) {
	return (
		<div className="space-y-6">
			<div>
				<Text className="text-lg font-semibold mb-4">Advanced Options</Text>
			</div>

			<Box className="p-4 bg-gray-50 rounded-lg">
				<Text className="text-sm text-gray-700">
					Advanced features like payment settings, email validation, and data enrichment will be
					available here.
				</Text>
			</Box>
		</div>
	);
}

interface SettingRowProps {
	label: string;
	description?: string;
	children: React.ReactNode;
}

function SettingRow({ label, description, children }: SettingRowProps) {
	return (
		<div className="flex items-start justify-between gap-4">
			<div className="flex-1">
				<Text className="text-sm font-medium">{label}</Text>
				{description && <Text className="text-xs text-gray-600 mt-1">{description}</Text>}
			</div>
			<div className="flex-shrink-0">{children}</div>
		</div>
	);
}

interface EmailTabButtonProps {
	active: boolean;
	onClick: () => void;
	children: React.ReactNode;
}

function EmailTabButton({ active, onClick, children }: EmailTabButtonProps) {
	return (
		<button
			onClick={onClick}
			className={`
				px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap
				${active ? 'border-b-2 border-primary text-primary' : 'text-gray-600 hover:text-gray-900'}
			`}
		>
			{children}
		</button>
	);
}
