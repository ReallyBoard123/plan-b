"use client";

import React, { useState } from "react";
import { IEvent } from "@/lib/database/models/event.model";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

import ParticipationForm from "./ParticipationForm";

const AttendButton = ({ event }: { event: IEvent }) => {
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
						<ParticipationForm
							eventId={event._id}
							userId={userId}
							router={router}
						/>
					</SignedIn>
				</>
			)}
		</div>
	);
};

export default AttendButton;
