import { IconProps } from '../types';

export default function BuilderIcon(props: IconProps) {
  const {
    fill = 'none',
    strokeColor,
    width = '24',
    height = '24',
    className = '',
    ...rest
  } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={strokeColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14z" />
      <path d="M9 3l-6 6" />
      <path d="M14 3l-7 7" />
      <path d="M19 3l-7 7" />
      <path d="M21 6l-4 4" />
      <path d="M3 10h18" />
      <path d="M10 10v11" />
    </svg>
  );
}