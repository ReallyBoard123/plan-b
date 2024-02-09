import { z } from "zod";

const searchGameResultSchema = z.object({
	id: z.string(),
	name: z.string(),
});

// Define a schema for an attendee
const attendeeSchema = z.object({
	userId: z.string().min(1, "User ID is required"),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	guests: z.number().min(0).max(1, "ask your friends to signup!").optional(),
	boardGames: z
		.array(searchGameResultSchema)
		.max(2, "keep some space to carry snacks?")
		.optional(),
});

export const participationFormSchema = z.object({
	guestsFromAttendee: z.number().optional(),
	boardGames: z.array(searchGameResultSchema).optional(),
});

export const eventFormSchema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters"),
	description: z
		.string()
		.min(3, "Description must be at least 3 characters")
		.max(400, "Description must be less than 400 characters"),
	location: z
		.string()
		.min(3, "Location must be at least 3 characters")
		.max(400, "Location must be less than 400 characters"),
	imageUrl: z.string().url("Must be a valid URL"),
	seats: z
		.number()
		.min(1, "Seats must be at least 1")
		.max(99, "I don't think you have more than 99 seats..."),
	guestAttendeesCount: z
		.number()
		.min(0, "need some friends, huh?")
		.max(4, "Too many friends, why invite others!"),
	guestsFromAttendee: z.number().optional(),
	boardGamesSuggestionsByAttendee: z.array(searchGameResultSchema).optional(),
	dateTime: z.date().min(new Date(), "Date must be in the future"),
	categoryId: z.string(),
	boardGamesSuggestions: z.array(searchGameResultSchema),
	attendees: z.array(attendeeSchema).optional(),
	url: z.string().url().optional(),
});
