import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Collection from "@/components/shared/Collection";
import { SearchParamProps } from "@/types";
import { getAllEvents } from "@/lib/actions/event.actions";
import Search from "@/components/shared/Search";
import CategoryFilter from "@/components/shared/CategoryFilter";
import NotMyEventsCheckbox from "@/components/shared/NotMyEventsBox";
import { auth } from "@clerk/nextjs";

export default async function Home({ searchParams }: SearchParamProps) {
	const page = Number(searchParams?.page) || 1;
	const searchText = (searchParams?.query as string) || "";
	const category = (searchParams?.category as string) || "";
	const excludeMyEvents = searchParams?.excludeMyEvents === "true";

	const { sessionClaims } = auth();
	const userId = sessionClaims?.userId as string;

	const events = await getAllEvents({
		query: searchText,
		category,
		page,
		limit: 6,
		excludeMyEvents,
		userId: userId || undefined,
	});

	return (
		<>
			<section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
				<div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
					<div className="flex flex-col justify-center gap-8">
						<h1 className="h1-bold">
							Plan, Boardgame, Victory: let people meet meeple!
						</h1>
						<p className="p-regular-20 md:p-regular-24">
							Create and find boardgame meetups in your area. Discuss which
							games to play, learn new games, and make new friends.
						</p>
						<Button size="lg" asChild className="button w-full sm:w-fit">
							<Link href="#events">Explore Now</Link>
						</Button>
					</div>

					<Image
						src="/assets/images/hero-2.svg"
						alt="hero"
						width={1000}
						height={1000}
						className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
					/>
				</div>
			</section>
			<section
				id="events"
				className="wrapper my-8 flex flex-col gap-8 md:gap-12"
			>
				<h2 className="h2-bold">
					No boardgame <br />
					left unplayed!
				</h2>
				<div className="flex w-full flex-col gap-5 md:flex-row">
					<Search />
					<CategoryFilter />
					<NotMyEventsCheckbox />
				</div>
				<Collection
					data={events?.data}
					emptyTitle="No Events Found"
					emptyStateSubtext="Come back later"
					collectionType="All_Events"
					limit={6}
					page={page}
					totalPages={events?.totalPages}
				/>
			</section>
		</>
	);
}
