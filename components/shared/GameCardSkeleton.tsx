import { Skeleton } from "@/components/ui/skeleton";

export function GameCardSkeleton() {
	return (
		<div className="flex flex-col md:flex-row p-4 gap-4">
			<Skeleton className="self-center w-32 h-32 rounded-lg" />

			<div className="flex-grow">
				<div className="flex items-center gap-2">
					<Skeleton className="w-10 h-6" />
					<Skeleton className="h-6 w-48" />
				</div>
				<Skeleton className="my-4 w-full h-1" />
				<div className="flex justify-evenly flex-col gap-4 items-center">
					<Skeleton className="h-4 w-64" />
					<Skeleton className="h-4 w-48" />
				</div>
			</div>
		</div>
	);
}
