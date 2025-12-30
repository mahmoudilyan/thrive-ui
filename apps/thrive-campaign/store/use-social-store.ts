import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { produce } from 'immer';

// --- Base Types ---
export interface SocialProfile {
	id: string;
	uid?: string;
	name: string;
	picture: string;
	note?: string;
	type?: string; // 'page', 'profile', 'company', 'business', 'personal', 'googlecalendar', etc.
	boards?: any[]; // Specific to Pinterest
}

export interface SocialChannel {
	type: string; // 'facebook', 'twitter', 'linkedin', etc.
	socid: string;
	channel: string; // e.g., "facebook:177322135653611"
	profile: SocialProfile;
	revoked: 0 | 1;
}

export interface SocialGroup {
	id: string;
	socid: string;
	name: string;
	socials: string[]; // Array of channel strings
}

export interface ChannelsAndGroupsData {
	channels: SocialChannel[];
	socialGroups: SocialGroup[];
	timezone?: string;
	status?: string;
}

export interface ChannelTab {
	id: string; // e.g., "feeds", "messages", "videos"
	name: string;
	visible: 0 | 1;
	channel?: string; // Additional channel info when in socialTabs
}

export interface StreamSettings {
	channelId: string;
	channelType: string;
	visibleStreams: string[]; // Array of stream IDs that should be visible
}

export interface GroupStreamSettings {
	groupId: string;
	channels: StreamSettings[]; // Settings for each channel in the group
}

export interface SocialTabGroup {
	title: string;
	social: string; // e.g., "facebook", "youtube", "instagram"
	tabs: ChannelTab[];
}

export interface ChannelTabsResponse {
	tabs: ChannelTab[];
	socialTabs?: SocialTabGroup[];
	isHashtags?: 0 | 1;
	isSearch?: 0 | 1;
	isPlaylistVideo?: 0 | 1;
	playlistTabs?: any[];
	status?: string;
}

// --- Stream Item Types ---
export interface StreamHeader {
	picture: string;
	account_name: string;
	url: string;
	userid: string;
}

export interface StreamMediaImage {
	height?: number;
	src: string;
	width?: number;
}

export interface StreamMediaGalleryItem {
	media: { image: StreamMediaImage };
	target?: { id: string; url: string };
	type: 'photo';
	url?: string;
}

export interface StreamMedia {
	type: 'image' | 'video' | 'gallery' | 'album' | string;
	thumb?: string | StreamMediaGalleryItem[];
	picture?: string | StreamMediaGalleryItem[]; // Used in facebook feed/album
	url?: string; // For video direct URL or main link for other media
}

export interface StreamBody {
	text: string;
	media?: StreamMedia;
	timestamp: string;
	postLink: string;
	story?: string;
	link?: { name: string; link: string; caption: string; description: string }; // For link type posts
}

export interface StreamPermissions {
	like: 0 | 1;
	comment: 0 | 1;
}

export interface BaseSocialStreamItem {
	uid: string;
	id: string; // Post ID or item ID
	header: StreamHeader;
	isPublished?: boolean;
	likes?: number;
	comments?: number;
	shares?: number;
	liked?: 0 | 1;
	can: StreamPermissions;
	streamType: string; // e.g., "facebookFeed", "facebookTags", "youtubeVideo"
	type: string; // e.g., "video", "album", "photo", "status", "link"
}

export interface SocialFeedItem extends BaseSocialStreamItem {
	body: StreamBody;
}

export interface SocialTaggedPostItem extends BaseSocialStreamItem {
	body: StreamBody; // Structure appears similar to FeedItem
}

// --- Stream Response Root Profile ---
export interface SocialStreamResponseProfile {
	id: string; // Channel ID for which the stream is fetched
	name: string;
	picture: string;
}

// --- Specific Stream Data Structures ---

// Feed/Tags/Ads Stream
export interface GenericStreamData<T extends BaseSocialStreamItem> {
	tabid: string;
	isGroup: boolean;
	id: string; // channel id for which the stream is fetched
	type: string; // channel type e.g. "facebook"
	stream: T[];
	profile: SocialStreamResponseProfile;
	title: string;
	after?: string | null;
	before?: string | null;
	status: string;
}

// Direct Messages
export interface SocialDirectMessageSender {
	id: string;
	name: string;
	picture?: string;
}

export interface SocialDirectMessageContent {
	sender: 0 | 1; // 0 for page, 1 for user
	id: string; // message id
	from: SocialDirectMessageSender;
	message: string;
	timestamp: number;
	created_time: string;
	images?: any[];
	videos?: any[];
	files?: any[];
}

export interface SocialDirectMessageThread {
	id: string; // thread id
	updated_time: string;
	more: 0 | 1;
	sender: SocialDirectMessageSender; // last message sender in thread
	snippet: string;
	unread: string | number;
	messages: SocialDirectMessageContent[];
	after?: string | null;
	can: { reply: 0 | 1 };
	'messages-timestamp'?: number; // Facebook specific
}

export interface SocialDirectMessagesData {
	tabid: string;
	isGroup: boolean;
	id: string; // channel id
	type: string; // channel type
	messages: SocialDirectMessageThread[];
	profile: SocialStreamResponseProfile;
	title: string;
	after?: string | null;
	status: string;
}

// Reviews
export interface SocialReviewItemBody {
	text: string;
	rating: string | number;
	timestamp: string;
	postLink: string;
}

export interface SocialReviewItem {
	uid: string;
	id: string;
	header: StreamHeader; // User who made the review
	body: SocialReviewItemBody;
	likes: number;
	comments: number;
	liked: 0 | 1;
	can: StreamPermissions & { like?: 0 | 1 }; // Review 'can' might be slightly different
	streamType: 'facebookReview' | string;
	isArchived?: 0 | 1;
}

export interface SocialReviewsData {
	tabid: string;
	isGroup: boolean;
	id: string; // channel id
	type: string; // channel type
	reviews: SocialReviewItem[];
	profile: SocialStreamResponseProfile;
	title: string;
	status: string;
	after?: string | null;
}

// Combine specific stream types into a union for easier state management
export type SocialStreamData =
	| GenericStreamData<SocialFeedItem>
	| SocialDirectMessagesData
	| GenericStreamData<SocialTaggedPostItem>
	| SocialReviewsData
	| GenericStreamData<BaseSocialStreamItem>; // Generic fallback

// --- Store State and Actions ---
export interface SocialStateData {
	channelsAndGroups: ChannelsAndGroupsData | null;
	isLoadingChannelsAndGroups: boolean;
	channelsAndGroupsError: string | null;

	activeChannelTabs: ChannelTab[] | null;
	isLoadingActiveChannelTabs: boolean;
	activeChannelTabsError: string | null;

	// Simplified stream state
	currentStreamData: SocialStreamData | null;
	isLoadingStream: boolean;
	streamError: string | null;
	streamPaginationAfter: string | null; // Store the 'after' cursor

	selectedChannel: SocialChannel | null;
	selectedGroup: SocialGroup | null;
	selectedTabId: string | null;

	// Stream visibility settings
	streamVisibilitySettings: Record<string, string[]>; // channelId -> visible stream IDs
	hiddenStreams: Record<string, string[]>; // channelId -> hidden stream IDs
}

const defaultSocialData: SocialStateData = {
	channelsAndGroups: null,
	isLoadingChannelsAndGroups: false,
	channelsAndGroupsError: null,
	activeChannelTabs: null,
	isLoadingActiveChannelTabs: false,
	activeChannelTabsError: null,
	currentStreamData: null,
	isLoadingStream: false,
	streamError: null,
	streamPaginationAfter: null,
	selectedChannel: null,
	selectedGroup: null,
	selectedTabId: null,
	streamVisibilitySettings: {},
	hiddenStreams: {},
};

// Helper to add CSRF token (adapt based on your actual CSRF implementation)
const attachCsrf = (url: string): string => {
	const csrfCookie = document.cookie.split('; ').find(row => row.startsWith('VBT_CSRF_TOKEN='));
	const csrfToken = csrfCookie ? csrfCookie.split('=')[1] : null;

	if (csrfToken) {
		const separator = url.includes('?') ? '&' : '?';
		return `${url}${separator}VBT_CSRF_TOKEN=${encodeURIComponent(csrfToken)}`;
	}
	return url;
};

// Helper to add CSRF token to FormData
const attachCsrfToFormData = (formData: FormData): void => {
	const csrfCookie = document.cookie.split('; ').find(row => row.startsWith('VBT_CSRF_TOKEN='));
	const csrfToken = csrfCookie ? csrfCookie.split('=')[1] : null;

	if (csrfToken) {
		formData.set('VBT_CSRF_TOKEN', csrfToken);
	}
};

const BASE_URL = 'https://app.vbout.com/App'; // Adjust if needed

export interface SocialStore extends SocialStateData {
	fetchChannelsAndGroups: () => Promise<void>;
	fetchChannelTabs: (channelId: string) => Promise<void>;
	fetchChannelStream: (
		channelId: string,
		channelType: string,
		tabId: string,
		loadMore?: boolean
	) => Promise<void>;
	setSelectedChannel: (channel: SocialChannel | null) => void;
	setSelectedGroup: (group: SocialGroup | null) => void;
	setSelectedTab: (tabId: string | null) => void;
	resetSocialState: () => void;
	setChannelsAndGroups: (data: ChannelsAndGroupsData | null) => void;
	setActiveChannelTabs: (tabs: ChannelTab[] | null, autoSelectFirst?: boolean) => void;
	setCurrentStreamData: (data: SocialStreamData | null) => void;
	updateStreamVisibility: (channelId: string, visibleStreams: string[]) => Promise<void>;
	hideStream: (channelId: string, streamId: string) => void;
	showStream: (channelId: string, streamId: string) => void;
	isStreamVisible: (channelId: string, streamId: string) => boolean;
}

export const useSocialStore = create<SocialStore>()(
	persist(
		(set, get) => ({
			...defaultSocialData,

			fetchChannelsAndGroups: async () => {
				if (get().isLoadingChannelsAndGroups) return; // Prevent concurrent fetches
				set(
					produce((state: SocialStateData) => {
						state.isLoadingChannelsAndGroups = true;
						state.channelsAndGroupsError = null;
					})
				);
				try {
					const url = attachCsrf(`${BASE_URL}/SocialMedia/GetChannels.json`);
					const response = await fetch(url, { credentials: 'include' });
					if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
					const data: ChannelsAndGroupsData = await response.json();
					if (data.status !== 'success')
						throw new Error('API returned non-success status for channels');

					set(
						produce((state: SocialStateData) => {
							state.channelsAndGroups = data;
							state.isLoadingChannelsAndGroups = false;
						})
					);
				} catch (error) {
					console.error('Failed to fetch channels and groups:', error);
					set(
						produce((state: SocialStateData) => {
							state.isLoadingChannelsAndGroups = false;
							state.channelsAndGroupsError = (error as Error).message || 'Failed to fetch channels';
						})
					);
				}
			},

			fetchChannelTabs: async (channelId: string) => {
				if (!channelId || get().isLoadingActiveChannelTabs) return;
				set(
					produce((state: SocialStateData) => {
						state.isLoadingActiveChannelTabs = true;
						state.activeChannelTabsError = null;
						state.activeChannelTabs = null;
					})
				);
				try {
					const url = attachCsrf(
						`${BASE_URL}/SocialStreams/ChannelTabs.json?channel=${encodeURIComponent(channelId)}`
					);
					const response = await fetch(url, { credentials: 'include' });
					if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
					const data: ChannelTabsResponse = await response.json();
					if (data.status !== 'success')
						throw new Error('API returned non-success status for tabs');

					// Filter only visible tabs
					const visibleTabs = data.tabs.filter(tab => tab.visible === 1);

					set(
						produce((state: SocialStateData) => {
							state.activeChannelTabs = visibleTabs;
							state.isLoadingActiveChannelTabs = false;
							// Automatically select the first tab if tabs are loaded and none is selected
							if (!state.selectedTabId && visibleTabs.length > 0) {
								state.selectedTabId = visibleTabs[0].id;
							}
						})
					);
					// If a tab was auto-selected, trigger stream fetch
					const newSelectedTabId = get().selectedTabId;
					const currentChannel = get().selectedChannel;
					if (
						currentChannel &&
						newSelectedTabId &&
						get().activeChannelTabs?.find(t => t.id === newSelectedTabId)
					) {
						get().fetchChannelStream(currentChannel.channel, currentChannel.type, newSelectedTabId);
					}
				} catch (error) {
					console.error(`Failed to fetch tabs for channel ${channelId}:`, error);
					set(
						produce((state: SocialStateData) => {
							state.isLoadingActiveChannelTabs = false;
							state.activeChannelTabsError = (error as Error).message || 'Failed to fetch tabs';
						})
					);
				}
			},

			fetchChannelStream: async (channelId, channelType, tabId, loadMore = false) => {
				if (get().isLoadingStream) return; // Prevent concurrent stream fetches

				const currentAfterCursor = get().streamPaginationAfter;
				const afterParam =
					loadMore && currentAfterCursor ? `&after=${encodeURIComponent(currentAfterCursor)}` : '';

				set(
					produce((state: SocialStateData) => {
						state.isLoadingStream = true;
						state.streamError = null;
						if (!loadMore) {
							// Clear data only if it's not pagination
							state.currentStreamData = null;
							state.streamPaginationAfter = null;
						}
					})
				);

				try {
					// Construct URL with channel, tab, and optional after cursor
					const url = attachCsrf(
						`${BASE_URL}/SocialStreams/Stream.json?channel=${encodeURIComponent(channelId)}&tabid=${encodeURIComponent(tabId)}${afterParam}&cacheAfter=0&create=yes`
					);
					const response = await fetch(url, { credentials: 'include' });
					if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
					const streamData: SocialStreamData = await response.json();
					if (streamData.status !== 'success')
						throw new Error(`API returned non-success status for stream ${tabId}`);

					set(
						produce((state: SocialStateData) => {
							if (loadMore && state.currentStreamData) {
								// Append new stream items to existing ones (basic example, might need type checking)
								if ('stream' in state.currentStreamData && 'stream' in streamData) {
									state.currentStreamData.stream = [
										...(state.currentStreamData.stream as any[]),
										...(streamData.stream as any[]),
									];
								} else if ('messages' in state.currentStreamData && 'messages' in streamData) {
									state.currentStreamData.messages = [
										...state.currentStreamData.messages,
										...streamData.messages,
									];
								} else if ('reviews' in state.currentStreamData && 'reviews' in streamData) {
									state.currentStreamData.reviews = [
										...state.currentStreamData.reviews,
										...streamData.reviews,
									];
								}
								state.currentStreamData.after = streamData.after; // Update cursor
							} else {
								// Replace current stream data
								state.currentStreamData = streamData;
							}
							state.streamPaginationAfter = streamData.after || null; // Store the new 'after' cursor
							state.isLoadingStream = false;
						})
					);
				} catch (error) {
					console.error(`Failed to fetch stream for tab ${tabId}:`, error);
					set(
						produce((state: SocialStateData) => {
							state.isLoadingStream = false;
							state.streamError = (error as Error).message || 'Failed to fetch stream';
						})
					);
				}
			},

			setSelectedChannel: channel => {
				set(
					produce((state: SocialStateData) => {
						if (state.selectedChannel?.channel !== channel?.channel) {
							state.selectedChannel = channel;
							state.selectedTabId = null;
							state.activeChannelTabs = null;
							state.currentStreamData = null;
							state.streamError = null;
							state.streamPaginationAfter = null;
						}
					})
				);
				if (channel) {
					get().fetchChannelTabs(channel.channel);
				}
			},

			setSelectedGroup: group => {
				set(
					produce((state: SocialStateData) => {
						state.selectedGroup = group;
					})
				);
			},

			setSelectedTab: tabId => {
				const currentChannel = get().selectedChannel;
				if (!currentChannel || !tabId || tabId === get().selectedTabId) return; // No change or no channel

				set(
					produce((state: SocialStateData) => {
						state.selectedTabId = tabId;
						state.currentStreamData = null;
						state.streamError = null;
						state.streamPaginationAfter = null;
					})
				);
				get().fetchChannelStream(currentChannel.channel, currentChannel.type, tabId);
			},

			resetSocialState: () => {
				set(defaultSocialData);
			},

			setChannelsAndGroups: data => {
				set(
					produce((state: SocialStateData) => {
						state.channelsAndGroups = data;
					})
				);
			},

			setActiveChannelTabs: (tabs, autoSelectFirst = false) => {
				set(
					produce((state: SocialStateData) => {
						state.activeChannelTabs = tabs;
						if (autoSelectFirst && tabs && tabs.length > 0 && !state.selectedTabId) {
							state.selectedTabId = tabs[0].id;
						}
					})
				);
			},

			setCurrentStreamData: data => {
				set(
					produce((state: SocialStateData) => {
						state.currentStreamData = data;
					})
				);
			},

			updateStreamVisibility: async (channelId: string, visibleStreams: string[]) => {
				try {
					// Prepare the form data for the API call
					const formData = new FormData();
					formData.append('channel', channelId);
					visibleStreams.forEach(streamId => {
						formData.append('tabs[]', streamId);
					});

					// Attach CSRF token to FormData
					attachCsrfToFormData(formData);

					const url = `${BASE_URL}/SocialStreams/UpdateChannelTabs.json`;
					const response = await fetch(url, {
						method: 'POST',
						body: formData,
						credentials: 'include',
					});

					if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

					const result = await response.json();
					if (result.status !== 'success') {
						throw new Error('API returned non-success status for updating channel tabs');
					}

					// Update the local state
					set(
						produce((state: SocialStateData) => {
							state.streamVisibilitySettings[channelId] = visibleStreams;
							// Note: Don't update activeChannelTabs immediately as it affects the main view
							// The tabs will be refreshed when the user navigates or the data is refetched
						})
					);
				} catch (error) {
					console.error('Failed to update stream visibility:', error);
					throw error;
				}
			},

			hideStream: (channelId: string, streamId: string) => {
				set(
					produce((state: SocialStateData) => {
						if (!state.hiddenStreams[channelId]) {
							state.hiddenStreams[channelId] = [];
						}
						if (!state.hiddenStreams[channelId].includes(streamId)) {
							state.hiddenStreams[channelId].push(streamId);
						}
						// Update activeChannelTabs
						if (state.activeChannelTabs) {
							state.activeChannelTabs = state.activeChannelTabs.map(tab =>
								tab.id === streamId ? { ...tab, visible: 0 } : tab
							);
						}
					})
				);
			},

			showStream: (channelId: string, streamId: string) => {
				set(
					produce((state: SocialStateData) => {
						if (state.hiddenStreams[channelId]) {
							state.hiddenStreams[channelId] = state.hiddenStreams[channelId].filter(
								id => id !== streamId
							);
						}
						// Update activeChannelTabs
						if (state.activeChannelTabs) {
							state.activeChannelTabs = state.activeChannelTabs.map(tab =>
								tab.id === streamId ? { ...tab, visible: 1 } : tab
							);
						}
					})
				);
			},

			isStreamVisible: (channelId: string, streamId: string) => {
				const state = get();

				// Check if stream is explicitly hidden
				if (state.hiddenStreams[channelId]?.includes(streamId)) {
					return false;
				}

				// Default to checking the tab's visible property first (from API)
				const tab = state.activeChannelTabs?.find(t => t.id === streamId);
				if (tab) {
					return tab.visible === 1;
				}

				// Fallback to visibility settings if tab data not available
				if (state.streamVisibilitySettings[channelId]) {
					return state.streamVisibilitySettings[channelId].includes(streamId);
				}

				// Default to hidden if no information available
				return false;
			},
		}),
		{
			name: 'social-store-storage',
			// partialize: (state) => ({ selectedChannel: state.selectedChannel }), // Persist only selected channel?
		}
	)
);

// Example of how to determine stream type based on channelType and tabId
// This logic would typically be inside fetchChannelStream or a utility function
/*
function getStreamType(channelType: string, tabId: string): string | null {
  if (channelType === 'facebook') {
    return tabId; // 'feeds', 'messages', 'tags', 'reviews', 'darkPosts'
  }
  if (channelType === 'youtube') {
    if (tabId === 'published_comments') return 'youtubeComments';
    if (tabId === 'videos') return 'youtubeVideos';
    // ...
  }
  // ... more types
  return null;
}
*/
