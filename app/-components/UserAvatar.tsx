"use client";

import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarGroup } from "@/components/ui";
import { sessionQuery } from "@/lib/react-query/queryOptions";

function UserAvatar() {
	const sessionQueryResult = useQuery(sessionQuery());

	return (
		<AvatarGroup.Root
			invertOverlap={true}
			tooltipProps={{ side: "top", sideOffset: 24 }}
			translate="10%"
		>
			<Avatar.Root
				className="size-[50px] rounded-full border-2 border-solid border-cyberaware-unizik-orange
					text-[18px] font-semibold"
			>
				<Avatar.Fallback>{sessionQueryResult.data?.avatar}</Avatar.Fallback>
				<AvatarGroup.Tooltip>
					{sessionQueryResult.data?.first_name} {sessionQueryResult.data?.last_name}
				</AvatarGroup.Tooltip>
			</Avatar.Root>
		</AvatarGroup.Root>
	);
}

export { UserAvatar };
