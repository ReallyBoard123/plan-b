"use server";

import { connectToDatabase } from "@/lib/database";
import { Attendee } from "@/lib/database/models/attendee.model";
import { Event, IEvent } from "@/lib/database/models/event.model";
import { handleError } from "@/lib/utils";

export interface BoardGameSuggestion {
	id: string;
	name: string;
}

interface AddAttendeeParams {
	eventId: string;
	userId: string;
	guests: number;
	boardGames: BoardGameSuggestion[];
}

interface UpdateAttendeeParams {
	attendeeId: string;
	guests: number;
	boardGames: BoardGameSuggestion[];
}

// Add an attendee to an event and update board game suggestions
export async function addAttendeeToEvent({
	eventId,
	userId,
	guests,
	boardGames,
}: AddAttendeeParams) {
	try {
		await connectToDatabase();

		// Create a new attendee record
		const newAttendee = await Attendee.create({
			eventId,
			userId,
			guests,
			boardGames,
		});

		await Event.findByIdAndUpdate(eventId, {
			$push: {
				attendees: userId,
				boardGamesSuggestionsByAttendee: { $each: boardGames },
			},
			$inc: { attendeeCount: 1, guestsFromAttendee: guests },
		});

		return JSON.parse(JSON.stringify(newAttendee));
	} catch (error) {
		handleError(error);
		throw new Error("Failed to add attendee to event");
	}
}

export async function fetchAttendeeDetails(eventId: string, userId: string) {
	try {
		await connectToDatabase();

		// Query the database for the attendee document
		const attendeeDetails = await Attendee.findOne({ eventId, userId });

		if (!attendeeDetails) {
			throw new Error("Attendee not found");
		}

		return JSON.parse(JSON.stringify(attendeeDetails));
	} catch (error) {
		handleError(error);
		throw new Error("Failed to fetch attendee details");
	}
}

export async function updateAttendeeDetails({
	attendeeId,
	guests,
	boardGames,
}: UpdateAttendeeParams) {
	try {
		await connectToDatabase();

		const existingAttendee = await Attendee.findById(attendeeId);
		if (!existingAttendee) {
			throw new Error("Attendee not found");
		}

		const event = await Event.findById(existingAttendee.eventId);
		if (!event) {
			throw new Error("Event not found");
		}

		const guestDifference = guests - existingAttendee.guests;

		await Attendee.findByIdAndUpdate(
			attendeeId,
			{
				guests,
				boardGames,
			},
			{ new: true }
		);

		// Remove old board game suggestions from this attendee
		const updatedEvent = await Event.findByIdAndUpdate(
			existingAttendee.eventId,
			{
				$pull: {
					boardGamesSuggestionsByAttendee: {
						$elemMatch: {
							id: {
								$in: existingAttendee.boardGames.map(
									(bg: { id: string }) => bg.id
								),
							},
						},
					},
				},
			},
			{ new: true }
		);

		// Add new board game suggestions if they are not already suggested
		boardGames.forEach(async (boardGame) => {
			if (
				!updatedEvent.boardGamesSuggestionsByAttendee.some(
					(bg: { id: string }) => bg.id === boardGame.id
				)
			) {
				await Event.findByIdAndUpdate(
					existingAttendee.eventId,
					{
						$push: { boardGamesSuggestionsByAttendee: boardGame },
					},
					{ new: true }
				);
			}
		});

		if (guestDifference !== 0) {
			await Event.findByIdAndUpdate(
				existingAttendee.eventId,
				{
					$inc: { guestsFromAttendee: guestDifference },
				},
				{ new: true }
			);
		}

		return { message: "Attendee and event details updated successfully" };
	} catch (error) {
		handleError(error);
		throw new Error("Failed to update attendee details");
	}
}
