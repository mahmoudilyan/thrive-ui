import { Text, Badge, Box, Flex } from '@thrive/ui';

import { useState } from 'react';
import { HoverCardContent, HoverCard, HoverCardTrigger } from '@thrive/ui';

interface TargetDetailsProps {
	lists: string[];
	audiences: string[];
}

export function TargetDetails({ lists, audiences }: TargetDetailsProps) {
	const [hovered, setHovered] = useState(false);
	if (!lists?.length && !audiences?.length) {
		return (
			<Text variant="body-sm" color="text-muted-foreground">
				-
			</Text>
		);
	}

	const summary = (
		<Flex gap={'2'}>
			<Badge variant="normal">{lists.length} Lists</Badge>
			{audiences.length > 0 && <Badge variant="normal">{audiences.length} Audiences</Badge>}
		</Flex>
	);

	const details = (
		<>
			<Box className="flex items-center gap-1">
				<HoverCard>
					<HoverCardTrigger asChild>
						<Text variant="body-xs" className="underline underline-dotted cursor-pointer">
							{`${lists.length} Lists`}
						</Text>
					</HoverCardTrigger>
					<HoverCardContent>
						<Text as="h6" variant="caps-sm" fontWeight="medium" className="mb-1">
							Lists
						</Text>
						<ul role="list" className="list-disc list-inside space-y-1 pl-0 m-0 marker:mr-1">
							{lists.map(list => (
								<li key={list}>
									<Text key={list} variant="body-xs">
										{list}
									</Text>
								</li>
							))}
						</ul>
					</HoverCardContent>
				</HoverCard>
			</Box>
			{audiences.length > 0 && (
				<Box className="flex items-center gap-1">
					<HoverCard>
						<HoverCardTrigger asChild>
							<Text variant="body-xs" className="underline underline-dotted cursor-pointer">
								{`${audiences.length} Audiences`}
							</Text>
						</HoverCardTrigger>
						<HoverCardContent>
							<Text as="h6" variant="caps-sm" fontWeight="medium" className="mb-1">
								Audiences
							</Text>
							<ul role="list" className="list-disc list-inside space-y-1 pl-0 m-0 marker:mr-1">
								{audiences.map(audience => (
									<li key={audience}>
										<Text key={audience} variant="body-xs">
											{audience}
										</Text>
									</li>
								))}
							</ul>
						</HoverCardContent>
					</HoverCard>
				</Box>
			)}
		</>
		// <DataListRoot orientation="horizontal" size="sm" gap={0} p="0">
		//   <DataListItem
		//     label={`${lists.length} Lists`}
		//     value={''}
		//     info={lists.map(list => (
		//       <>
		//         <Heading as="h6" size="sm" bg="bg" p="2" m="0">
		//           Lists
		//         </Heading>
		//         <Text fontSize="sm">{list}</Text>
		//       </>
		//     ))}
		//   />
		//   {audiences.length > 0 && (
		//     <DataListItem
		//       label={`${audiences.length} Audiences`}
		//       value={''}
		//       info={audiences.map(audience => (
		//         <Text key={audience} fontSize="sm">
		//           • {audience}
		//         </Text>
		//       ))}
		//     />
		//   )}
		// </DataListRoot>
	);
	//   <VStack align="flex-start" gap={1} textAlign="left">
	//     <Text fontWeight="medium" mb={1}>
	//       Target Lists:
	//     </Text>
	//     {lists.map(list => (
	//       <Text key={list} fontSize="sm">
	//         • {list}
	//       </Text>
	//     ))}
	//     {audiences.length > 0 && (
	//       <>
	//         <Text fontWeight="medium" mb={1}>
	//           Target Audiences:
	//         </Text>
	//         {audiences.map(audience => (
	//           <Text key={audience} fontSize="sm">
	//             • {audience}
	//           </Text>
	//         ))}
	//       </>
	//     )}
	//   </VStack>
	// );

	return details;

	return (
		<HoverCard open={hovered}>
			<HoverCardTrigger
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
			>
				<Box className="cursor-pointer text-left focus:outline-none">{summary}</Box>
			</HoverCardTrigger>
			<HoverCardContent>{details}</HoverCardContent>
		</HoverCard>
	);
}
