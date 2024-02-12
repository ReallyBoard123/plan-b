// import Collection from "@/components/shared/Collection";
// import { Button } from "@/components/ui/button";
// import { getEventsByUser } from "@/lib/actions/event.actions";
// import { getParticipationsByUser } from "@/lib/actions/attendee.actions";
// import { IEvent } from "@/lib/database/models/event.model";
// import { SearchParamProps } from "@/types";
// import { auth } from "@clerk/nextjs";
// import Link from "next/link";

// interface IParticipation {
// 	event: IEvent;
// }

// const ProfilePage = async ({ searchParams }: SearchParamProps) => {
// 	const { sessionClaims } = auth();
// 	const userId = sessionClaims?.userId as string;

// 	const participationsPage = Number(searchParams?.participationsPage) || 1;
// 	const eventsPage = Number(searchParams?.eventsPage) || 1;

// 	// Fetch participations instead of orders
// 	const participationsResponse = await getParticipationsByUser({
// 		userId,
// 		page: participationsPage,
// 	});
// 	const participatedEvents =
// 		participationsResponse?.data.map(
// 			(participation: IParticipation) => participation.event
// 		) || [];

// 	// Fetch organized events as before
// 	const organizedEventsResponse = await getEventsByUser({
// 		userId,
// 		page: eventsPage,
// 	});

// 	return (
// 		<>
// 			<section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
// 				<div className="wrapper flex items-center justify-center sm:justify-between">
// 					<h3 className="h3-bold text-center sm:text-left">Upcoming Events</h3>
// 					<Button asChild size="lg" className="button hidden sm:flex">
// 						<Link href="/#events">Explore More Events</Link>
// 					</Button>
// 				</div>
// 			</section>

// 			<section className="wrapper my-8">
// 				<Collection
// 					data={participatedEvents}
// 					emptyTitle="No events participated in yet"
// 					emptyStateSubtext="No worries - plenty of exciting events to explore!"
// 					collectionType="Events_Attendee"
// 					limit={3}
// 					page={participationsPage}
// 					urlParamName="participationsPage"
// 					totalPages={participationsResponse?.totalPages}
// 				/>
// 			</section>

// 			<section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
// 				<div className="wrapper flex items-center justify-center sm:justify-between">
// 					<h3 className="h3-bold text-center sm:text-left">
// 						Events Organising
// 					</h3>
// 					<Button asChild size="lg" className="button hidden sm:flex">
// 						<Link href="/events/create">Create New Event</Link>
// 					</Button>
// 				</div>
// 			</section>

// 			<section className="wrapper my-8">
// 				<Collection
// 					data={organizedEventsResponse?.data}
// 					emptyTitle="No events have been created yet"
// 					emptyStateSubtext="Go create some now"
// 					collectionType="Events_Organizer"
// 					limit={3}
// 					page={eventsPage}
// 					urlParamName="eventsPage"
// 					totalPages={organizedEventsResponse?.totalPages}
// 				/>
// 			</section>
// 		</>
// 	);
// };

// export default ProfilePage;

import React from "react";

const ProfilePage = () => {
	return <div>ProfilePage will be here soon!</div>;
};

export default ProfilePage;
