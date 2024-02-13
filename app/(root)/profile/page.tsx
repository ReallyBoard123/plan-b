import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import {
	getEventsByUser,
	getEventsByAttendee,
} from "@/lib/actions/event.actions";

import { SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs";
import Link from "next/link";

const ProfilePage = async ({ searchParams }: SearchParamProps) => {
	const { sessionClaims } = auth();
	const userId = sessionClaims?.userId as string;

	const attendeesPage = Number(searchParams?.attendeesPage) || 1;
	const eventsPage = Number(searchParams?.eventsPage) || 1;

	// Fetch organized events as before
	const organizedEventsResponse = await getEventsByUser({
		userId,
		page: eventsPage,
	});

	//Fetch attendee's upcoming events
	const attendeeEventsResponse = await getEventsByAttendee({
		userId,
		page: attendeesPage,
	});

	return (
		<>
			<section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
				<div className="wrapper flex items-center justify-center sm:justify-between">
					<h3 className="h3-bold text-center sm:text-left">Upcoming Events</h3>
					<Button asChild size="lg" className="button hidden sm:flex">
						<Link href="/#events">Explore More Events</Link>
					</Button>
				</div>
			</section>

			<section className="wrapper my-8">
				<Collection
					data={attendeeEventsResponse?.data}
					emptyTitle="No events participated in yet"
					emptyStateSubtext="No worries - plenty of exciting events to explore!"
					collectionType="Events_Attendee"
					limit={3}
					page={attendeesPage}
					urlParamName="attendeesPage"
					totalPages={attendeeEventsResponse?.totalPages}
				/>
			</section>

			<section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
				<div className="wrapper flex items-center justify-center sm:justify-between">
					<h3 className="h3-bold text-center sm:text-left">
						Events Organising
					</h3>
					<Button asChild size="lg" className="button hidden sm:flex">
						<Link href="/events/create">Create New Event</Link>
					</Button>
				</div>
			</section>
			<section className="wrapper my-8">
				<Collection
					data={organizedEventsResponse?.data}
					emptyTitle="No events have been created yet"
					emptyStateSubtext="Go create some now"
					collectionType="Events_Organizer"
					limit={3}
					page={eventsPage}
					urlParamName="eventsPage"
					totalPages={organizedEventsResponse?.totalPages}
				/>
			</section>
		</>
	);
};

export default ProfilePage;
