import { IconProps } from '../types';

/**
 * Contacts/People Duotone Icon - Material Icons Two Tone style
 * @see https://fonts.google.com/icons?selected=Material+Icons+Two+Tone:people
 */
export default function ContactsDuotoneIcon(props: IconProps) {
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
			<path
				opacity=".3"
				d="M9 8.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 7c-1.65 0-3.25.51-4.5 1.32V18h9v-1.18c-1.25-.81-2.85-1.32-4.5-1.32z"
			/>
			{/* Primary outline */}
			<path d="M9 12.5c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 5.5c-2.33 0-7 1.17-7 3.5V19h14v-1.5c0-2.33-4.67-3.5-7-3.5zm5 3H4v-.32c.25-.8 2.95-2.18 5-2.18s4.75 1.39 5 2.18V17zm3.85-8.27c.62.92 1 2.02 1 3.22 0 1.22-.38 2.35-1.03 3.29l1.5 1.09c.88-1.22 1.41-2.71 1.41-4.32 0-1.57-.51-3.03-1.37-4.22l-1.51 .94zM15.5 10.5c0-1.19-.42-2.27-1.12-3.12l-1.52.93c.46.58.74 1.32.74 2.13 0 .8-.27 1.54-.73 2.12l1.52.94c.69-.86 1.11-1.94 1.11-3z" />
		</svg>
	);
}
