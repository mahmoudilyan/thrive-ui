import { IconProps } from '../types';

/**
 * Dashboard Duotone Icon - Material Icons Two Tone style
 * @see https://fonts.google.com/icons?selected=Material+Icons+Two+Tone:dashboard
 */
export default function DashboardDuotoneIcon(props: IconProps) {
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
			<path opacity=".3" d="M5 5h4v6H5zm10 8h4v6h-4zm-10 4h4v2H5zm10-12h4v2h-4z" />
			{/* Primary outline */}
			<path d="M3 13h8V3H3v10zm2-8h4v6H5V5zm8 16h8V11h-8v10zm2-8h4v6h-4v-6zM13 3v6h8V3h-8zm6 4h-4V5h4v2zM3 21h8v-6H3v6zm2-4h4v2H5v-2z" />
		</svg>
	);
}
