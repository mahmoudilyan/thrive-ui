import { useEffect, useCallback } from 'react';
import posthog from 'posthog-js';

interface PostHogConfig {
	enabled?: boolean;
	debug?: boolean;
}

export function usePostHog(config: PostHogConfig = {}) {
	const { enabled = true, debug = process.env.NODE_ENV === 'development' } = config;

	const isInitialized = useCallback(() => {
		try {
			return posthog.__loaded === true;
		} catch {
			return false;
		}
	}, []);

	const captureEvent = useCallback(
		(event: string, properties?: Record<string, any>) => {
			if (!enabled || !isInitialized()) {
				if (debug) console.log('PostHog not available, skipping event:', event);
				return Promise.resolve();
			}

			try {
				posthog.capture(event, properties);
				if (debug) console.log('PostHog event captured:', event, properties);
				return Promise.resolve();
			} catch (error) {
				if (debug) console.warn('PostHog capture failed:', error);
				return Promise.resolve();
			}
		},
		[enabled, isInitialized, debug]
	);

	const identifyUser = useCallback(
		(userId: string, properties?: Record<string, any>) => {
			if (!enabled || !isInitialized()) {
				if (debug) console.log('PostHog not available, skipping identify');
				return;
			}

			try {
				posthog.identify(userId, properties);
				if (debug) console.log('PostHog user identified:', userId);
			} catch (error) {
				if (debug) console.warn('PostHog identify failed:', error);
			}
		},
		[enabled, isInitialized, debug]
	);

	const resetUser = useCallback(() => {
		if (!enabled || !isInitialized()) {
			if (debug) console.log('PostHog not available, skipping reset');
			return;
		}

		try {
			posthog.reset();
			if (debug) console.log('PostHog user reset');
		} catch (error) {
			if (debug) console.warn('PostHog reset failed:', error);
		}
	}, [enabled, isInitialized, debug]);

	const capturePageView = useCallback(
		(path?: string) => {
			if (!enabled || !isInitialized()) {
				if (debug) console.log('PostHog not available, skipping page view');
				return;
			}

			try {
				posthog.capture('$pageview', path ? { $current_url: path } : undefined);
				if (debug) console.log('PostHog page view captured:', path);
			} catch (error) {
				if (debug) console.warn('PostHog page view failed:', error);
			}
		},
		[enabled, isInitialized, debug]
	);

	// Auto-capture page views on route changes
	useEffect(() => {
		if (typeof window !== 'undefined') {
			capturePageView(window.location.pathname);
		}
	}, [capturePageView]);

	return {
		captureEvent,
		identifyUser,
		resetUser,
		capturePageView,
		isInitialized: isInitialized(),
		enabled,
	};
}

// Utility for one-off tracking without hooks
export const trackEvent = (event: string, properties?: Record<string, any>) => {
	try {
		if (typeof window !== 'undefined' && posthog.__loaded) {
			posthog.capture(event, properties);
		}
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.warn('PostHog tracking failed:', error);
		}
	}
};
