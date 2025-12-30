export type Platform =
	| 'facebook'
	| 'linkedin'
	| 'youtube'
	| 'pinterest'
	| 'tiktok'
	| 'twitter'
	| 'instagram'
	| 'whatsapp'
	| 'googlebusiness'
	| 'twilio';

// Base for author/user/channel information
export interface SocialAuthor {
	id?: string | null;
	name: string;
	username?: string; // For platforms like Twitter, or YouTube @handle
	avatarUrl?: string | null;
	profileUrl?: string;
}

// Base for media content
export interface SocialMediaItem {
	type: 'image' | 'video' | 'gallery' | 'audio' | 'file' | 'article';
	url: string; // Main URL for the media
	thumbnailUrl?: string; // Thumbnail for videos or gallery previews
	altText?: string;
	duration?: number; // For video/audio in seconds
}

// --- LinkedIn ---
export interface LinkedInHeader {
	id: number | string; // Can be string like in user data, or number
	userid: number | string;
	account_name: string;
	picture?: string; // URL to avatar
	url?: string; // Profile/Page URL
}

export interface LinkedInMedia {
	type: 'video' | 'image' | 'article'; // article for shared links with preview
	thumb?: string; // Thumbnail for video or image preview
	url?: string; // Full image or video direct URL if available
	originalUrl?: string; // For shared articles, this might be the article link
}

export interface LinkedInPostBody {
	text: string; // HTML content
	media?: LinkedInMedia | ''; // Can be an empty string
	timestamp: string; // e.g., "05/21/2025 10:21 AM"
	postLink?: string;
}

export interface LinkedInPostItem {
	platform: 'linkedin';
	contentType: 'post';
	id: string; // postid or id
	ugcid?: string;
	author: LinkedInHeader; // Re-using for author info
	body: LinkedInPostBody;
	likes: number;
	comments: number;
	shares?: number; // LinkedIn sometimes has reshares, though not in current mock
	can?: {
		like?: number | boolean;
		comment?: number | boolean;
	};
	isArchived?: number | boolean;
}

// --- YouTube ---
export interface YouTubeItemHeader {
	userid: string; // Channel ID
	account_name: string; // Channel Name for Videos/Playlists, Author Name for comments
	picture?: string; // Video Thumbnail / Playlist Thumbnail / Author Avatar
	url?: string; // Channel URL / Video URL (for comments) / Playlist URL
	imageAlt?: string; // For thumbnails
}

export interface YouTubeVideoBody {
	text: string; // Video description (can be HTML)
	timestamp: string; // Upload date
	postLink?: string; // Actual video link (e.g., https://www.youtube.com/watch?v=VIDEO_ID)
	embedded?: string; // iframe embed code
	media?: any; // Usually empty in mock, embedded is primary
}

// This interface is for the items within the 'stream' array of youtubeVideos.json
export interface YouTubeVideoAPIData {
	uid: string;
	id: string; // Video ID
	header: YouTubeItemHeader; // Contains account_name (channel), picture (video thumb)
	can: { comment: number; remove: number; like: number };
	body: YouTubeVideoBody; // Contains text (description), timestamp, embedded iframe
	entities: { images: any[]; videos: any[] };
	streamType: string; // e.g., "myVideos"
	comments: string; // Number of comments as string
	views: string; // Number of views as string
	likes: string; // Number of likes as string
	type: 'youtube';
	// The following are from the root of the JSON, not per item, but needed for full context
	channelId?: string; // from root profile.id
	channelName?: string; // from root profile.name
	channelAvatarUrl?: string; // from root profile.picture
}

// This interface is for the items within the 'stream' array of youtubePlaylist.json
export interface YouTubePlaylistAPIData {
	uid: string;
	id: string; // Playlist ID
	header: YouTubeItemHeader; // Contains account_name (playlist title), picture (playlist thumb)
	can: { remove: number; listItems: number };
	body: {
		// Simplified body for playlists
		text: string; // Playlist description
		media: string;
		timestamp: string; // Playlist creation/update time
		postLink: string;
		embedded: string; // iframe for the playlist
	};
	entities: { images: any[]; videos: any[] };
	streamType: string;
	comments: string; // Empty for playlists
	views: string; // Empty for playlists
	likes: string; // Empty for playlists
	type: 'youtube';
	listItems: number; // Number of videos in the playlist
	// The following are from the root of the JSON, not per item, but needed for full context
	channelId?: string; // from root profile.id
	channelName?: string; // from root profile.name
	channelAvatarUrl?: string; // from root profile.picture
}

// This interface is for the items within the 'stream' array of youtubePublishedComments.json
export interface YouTubeCommentAPIData {
	id: string; // Comment ID
	uid: string; // Channel ID of the channel that owns the video commented on
	header: YouTubeItemHeader; // Contains picture (commenter avatar), account_name (commenter name), url (commenter channel URL)
	body: YouTubeCommentBody;
	likes: number;
	liked: number | boolean;
	can: { comment: number; remove: number; reject: number; publish: number };
	streamType: 'publishedComments';
	type: 'youtube';
	comments: number; // Number of replies to this comment
	// The following are from the root of the JSON, not per item, but needed for full context
	channelId?: string; // from root profile.id (the channel being viewed)
	channelName?: string; // from root profile.name
	channelAvatarUrl?: string; // from root profile.picture
}

export interface YouTubeVideoItem {
	platform: 'youtube';
	contentType: 'video';
	id: string; // Video ID
	author: SocialAuthor; // Derived: name = channelName, avatarUrl = channelAvatarUrl, profileUrl = channel's youtube url
	title?: string; // Video title - often missing, might need to construct or use description's start
	description: string; // body.text
	thumbnailUrl: string; // header.picture
	videoUrl: string; // Construct from ID: https://www.youtube.com/watch?v=${id}
	timestamp: string; // body.timestamp (needs conversion to number)
	views?: number;
	likes?: number;
	commentsCount?: number; // Comments on the video itself
	duration?: number; // Not in mock, but useful
	embedded?: string; // body.embedded
}

export interface YouTubePlaylistItem {
	platform: 'youtube';
	contentType: 'playlist';
	id: string; // Playlist ID
	author: SocialAuthor; // Derived: name = channelName, avatarUrl = channelAvatarUrl, profileUrl = channel's youtube url
	title: string; // header.account_name is playlist title
	description?: string; // body.text
	thumbnailUrl?: string; // header.picture
	playlistUrl: string; // header.url
	timestamp: string; // body.timestamp (needs conversion to number)
	itemCount: number; // listItems
	embedded?: string; // body.embedded
}

export interface YouTubeCommentItem {
	platform: 'youtube';
	contentType: 'comment';
	id: string; // Comment ID
	author: SocialAuthor; // header.account_name, header.picture, header.url
	text: string; // body.text
	timestamp: string; // body.timestamp (needs conversion to number)
	likes: number;
	repliesCount?: number; // 'comments' field in the mock
	videoUrl?: string; // body.postLink
	videoTitle?: string; // body.commentedOn
	can?: {
		comment?: number | boolean;
		remove?: number | boolean;
		// ... other permissions
	};
}

// --- Pinterest ---
// Placeholder for a Pinterest Pin
export interface PinterestPinItem {
	platform: 'pinterest';
	contentType: 'pin';
	id: string;
	author: SocialAuthor;
	description?: string;
	imageUrl: string;
	board?: { name: string; url?: string };
	likes?: number;
	repins?: number; // or saves
	timestamp: string | number;
	postUrl?: string;
}

// --- TikTok ---
// Raw data structure for a TikTok video item from the API (based on mock/tiktokFeed.json)
export interface TikTokAPIBody {
	text: string; // Contains HTML <span> wrapped description
	media: string; // Often empty in mock
	timestamp: string; // e.g., "03/05/2025 03:22 PM"
	postLink: string; // Often empty in mock, real link would be to the video on TikTok
	embedded: string; // HTML blockquote for embedding
	cover_image: string; // URL to the video's cover image
}

export interface TikTokAPIHeader {
	imageAlt?: string;
	userid: string; // User ID, e.g., "_000TeW10nKDbAw2Ohfc-UUqpp_3Faztve_R"
	account_name: string; // User's display name
	screen_name?: string; // Usually empty in mock
	picture?: string; // URL to user's avatar
	action?: string;
	url?: string; // URL to user's profile on TikTok
}

export interface TikTokAPIData {
	platform: 'tiktok'; // Added for consistency, though API has root-level type
	contentType: 'video'; // Added for consistency
	uid: string; // User ID, matches header.userid
	id: string; // Video ID, e.g., "7478423237966253342"
	header: TikTokAPIHeader;
	can?: {
		// Permissions, seem to be 0 in mock
		comment?: number | boolean;
		remove?: number | boolean;
		like?: number | boolean;
	};
	body: TikTokAPIBody;
	entities?: { images: any[]; videos: any[] }; // Usually empty in mock
	streamType?: string; // e.g., "myVideos"
	comments: number; // Number of comments on the video
	views: number; // Number of views
	likes: number; // Number of likes
	type: 'tiktok'; // From root of API response, redundant if platform prop exists
}

// Processed/Standardized TikTok Video Item for use in the card
export interface TikTokVideoItem {
	platform: 'tiktok';
	contentType: 'video';
	id: string; // Video ID
	author: SocialAuthor;
	description: string; // Parsed from body.text
	videoUrl?: string; // Link to the TikTok video page
	thumbnailUrl: string; // From body.cover_image
	embeddedContent?: string; // From body.embedded
	likes?: number;
	comments?: number;
	views?: number;
	timestamp: number; // Numeric timestamp (ms)
}

// --- General Review Item (from existing types) ---
export interface ReviewHeader {
	picture?: string;
	account_name: string;
	[key: string]: any; // For other potential fields
}

export interface ReviewBody {
	timestamp: string | number;
	text: string;
	postLink?: string;
	rating: number | string;
	[key: string]: any;
}
export interface SocialReviewItem {
	platform: 'review'; // Or specific like 'googlemybusiness'
	contentType: 'review';
	id: string;
	header: ReviewHeader; // Contains author name and picture
	body: ReviewBody; // Contains text, timestamp, rating
	likes?: number;
	comments?: number;
}

// --- General Feed Item (from existing types, Facebook/Twitter-like) ---
export interface SocialPostHeader {
	picture?: string;
	account_name: string;
	[key: string]: any;
}
export interface SocialPostBodyMedia {
	type: 'image' | 'video' | 'photo' | 'gallery';
	picture?: string; // for image or video thumb
	thumb?: string; // for video
	[key: string]: any;
}
export interface SocialPostBody {
	timestamp: string | number;
	text: string;
	postLink?: string;
	media?: SocialPostBodyMedia;
	[key: string]: any;
}
export interface SocialFeedItem {
	platform: 'facebook' | 'twitter' | 'instagram'; // Example platforms
	contentType: 'post' | 'feed';
	id: string;
	header: SocialPostHeader;
	body: SocialPostBody;
	likes?: number;
	comments?: number;
	shares?: number;
}

// Tagged post can be similar to feed item
export interface SocialTaggedPostItem extends SocialFeedItem {
	contentType: 'tagged-post';
}

// --- Direct Messages (from existing types) ---
export interface SocialDirectMessageFrom {
	id?: string | null;
	name: string;
	picture?: string | null;
}
export interface SocialDirectMessageContent {
	platform: Platform; // e.g. 'facebook', 'instagram'
	contentType: 'dm-message';
	id: string;
	message: string;
	timestamp: string | number;
	from: SocialDirectMessageFrom;
	sender: 0 | 1 | string; // 0 = page, 1 = user, or user ID
	media?: SocialMediaItem[]; // Array of media items
}

export interface SocialDirectMessageThread {
	id: string;
	platform: Platform;
	participants: SocialDirectMessageFrom[];
	lastMessagePreview?: string;
	lastMessageTimestamp?: string | number;
	unreadCount?: number;
	messages: SocialDirectMessageContent[]; // or fetched separately
}

// Union type for any social item that StreamItemCard can handle
// These are the types expected by the StreamItemCard component after processing in getItemData
export type ProcessedSocialItem =
	| SocialFeedItem // Assuming this gets standardized too
	| SocialTaggedPostItem // Assuming this gets standardized too
	| SocialDirectMessageContent // This has its own rendering path
	| SocialReviewItem // Assuming this gets standardized too
	| LinkedInPostItem // This would be the raw type from API
	| YouTubeVideoItem
	| YouTubePlaylistItem
	| YouTubeCommentItem
	| PinterestPinItem // Placeholder for processed Pin
	| TikTokVideoItem; // Added processed TikTok video

// Raw API data types union for the `item` prop before processing
export type RawSocialItem =
	| LinkedInPostItem // This is the structure from mock/linkedInFeed.json
	| YouTubeVideoAPIData // From mock/youtubeVideos.json
	| YouTubePlaylistAPIData // From mock/youtubePlaylist.json
	| YouTubeCommentAPIData // From mock/youtubePublishedComments.json
	| TikTokAPIData // Added raw TikTok data type
	// Add raw types for Facebook, Twitter, Instagram, Pinterest, TikTok here
	| SocialFeedItem // If raw Facebook/Twitter data matches this
	| SocialReviewItem // If raw Review data matches this
	| SocialDirectMessageContent; // If raw DM data matches this

// Standardized structure for getItemData to return for most card types
// DM messages have their own path and might not conform fully to this.
export interface StandardizedCardData {
	platform: Platform;
	contentType: string; // 'post', 'video', 'comment', 'playlist', 'review', 'pin'
	id: string;
	author: SocialAuthor;
	contentHtml: string; // The main text content, processed for display
	timestamp: number; // Unix timestamp in milliseconds
	postUrl?: string; // Link to the original post/video/comment
	mediaUrl?: string; // Primary media URL (e.g., image src, video thumbnail src)
	mediaType?: 'image' | 'video' | 'photo' | 'article'; // Type of the primary media
	likes?: number;
	comments?: number;
	shares?: number;
	views?: number;
	rating?: number | string;
	itemCount?: number; // For playlists (number of items)
	canLike?: boolean;
	canComment?: boolean;
	canReply?: boolean;
	liked?: boolean;
	replied?: boolean;
	replies?: number; // For comments (number of replies)
	isOwnMessage?: boolean; // For DMs
	// YouTube specific for comments
	commentedOnVideoTitle?: string;
	commentedOnVideoUrl?: string;
	// YouTube specific for videos/playlists
	embeddedContent?: string; // e.g. iframe for video/playlist
	title?: string; // For Videos/Playlists primarily
	reviewReply?: any;
}
