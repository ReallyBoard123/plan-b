"use server";

import { connectToDatabase } from "@/lib/database";
import { Attendee } from "@/lib/database/models/attendee.model";
import { Event } from "@/lib/database/models/event.model";
import { handleError } from "@/lib/utils";

interface BoardGameSuggestion {
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
			event: eventId,
			userId,
			guests,
			boardGames,
		});

		// Update the Event document to include this new attendee and their board game suggestions
		await Event.findByIdAndUpdate(eventId, {
			$push: {
				attendees: newAttendee._id,
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

// Update an attendee's details
export async function updateAttendeeDetails({
	attendeeId,
	guests,
	boardGames,
}: UpdateAttendeeParams) {
	try {
		await connectToDatabase();

		// Update the attendee record
		const updatedAttendee = await Attendee.findByIdAndUpdate(
			attendeeId,
			{ guests, boardGames },
			{ new: true }
		);

		// Optionally, update the Event document if necessary
		// For example, you might need to adjust the guestsFromAttendee count or update the boardGamesSuggestionsByAttendee list

		return JSON.parse(JSON.stringify(updatedAttendee));
	} catch (error) {
		handleError(error);
		throw new Error("Failed to update attendee details");
	}
}
