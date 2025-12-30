import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { produce } from 'immer';

// Define campaign types
export type CampaignRecipient = {
	id: string;
	type: 'list' | 'audience' | 'folder';
	name: string;
	contactsCount?: number;
};
export interface TemplateItem {
	id: string;
	label: string;
	type: string;
	thumb: string;
	editor?: number;
	new_builder?: boolean;
}

export type CampaignType = 'regular' | 'ab-campaign';

export type AbTestVariable = 'subject' | 'content' | 'fromName' | 'fromEmail' | null;
export type AbWinningMetric = 'openRate' | 'clickRate' | 'fullyRead' | 'conversion' | null;

export type CampaignProcessWarmUp = 'normal' | 'chunk' | 'predictive';

export interface CampaignDesign {
	templateId: string;
	contentHtml?: string;
	contentText?: string;
}

export interface UTMSettings {
	enabled: boolean;
	utmSource: string;
	utmMedium: string;
	utmCampaign: string;
	utmContent?: string;
	utmTerm?: string;
}

export interface SendingSettings {
	trackOpens: boolean;
	trackClicks: boolean;
	autoTweetAfterSend: boolean;
	autoPostToFacebook: boolean;
}

export interface CampaignData {
	id?: string;
	name: string;
	subject: string;
	subjectAbt?: string;
	preheader?: string;
	fromName: string;
	fromEmail: string;
	fromNameAbt?: string;
	fromEmailAbt?: string;
	replyToEmail: string;
	bccEmail?: string[];
	type: CampaignType;
	segmentA?: number;
	segmentB?: number;
	segmentC?: number;
	winningMetric?: AbWinningMetric;
	winningFallback?: AbWinningMetric;
	sendingDate?: Date;
	finalVariant?: 'A' | 'B';
	remainingHours?: number;
	abTestVariable?: AbTestVariable;
	recipients: CampaignRecipient[];
	excludeRecipients?: string[];
	warmUpProcess: CampaignProcessWarmUp;
	warmUpChunkStartTime?: string;
	warmUpChunkEndTime?: string;
	warmUpHourlyVolume?: number;
	warmUpDailyVolumeIncrease?: number;
	warmUpDailyLimit?: number;
	useCustomSmtp: boolean;
	smtpServer: string;
	useSmartRouting: boolean;
	smartRouting: {
		smtpId: string;
		rulesActivated: boolean;
		rules: Array<{
			id: string;
			name: string;
			condition: string;
			value: string;
		}>;
	};
	design: CampaignDesign;
	utmSettings: UTMSettings;
	sendingSettings: SendingSettings;
	createdAt?: string;
	updatedAt?: string;
	isDraft: boolean;
	isScheduled: boolean;
	isSent: boolean;
	selectedTemplate?: TemplateItem;
	selectedTemplateAbt?: TemplateItem;
	predictiveSendingMaxDate?: Date;
	predictiveSendingSchedule?: 'week' | 'schedule';
	warmupSendDays?: string[];
}

export type WarmUpProcess = 'normal' | 'chunk' | 'predictive';

export interface CampaignProcess {
	useSchedule: boolean;
}

export interface CampaignStore {
	campaignData: CampaignData;
	setCampaignField: <K extends keyof CampaignData>(field: K, value: CampaignData[K]) => void;
	updateNestedField: <K extends keyof CampaignData, N extends keyof CampaignData[K]>(
		parent: K,
		field: N,
		value: CampaignData[K][N]
	) => void;
	addRecipient: (recipient: CampaignRecipient) => void;
	removeRecipient: (recipientId: string) => void;
	setRecipients: (recipients: CampaignRecipient[]) => void;
	addExcludeRecipient: (recipient: CampaignRecipient) => void;
	removeExcludeRecipient: (recipient: CampaignRecipient) => void;
	setExcludeRecipients: (recipients: CampaignRecipient[]) => void;
	setWarmUpProcess: (process: WarmUpProcess) => void;
	sendCampaign: () => Promise<void>;
	loadCampaign: (id: string) => Promise<void>;
	resetCampaign: () => void;
	saveCampaign: (options: { isDraft: boolean }) => Promise<void>;
}

// Default campaign data
const defaultCampaignData: CampaignData = {
	name: '',
	subject: '',
	preheader: '',
	fromName: '',
	fromEmail: '',
	replyToEmail: '',
	type: 'regular',
	abTestVariable: null,
	recipients: [],
	excludeRecipients: [],
	warmUpProcess: 'normal',
	useCustomSmtp: false,
	smtpServer: '',
	useSmartRouting: false,
	smartRouting: {
		smtpId: '',
		rulesActivated: false,
		rules: [],
	},
	design: {
		templateId: '',
	},
	utmSettings: {
		enabled: false,
		utmSource: '',
		utmMedium: 'email',
		utmCampaign: '',
	},
	sendingSettings: {
		trackOpens: true,
		trackClicks: true,
		autoTweetAfterSend: false,
		autoPostToFacebook: false,
	},
	isDraft: true,
	isScheduled: false,
	isSent: false,
};

// Create the store
export const useCampaignStore = create<CampaignStore>()(
	persist(
		(set, get) => ({
			campaignData: JSON.parse(JSON.stringify(defaultCampaignData)),

			setCampaignField: (field, value) => {
				set(
					produce((state: { campaignData: CampaignData }) => {
						if (field === 'selectedTemplate' && value === undefined) {
							// Explicitly handle clearing the selected template
							state.campaignData.selectedTemplate = undefined;
							state.campaignData.design = {
								templateId: '',
								contentHtml: '',
								contentText: '',
							};
						} else if (field === 'selectedTemplateAbt' && value === undefined) {
							// Handle clearing A/B test template
							state.campaignData.selectedTemplateAbt = undefined;
						} else {
							// Handle setting any other field or a non-undefined template
							state.campaignData[field] = value;
						}
					})
				);
			},

			updateNestedField: (parent, field, value) => {
				set(
					produce((state: { campaignData: CampaignData }) => {
						// Ensure the parent object exists before assigning
						if (
							typeof state.campaignData[parent] === 'object' &&
							state.campaignData[parent] !== null
						) {
							(state.campaignData[parent] as any)[field] = value;
						} else {
							// Optionally handle cases where the parent object doesn't exist
							console.warn(`Parent object '${parent}' not found or not an object.`);
						}
					})
				);
			},

			addRecipient: recipient => {
				set(
					produce((state: { campaignData: CampaignData }) => {
						state.campaignData.recipients.push(recipient);
					})
				);
			},

			removeRecipient: recipientId => {
				set(
					produce((state: { campaignData: CampaignData }) => {
						state.campaignData.recipients = state.campaignData.recipients.filter(
							r => r.id !== recipientId
						);
					})
				);
			},

			setRecipients: recipients => {
				set(
					produce((state: { campaignData: CampaignData }) => {
						state.campaignData.recipients = recipients;
					})
				);
			},

			addExcludeRecipient: recipient => {
				set(
					produce((state: { campaignData: CampaignData }) => {
						if (!state.campaignData.excludeRecipients) {
							state.campaignData.excludeRecipients = [];
						}
						state.campaignData.excludeRecipients.push(recipient.id);
					})
				);
			},

			removeExcludeRecipient: recipient => {
				set(
					produce((state: { campaignData: CampaignData }) => {
						if (state.campaignData.excludeRecipients) {
							state.campaignData.excludeRecipients = state.campaignData.excludeRecipients.filter(
								id => id !== recipient.id
							);
						}
					})
				);
			},

			setExcludeRecipients: recipients => {
				set(
					produce((state: { campaignData: CampaignData }) => {
						state.campaignData.excludeRecipients = recipients.map(r => r.id);
					})
				);
			},

			setWarmUpProcess: process => {
				set(
					produce((state: { campaignData: CampaignData }) => {
						state.campaignData.warmUpProcess = process;
					})
				);
			},

			sendCampaign: async () => {
				set(
					produce((state: { campaignData: CampaignData }) => {
						state.campaignData.isDraft = false;
						state.campaignData.isScheduled = state.campaignData.isScheduled;
						state.campaignData.isSent = !state.campaignData.isScheduled;
						state.campaignData.updatedAt = new Date().toISOString();
					})
				);

				// In a real app, this would make an API call to send the campaign
				console.log('Sending campaign:', get().campaignData);
			},

			loadCampaign: async (id: string) => {
				// In a real app, this would make an API call to load the campaign
				console.log('Loading campaign with ID:', id);
				// For now, just return null
				return null;
			},

			resetCampaign: () => {
				set({ campaignData: JSON.parse(JSON.stringify(defaultCampaignData)) });
			},

			saveCampaign: async ({ isDraft }) => {
				set(
					produce((state: { campaignData: CampaignData }) => {
						state.campaignData.isDraft = isDraft;
						state.campaignData.updatedAt = new Date().toISOString();
						// isScheduled and isSent logic might need refinement based on actual workflow
					})
				);
				// In a real app, this would make an API call to save the campaign
				console.log('Saving campaign:', get().campaignData);
			},
		}),
		{
			name: 'campaign-storage',
		}
	)
);
