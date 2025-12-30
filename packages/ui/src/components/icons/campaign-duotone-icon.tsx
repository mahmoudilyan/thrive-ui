import { IconProps } from '../types';

/**
 * Campaign Duotone Icon - Material Icons Two Tone style
 * @see https://fonts.google.com/icons?selected=Material+Icons+Two+Tone:campaign
 */
export default function CampaignDuotoneIcon(props: IconProps) {
	const { fill = 'currentColor', width = '24', height = '24', className = '', ...rest } = props;

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={width}
			height={height}
			viewBox="0 0 24 24"
			fill={fill}
			className={className}
			{...rest}
		>
			{/* Secondary fill with opacity */}
			<path opacity=".3" d="M18 11c0 .67-.04 1.33-.14 1.98L14 11.51V8.52l3.88-1.63c.08.63.12 1.37.12 2.11z" />
			{/* Primary paths */}
			<path d="M18 11c0-.67-.04-1.48-.12-2.11l-3.88 1.63v2.99l3.86-1.49c.1-.65.14-1.35.14-2.02z" />
			<circle cx="9" cy="12" r="4" opacity=".3" />
			<path d="M9 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c1.66 0 3.14-.69 4.22-1.78l-1.42-1.42C11.05 15.55 10.08 16 9 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4c0 1.08-.45 2.05-1.2 2.8l1.42 1.42C14.31 15.14 15 13.66 15 12c0-3.31-2.69-6-6-6zm11.5-1.21l-1.41-1.41-2.5 2.5 1.41 1.41 2.5-2.5zm-2.5 13.92l2.5 2.5 1.41-1.41-2.5-2.5-1.41 1.41zM21 11h3v2h-3z" />
		</svg>
	);
}
