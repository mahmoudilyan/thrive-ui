// export async function register() {
// 	// Only load PostHog on client side and after initial page load
// 	if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
// 		// Defer PostHog loading to not block initial render
// 		setTimeout(async () => {
// 			try {
// 				const { default: posthog } = await import('posthog-js');

// 				posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
// 					api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
// 					person_profiles: 'identified_only',
// 					loaded: posthog => {
// 						if (process.env.NODE_ENV === 'development') console.log('PostHog loaded successfully');
// 					},
// 					capture_pageview: false, // We'll handle this manually
// 					capture_pageleave: true,
// 					autocapture: {
// 						css_selector_allowlist: ['.posthog-track'], // Only track elements with this class
// 					},
// 					// Add error handling and retry logic
// 					on_request_error: (error: any) => {
// 						console.warn(
// 							'PostHog request failed (likely blocked by ad blocker):',
// 							error?.message || error
// 						);
// 						// Don't retry as this is usually due to blocking
// 					},
// 					// Reduce network requests and improve performance
// 					property_blacklist: ['$current_url', '$pathname'],
// 					disable_session_recording: true, // Disable to improve performance
// 					disable_surveys: true, // Disable if not needed
// 					batch_requests: true, // Batch requests for better performance
// 				});

// 				// Graceful degradation for blocked requests
// 				const originalCapture = posthog.capture;
// 				posthog.capture = function (...args) {
// 					try {
// 						return originalCapture.apply(this, args);
// 					} catch (error) {
// 						if (process.env.NODE_ENV === 'development') {
// 							console.warn('PostHog capture failed (likely blocked):', error);
// 						}
// 						// Fail silently in production
// 					}
// 				};
// 			} catch (error) {
// 				console.warn('PostHog initialization failed:', error);
// 			}
// 		}, 2000); // Load after 2 seconds to not impact initial page load
// 	}
// }
