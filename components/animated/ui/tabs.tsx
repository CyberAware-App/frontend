import { cnMerge } from "@/lib/utils/cn";
import * as TabsPrimitive from "../primitives/tabs";

function TabsRoot(props: React.ComponentProps<typeof TabsPrimitive.Root>) {
	const { className, ...restOfProps } = props;

	return <TabsPrimitive.Root className={cnMerge("flex flex-col gap-2", className)} {...restOfProps} />;
}

function TabsList(
	props: React.ComponentProps<typeof TabsPrimitive.List> & {
		classNames?: {
			highlight?: string;
			list?: string;
		};
	}
) {
	const { className, classNames, ...restOfProps } = props;

	return (
		<TabsPrimitive.Highlight
			className={cnMerge(
				"absolute inset-0 z-0 rounded-md border border-transparent bg-shadcn-background shadow-sm",
				classNames?.highlight
			)}
		>
			<TabsPrimitive.List
				className={cnMerge(
					`inline-flex h-9 w-fit items-center justify-center rounded-lg bg-shadcn-muted p-[3px]
					text-shadcn-muted-foreground`,
					className,
					classNames?.list
				)}
				{...restOfProps}
			/>
		</TabsPrimitive.Highlight>
	);
}

function TabsTrigger(
	props: React.ComponentProps<typeof TabsPrimitive.Trigger> & {
		classNames?: {
			highlight?: string;
			trigger?: string;
		};
	}
) {
	const { className, classNames, ...restOfProps } = props;

	return (
		<TabsPrimitive.HighlightItem
			value={restOfProps.value}
			className={cnMerge("flex-1", classNames?.highlight)}
		>
			<TabsPrimitive.Trigger
				className={cnMerge(
					`inline-flex h-[calc(100%-1px)] w-full flex-1 items-center justify-center gap-1.5 rounded-md
					px-2 py-1 text-sm font-medium whitespace-nowrap text-shadcn-muted-foreground
					transition-colors duration-500 ease-in-out focus-visible:border-shadcn-ring
					focus-visible:ring-[3px] focus-visible:ring-shadcn-ring/50 focus-visible:outline-1
					focus-visible:outline-shadcn-ring disabled:pointer-events-none disabled:opacity-50
					data-[state=active]:text-shadcn-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0
					[&_svg:not([class*='size-'])]:size-4`,
					className,
					classNames?.trigger
				)}
				{...restOfProps}
			/>
		</TabsPrimitive.HighlightItem>
	);
}

function TabsContentList(props: React.ComponentProps<typeof TabsPrimitive.ContentList>) {
	return <TabsPrimitive.ContentList {...props} />;
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
	return <TabsPrimitive.Content className={cnMerge("outline-none", className)} {...props} />;
}

export const Root = TabsRoot;
export const List = TabsList;
export const Trigger = TabsTrigger;
export const ContentList = TabsContentList;
export const Content = TabsContent;
