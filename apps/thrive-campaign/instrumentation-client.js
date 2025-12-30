// import posthog from 'posthog-js';

// // Enhanced PostHog initialization with error handling
// if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
// 	try {
// 		posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
// 			api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
// 			person_profiles: 'identified_only',
// 			loaded: posthog => {
// 				if (process.env.NODE_ENV === 'development') {
// 					console.log('PostHog loaded successfully');
// 				}
// 			},
// 			capture_pageview: false, // Handle manually
// 			capture_pageleave: true,
// 			autocapture: {
// 				css_selector_allowlist: ['.posthog-track'],
// 			},
// 			// Handle blocked requests gracefully
// 			on_request_error: error => {
// 				console.warn('PostHog request blocked (likely by ad blocker):', error.message);
// 			},
// 			transport: 'fetch',
// 			request_batching: true,
// 			batch_requests: true,
// 		});

// 		// Override capture method with error handling
// 		const originalCapture = posthog.capture;
// 		posthog.capture = function (...args) {
// 			try {
// 				return originalCapture.apply(this, args);
// 			} catch (error) {
// 				if (process.env.NODE_ENV === 'development') {
// 					console.warn('PostHog capture blocked:', error);
// 				}
// 				// Fail silently in production
// 				return Promise.resolve();
// 			}
// 		};
// 	} catch (error) {
// 		console.warn('PostHog initialization failed:', error);
// 	}
// }
