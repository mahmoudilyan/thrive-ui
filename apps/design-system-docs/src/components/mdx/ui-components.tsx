'use client';

// Re-export UI components for MDX
// These are optimized via optimizePackageImports in next.config.ts
// which automatically tree-shakes unused components

export { Button } from '@thrive/ui';

// Re-export commonly used icons (icons are lightweight)
export {
	MdAdd,
	MdEdit,
	MdDelete,
	MdSave,
	MdShare,
	MdFavorite,
	MdMoreVert,
	MdClose,
	MdSettings,
	MdSearch,
	MdMenu,
	MdArrowBack,
	MdRefresh,
	MdDownload,
	MdCheck,
	MdWarning,
	MdInfo,
	MdStar,
	MdFormatBold,
	MdFormatItalic,
	MdFormatUnderlined,
	MdFormatAlignLeft,
	MdFormatAlignCenter,
	MdFormatAlignRight,
	MdViewList,
	MdViewModule,
	MdViewStream,
	MdArrowForward,
} from 'react-icons/md';

// Re-export components - Next.js will optimize these via optimizePackageImports
export { Input } from '@thrive/ui';
export { Select } from '@thrive/ui';
export { Badge } from '@thrive/ui';
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@thrive/ui';
export { Avatar, AvatarImage, AvatarFallback } from '@thrive/ui';
export { Text } from '@thrive/ui';
export { Box } from '@thrive/ui';
export { Flex } from '@thrive/ui';
export {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@thrive/ui';
export { Tabs } from '@thrive/ui';
export { Checkbox } from '@thrive/ui';
export { Switch } from '@thrive/ui';
export { Slider } from '@thrive/ui';
export { Progress } from '@thrive/ui';
export { Spinner } from '@thrive/ui';
export { Tooltip } from '@thrive/ui';
export { Popover } from '@thrive/ui';
export {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuCheckboxItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuShortcut,
} from '@thrive/ui';
export { Label } from '@thrive/ui';
export { Textarea } from '@thrive/ui';
export { RadioGroup, Radio } from '@thrive/ui';
export { Alert } from '@thrive/ui';
export { Skeleton } from '@thrive/ui';
export { Accordion } from '@thrive/ui';
export { Breadcrumb } from '@thrive/ui';
export { ButtonGroup } from '@thrive/ui';
export { IconButton } from '@thrive/ui';
export { DatePicker } from '@thrive/ui';
export { Calendar } from '@thrive/ui';
export { DataTable } from '@thrive/ui';
export { PageSection } from '@thrive/ui';
export { TagsInput } from '@thrive/ui';
export { NumberInput } from '@thrive/ui';
export { Stepper } from '@thrive/ui';
export { EmptyState } from '@thrive/ui';
export { HoverCard } from '@thrive/ui';
export { LinkButton } from '@thrive/ui';
export { RadioCard } from '@thrive/ui';
export { Rating } from '@thrive/ui';
export { SegmentedControl } from '@thrive/ui';
export { StatCard } from '@thrive/ui';
export { Tag } from '@thrive/ui';
export { ToggleGroup } from '@thrive/ui';
export { ScrollArea } from '@thrive/ui';
export { Splitter } from '@thrive/ui';
export { Drawer } from '@thrive/ui';
export { CloseButton } from '@thrive/ui';
export { DescriptionList } from '@thrive/ui';
export { Field } from '@thrive/ui';
