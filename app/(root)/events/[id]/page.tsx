import {
	getEventById,
	getRelatedEventsByCategory,
} from "@/lib/actions/event.actions";
import { fetchAttendeeDetails } from "@/lib/actions/attendee.actions";
import { HiOutlineCalendar } from "react-icons/hi";
import { GoPeople } from "react-icons/go";
import { LuMapPin } from "react-icons/lu";
import { formatDateTime } from "@/lib/utils";
import { SearchParamProps } from "@/types";
import Image from "next/image";
import { GameCard } from "@/components/shared/GameCard";
import Collection from "@/components/shared/Collection";
import AttendButton from "@/components/shared/AttendButton";
import { auth } from "@clerk/nextjs";

const EventDetails = async ({
	params: { id },
	searchParams,
}: SearchParamProps) => {
	const { sessionClaims } = auth();

	const userId = sessionClaims?.userId as string;

	const event = await getEventById(id);

	const totalSeats = event.seats;

	const boardGameIds = event.boardGamesSuggestions.map(
		(suggestion: { id: string }) => suggestion.id
	);

	const existingBoardGameSuggestions =
		event.boardGamesSuggestionsByAttendee.map(
			(suggestion: { id: string }) => suggestion.id
		);

	const currentAttendeesCount =
		event.attendeeCount + event.guestAttendeesCount + event.guestsFromAttendee;

	const relatedEvents = await getRelatedEventsByCategory({
		categoryId: event.category._id,
		eventId: event._id,
		page: searchParams.page as string,
	});

	const page = Number(searchParams.page) >= 1 ? Number(searchParams.page) : 1;

	const isOrganizer = event.organizer._id === userId;

	const isAttending = event.attendees.includes(userId);

	let attendeeDetails = null;

	if (isAttending) {
		attendeeDetails = await fetchAttendeeDetails(event._id, userId);
	}

	return (
		<>
			<section className="flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
				<div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
					<Image
						src={event.imageUrl}
						alt="hero image"
						width={1000}
						height={1000}
						className="h-full min-h-[300px] object-cover object-center"
					/>

					<div className="flex w-full flex-col gap-8 p-5 md:p-10">
						<div className="flex flex-col gap-6">
							<h2 className="h2-bold">{event.title}</h2>

							<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
								<p className="p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 text-grey-500 text-center">
									{event.category.name}
								</p>

								<p className="p-medium-18 ml-2 mt-2 sm:mt-0">
									by{" "}
									<span className="text-primary-500">
										{event.organizer.firstName} {event.organizer.lastName}
									</span>
								</p>
							</div>
						</div>

						<div className="flex flex-col gap-5">
							<div className="p-regular-20 flex items-center gap-3">
								<GoPeople className="w-6 h-6" />
								<p className="p-medium-16 lg:p-regular-20">
									{currentAttendeesCount} /{event.seats}
								</p>

								{isOrganizer ? null : (
									<AttendButton
										event={event}
										attendeeDetails={attendeeDetails}
										existingBoardGameSuggestions={existingBoardGameSuggestions}
										seats={totalSeats}
									/>
								)}
							</div>
							<div className="flex gap-2 md:gap-3">
								<HiOutlineCalendar className="w-6 h-6" />
								<div className="p-medium-16 lg:p-regular-20 flex flex-wrap items-center">
									<p>
										{formatDateTime(event.dateTime).dateOnly} -{" "}
										{formatDateTime(event.dateTime).timeOnly}
									</p>
								</div>
							</div>

							<div className="p-regular-20 flex items-center gap-3">
								<LuMapPin className="w-6 h-6" />
								<p className="p-medium-16 lg:p-regular-20">{event.location}</p>
							</div>
						</div>

						<div className="flex flex-col gap-2">
							<p className="p-bold-20 text-grey-600">
								What are we going to do:
							</p>
							<p className="p-medium-16 lg:p-regular-18">{event.description}</p>
							<p className="p-medium-16 lg:p-regular-18 truncate text-primary-500 underline">
								{event.url}
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="wrapper my-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{boardGameIds.map((gameId: string) => (
						<GameCard key={gameId} gameId={gameId} />
					))}
				</div>
			</section>
			{/* EVENTS with the same category */}
			<section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
				<h2 className="h2-bold">Related Events</h2>

				<Collection
					data={relatedEvents?.data}
					emptyTitle="No Events Found"
					emptyStateSubtext="Come back later"
					collectionType="All_Events"
					limit={3}
					page={page.toString()}
					totalPages={relatedEvents?.totalPages}
				/>
			</section>
		</>
	);
};

export default EventDetails;
