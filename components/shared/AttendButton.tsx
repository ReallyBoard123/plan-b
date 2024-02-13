"use client";

import React, { useState } from "react";
import { IEvent } from "@/lib/database/models/event.model";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import AttendeeForm from "./AttendeeForm";

interface AttendeeDetails {
	_id: string;
	guests: number;
	boardGames: Array<{
		id: string;
		name: string;
	}>;
}

interface AttendButtonProps {
	event: IEvent;
	attendeeDetails?: AttendeeDetails;
	existingBoardGameSuggestions: string[];
	seats: number;
}

const AttendButton = ({
	event,
	attendeeDetails,
	existingBoardGameSuggestions,
	seats,
}: AttendButtonProps) => {
	const { user } = useUser();
	const userId = user?.publicMetadata.userId as string;
	const router = useRouter();

	const hasEventFinished = new Date(event.dateTime) < new Date();

	return (
		<div className="flex items-center gap-3">
			{hasEventFinished ? (
				<p className="p-2 text-red-400">
					Sorry, the event is no longer available.
				</p>
			) : (
				<>
					<SignedOut>
						<Button asChild className="button rounded-full" size="lg">
							<Link href="/sign-in">Attend Event</Link>
						</Button>
					</SignedOut>
					<SignedIn>
						<AttendeeForm
							eventId={event._id}
							userId={userId}
							type={attendeeDetails ? "Update" : "Add"}
							attendeeDetails={attendeeDetails}
							existingBoardGameSuggestions={existingBoardGameSuggestions}
							seats={seats}
						/>
					</SignedIn>
				</>
			)}
		</div>
	);
};

export default AttendButton;
