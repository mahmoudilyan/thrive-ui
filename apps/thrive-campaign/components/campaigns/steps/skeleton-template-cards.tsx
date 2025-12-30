import { Box, Flex, Skeleton } from '@thrive/ui';

interface SkeletonTemplateCardsProps {
	cardsNumber?: number;
}

export default function SkeletonTemplateCards({ cardsNumber = 6 }: SkeletonTemplateCardsProps) {
	return (
		<Flex gap="6" wrap="wrap">
			{Array.from({ length: cardsNumber }).map((_, index) => (
				<div key={index} className="flex flex-col space-y-3">
					<Skeleton className="h-60 w-56 rounded-xl" />
					<div className="space-y-1">
						<Skeleton className="h-5 w-56" />
					</div>
				</div>
			))}
		</Flex>
	);
}
