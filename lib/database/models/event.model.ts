import mongoose, { Document, Schema, model } from "mongoose";
import { SearchGameResult } from "@/lib/searchBoardGames";

interface IAttendee extends Document {
	userId: string; // Reference to User model
	firstName: string;
	lastName: string;
}

export interface IEvent extends Document {
	title: string;
	description?: string;
	location?: string;
	createdAt: Date;
	imageUrl: string;
	dateTime: Date;
	boardGamesSuggestions: SearchGameResult[];
	attendees: IAttendee[];
	attendeeCount: number;
	category: { _id: string; name: string };
	organizer: { _id: string; firstName: string; lastName: string };
}

const attendeeSchema = new Schema<IAttendee>({
	userId: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
});

const searchGameResultSchema = new Schema<SearchGameResult>({
	id: { type: String, required: true },
	name: { type: String, required: true },
});

const eventSchema = new Schema<IEvent>({
	title: { type: String, required: true },
	description: { type: String },
	location: { type: String },
	createdAt: { type: Date, default: Date.now },
	imageUrl: { type: String, required: true },
	dateTime: { type: Date, default: Date.now },
	boardGamesSuggestions: [searchGameResultSchema],
	attendees: [attendeeSchema],
	attendeeCount: { type: Number, default: 0 },
	category: { type: Schema.Types.ObjectId, ref: "Category" },
	organizer: { type: Schema.Types.ObjectId, ref: "User" },
});

export const Event =
	mongoose.models.Event || model<IEvent>("Event", eventSchema);
