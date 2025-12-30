'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { MdCalendarToday } from 'react-icons/md';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { Input } from './input';
import { Card } from './card';
import { cn } from '../lib/utils';

export interface DatePreset {
	label: string;
	value: Date | [Date, Date] | (() => Date | [Date, Date]);
}

export interface DatePickerProps {
	/**
	 * Selected date value
	 */
	value?: Date | [Date, Date];
	/**
	 * Callback when date selection changes
	 */
	onChange?: (date: Date | [Date, Date] | undefined) => void;
	/**
	 * Whether to show preset date options
	 */
	hasPresets?: boolean;
	/**
	 * Custom preset options to display
	 */
	presets?: DatePreset[];
	/**
	 * Input placeholder
	 */
	placeholder?: string;
	/**
	 * Allow range selection
	 */
	isRange?: boolean;
	/**
	 * Whether the input is disabled
	 */
	disabled?: boolean;
	/**
	 * Format string for date display
	 */
	dateFormat?: string;
	/**
	 * Matcher to disable specific dates
	 */
	disabledDays?: (date: Date) => boolean;
	/**
	 * Earliest date that can be displayed or selected
	 */
	startMonth?: Date;
	/**
	 * Latest date that can be displayed or selected
	 */
	endMonth?: Date;
	/**
	 * Callback when the popover is closed
	 */
	onClose?: () => void;
	/**
	 * Additional className for the trigger
	 */
	className?: string;
	/**
	 * Trigger type - 'button' or 'input'
	 * @default 'button'
	 */
	triggerType?: 'button' | 'input';
}

// Create presets based on isRange
const createPresets = (isRange: boolean): DatePreset[] => [
	{
		label: 'Today',
		value: () => {
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			if (isRange) {
				const endOfDay = new Date(today);
				endOfDay.setHours(23, 59, 59, 999);
				return [today, endOfDay];
			}

			return today;
		},
	},
	{
		label: 'Yesterday',
		value: () => {
			const yesterday = new Date();
			yesterday.setDate(yesterday.getDate() - 1);
			yesterday.setHours(0, 0, 0, 0);

			if (isRange) {
				const endOfYesterday = new Date(yesterday);
				endOfYesterday.setHours(23, 59, 59, 999);
				return [yesterday, endOfYesterday];
			}

			return yesterday;
		},
	},
	{
		label: 'This Week',
		value: () => {
			const now = new Date();
			const day = now.getDay();
			const startDiff = day === 0 ? -6 : 1 - day;

			const start = new Date(now);
			start.setDate(now.getDate() + startDiff);
			start.setHours(0, 0, 0, 0);

			const end = new Date(start);
			end.setDate(start.getDate() + 6);
			end.setHours(23, 59, 59, 999);

			return [start, end];
		},
	},
	{
		label: 'Last Week',
		value: () => {
			const now = new Date();
			const day = now.getDay();
			const startDiff = day === 0 ? -13 : -6 - day + 1;

			const start = new Date(now);
			start.setDate(now.getDate() + startDiff);
			start.setHours(0, 0, 0, 0);

			const end = new Date(start);
			end.setDate(start.getDate() + 6);
			end.setHours(23, 59, 59, 999);

			return [start, end];
		},
	},
	{
		label: 'This Month',
		value: () => {
			const now = new Date();

			const start = new Date(now.getFullYear(), now.getMonth(), 1);
			start.setHours(0, 0, 0, 0);

			const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
			end.setHours(23, 59, 59, 999);

			return [start, end];
		},
	},
	{
		label: 'Last Month',
		value: () => {
			const now = new Date();

			const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
			start.setHours(0, 0, 0, 0);

			const end = new Date(now.getFullYear(), now.getMonth(), 0);
			end.setHours(23, 59, 59, 999);

			return [start, end];
		},
	},
	{
		label: 'Custom',
		value: () => new Date(),
	},
];

/**
 * A date picker component with input trigger and popover calendar
 */
export function DatePicker({
	value,
	onChange,
	hasPresets = false,
	presets: customPresets,
	placeholder = 'Select date',
	isRange = false,
	disabled = false,
	dateFormat = 'MMM dd, yyyy',
	disabledDays,
	startMonth,
	endMonth,
	onClose,
	className,
	triggerType = 'button',
}: DatePickerProps) {
	const presets = customPresets || createPresets(isRange);

	const [isOpen, setIsOpen] = React.useState(false);
	const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
		Array.isArray(value) ? value[0] : value
	);
	const [selectedEndDate, setSelectedEndDate] = React.useState<Date | undefined>(
		Array.isArray(value) ? value[1] : undefined
	);
	const [selectedPreset, setSelectedPreset] = React.useState<string | null>(null);
	const inputRef = React.useRef<HTMLButtonElement | HTMLInputElement>(null);

	React.useEffect(() => {
		if (value) {
			if (Array.isArray(value)) {
				setSelectedDate(value[0]);
				setSelectedEndDate(value[1]);
			} else {
				setSelectedDate(value);
				setSelectedEndDate(undefined);
			}
		} else {
			// Clear dates when value is undefined
			setSelectedDate(undefined);
			setSelectedEndDate(undefined);
		}
	}, [value]);

	// Format display value
	const displayValue = React.useMemo(() => {
		if (!selectedDate) return '';
		if (isRange && selectedEndDate) {
			return `${format(selectedDate, dateFormat)} - ${format(selectedEndDate, dateFormat)}`;
		}
		return format(selectedDate, dateFormat);
	}, [selectedDate, selectedEndDate, dateFormat, isRange]);

	const handleSingleDaySelect = (day: Date | undefined) => {
		if (!day) return;
		setSelectedPreset('Custom');
		setSelectedDate(day);
	};

	const handleRangeDaySelect = (range: { from: Date | undefined; to: Date | undefined }) => {
		if (range?.from) {
			setSelectedPreset('Custom');
			setSelectedDate(range.from);
			setSelectedEndDate(range.to);
		}
	};

	const handlePresetSelect = (preset: DatePreset) => {
		setSelectedPreset(preset.label);

		if (preset.label === 'Custom') {
			return;
		}

		const presetValue = typeof preset.value === 'function' ? preset.value() : preset.value;

		if (Array.isArray(presetValue)) {
			const startDate = new Date(presetValue[0]);
			const endDate = presetValue[1] ? new Date(presetValue[1]) : undefined;

			setSelectedDate(startDate);
			setSelectedEndDate(endDate);
		} else {
			const date = new Date(presetValue);
			setSelectedDate(date);
			setSelectedEndDate(undefined);
		}
	};

	const handleApply = () => {
		if (!onChange || !selectedDate) return;

		if (isRange && selectedEndDate) {
			onChange([selectedDate, selectedEndDate]);
		} else if (!isRange) {
			onChange(selectedDate);
		}

		setIsOpen(false);
		onClose?.();
	};

	const handleCancel = () => {
		// Reset to original value
		if (value) {
			if (Array.isArray(value)) {
				setSelectedDate(value[0]);
				setSelectedEndDate(value[1]);
			} else {
				setSelectedDate(value);
			}
		} else {
			setSelectedDate(undefined);
			setSelectedEndDate(undefined);
		}
		setIsOpen(false);
		onClose?.();
	};

	const handleClear = () => {
		setSelectedDate(undefined);
		setSelectedEndDate(undefined);
		onChange?.(undefined);
	};

	return (
		<Popover
			open={isOpen}
			onOpenChange={open => {
				setIsOpen(open);
				if (!open) {
					onClose?.();
				}
				// Keep trigger focused when popover opens
				if (open && inputRef.current) {
					setTimeout(() => {
						inputRef.current?.focus();
					}, 0);
				}
			}}
		>
			<PopoverTrigger asChild>
				{triggerType === 'input' ? (
					<div className="relative">
						<Input
							ref={inputRef as React.RefObject<HTMLInputElement>}
							value={displayValue}
							placeholder={placeholder}
							readOnly
							disabled={disabled}
							className={cn('cursor-pointer pr-20', className)}
							startAdornment={<MdCalendarToday className="h-4 w-4" />}
							onClick={() => !disabled && setIsOpen(true)}
						/>
						{displayValue && !disabled && (
							<Button
								variant="secondary"
								size="sm"
								onClick={e => {
									e.stopPropagation();
									handleClear();
								}}
								className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-ink-light hover:bg-muted hover:text-ink"
								aria-label="Clear date"
								leftIcon={<MdCalendarToday />}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									className="h-4 w-4"
								>
									<path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
								</svg>
							</Button>
						)}
					</div>
				) : (
					<Button
						ref={inputRef as React.RefObject<HTMLButtonElement>}
						variant="secondary"
						disabled={disabled}
						className={cn(
							'w-full justify-start text-left font-normal',
							!displayValue && 'text-ink-light',
							className
						)}
						leftIcon={<MdCalendarToday />}
					>
						{displayValue || placeholder}
					</Button>
				)}
			</PopoverTrigger>
			<PopoverContent
				className="w-auto p-0"
				align="start"
				onOpenAutoFocus={e => {
					// Prevent the popover from stealing focus
					e.preventDefault();
					inputRef.current?.focus();
				}}
			>
				<Card className="border-0 shadow-none">
					<div className="flex">
						{hasPresets && (
							<div className="w-48 border-r border-border-secondary bg-panel p-3 rounded-s-xl">
								<div className="flex flex-col gap-1">
									{presets.map((preset, index) => (
										<Button
											key={index}
											variant="ghost"
											size="sm"
											className={cn('justify-start font-normal')}
											onClick={() => handlePresetSelect(preset)}
											data-active={selectedPreset === preset.label}
										>
											{preset.label}
										</Button>
									))}
								</div>
							</div>
						)}
						<div className="flex flex-col">
							{isRange ? (
								<Calendar
									mode="range"
									selected={{ from: selectedDate, to: selectedEndDate }}
									onSelect={handleRangeDaySelect}
									numberOfMonths={2}
									disabled={disabledDays}
									startMonth={startMonth}
									endMonth={endMonth}
								/>
							) : (
								<Calendar
									mode="single"
									selected={selectedDate}
									onSelect={handleSingleDaySelect}
									disabled={disabledDays}
									startMonth={startMonth}
									endMonth={endMonth}
								/>
							)}
							<div className="flex items-center justify-end gap-2 border-t border-border-secondary p-3">
								<Button variant="ghost" size="sm" onClick={handleCancel}>
									Cancel
								</Button>
								<Button
									size="sm"
									onClick={handleApply}
									disabled={!selectedDate || (isRange && !selectedEndDate)}
								>
									Apply
								</Button>
							</div>
						</div>
					</div>
				</Card>
			</PopoverContent>
		</Popover>
	);
}

DatePicker.displayName = 'DatePicker';

export default DatePicker;
