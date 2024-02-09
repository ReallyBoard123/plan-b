import { IEvent } from "@/lib/database/models/event.model";
import { formatDateTime } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import { MdOutlineEdit } from "react-icons/md";
import { TbMeeple } from "react-icons/tb";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { DeleteConfirmation } from "./DeleteConfirmation";

type CardProps = {
	event: IEvent;
	isOrganiser?: boolean;
	isAttendee?: boolean;
};

const Card = ({ event, isOrganiser, isAttendee }: CardProps) => {
	const { sessionClaims } = auth();
	const userId = sessionClaims?.userId as string;

	const isEventCreator = userId === event.organizer._id.toString();

	return (
		<div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
			<Link
				href={`/events/${event._id}`}
				style={{ backgroundImage: `url(${event.imageUrl})` }}
				className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500"
			/>
			{/* IS EVENT CREATOR ... */}

			{isEventCreator && !isAttendee && (
				<div className="absolute right-2 top-2 flex gap-2 p-2 transition-all bg-white rounded-md z-10">
					<Link href={`/events/${event._id}/update`}>
						<MdOutlineEdit className="w-4 h-4" />
					</Link>

					<DeleteConfirmation eventId={event._id} />
				</div>
			)}

			<div className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4">
				<div className="flex gap-2">
					<p className="p-semibold-14 w-min rounded-full bg-grey-500/10 px-4 py-1 text-grey-500 line-clamp-1">
						{event.category.name}
					</p>
					<span className="p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-60">
						{event.attendeeCount + event.guestAttendeesCount}/{event.seats}
					</span>
				</div>

				<p className="p-medium-16 p-medium-18 text-grey-500">
					{formatDateTime(event.dateTime).dateTime}
				</p>

				<Link href={`/events/${event._id}`}>
					<p className="p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black">
						{event.title}
					</p>
				</Link>

				<div className="flex-between w-full">
					<p className="p-medium-14 md:p-medium-16 text-grey-600">
						{event.organizer.firstName} {event.organizer.lastName}
					</p>

					{isAttendee && (
						<Link
							href={`/orders?eventId=${event._id}`}
							className="flex gap-2 items-center"
						>
							<p className="text-primary-500">Event Details</p>
							<TbMeeple className="w-5 h-5" />
						</Link>
					)}
				</div>
			</div>
		</div>
	);
};

export default Card;
