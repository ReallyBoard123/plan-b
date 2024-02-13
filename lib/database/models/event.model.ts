import mongoose, { Document, Schema, model } from "mongoose";
import { SearchGameResult } from "@/lib/searchBoardGames";

const searchGameResultSchema = new Schema<SearchGameResult>({
	id: { type: String, required: true },
	name: { type: String, required: true },
});

interface IAttendee extends Document {
	userId: string; // Reference to User model
	firstName: string;
	lastName: string;
	guests: number;
	boardGames: SearchGameResult[];
}

const attendeeSchema = new Schema<IAttendee>({
	userId: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	guests: { type: Number, default: 0 },
	boardGames: [searchGameResultSchema, { max: 2 }],
});

const eventSchema = new Schema<IEvent>({
	title: { type: String, required: true },
	description: { type: String },
	location: { type: String },
	createdAt: { type: Date, default: Date.now },
	imageUrl: { type: String, required: true },
	dateTime: { type: Date, default: Date.now },
	boardGamesSuggestions: [searchGameResultSchema],
	attendees: [{ type: Schema.Types.ObjectId, ref: "Attendee" }],
	attendeeCount: { type: Number, default: 0 },
	guestAttendeesCount: { type: Number, default: 0 },
	guestsFromAttendee: { type: Number, default: 0 },
	boardGamesSuggestionsByAttendee: [searchGameResultSchema],
	seats: { type: Number, required: true },
	category: { type: Schema.Types.ObjectId, ref: "Category" },
	organizer: { type: Schema.Types.ObjectId, ref: "User" },
});

export interface IEvent extends Document {
	event: any;
	title: string;
	description?: string;
	location?: string;
	createdAt: Date;
	imageUrl: string;
	dateTime: Date;
	boardGamesSuggestions: SearchGameResult[];
	attendees: IAttendee[];
	attendeeCount: number;
	seats: number;
	guestAttendeesCount: number;
	guestsFromAttendee: number;
	boardGamesSuggestionsByAttendee: SearchGameResult[];
	category: { _id: string; name: string };
	organizer: { _id: string; firstName: string; lastName: string };
}

export const Event =
	mongoose.models.Event || model<IEvent>("Event", eventSchema);
