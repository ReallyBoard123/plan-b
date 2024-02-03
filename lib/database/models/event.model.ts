import { Document, Schema, model, models } from "mongoose";

interface IBoardGameSuggestion extends Document {
	bggId: number; // BoardGameGeek unique ID
	title: string;
	imageUrl: string;
	complexityScore: number;
	rating: number;
	duration: number;
	bggLink: string; // Direct link to the BoardGameGeek page
}

interface IAttendee extends Document {
	userId: string; // Reference to User model
	firstName: string;
	lastName: string;
}

export interface IEvent extends Document {
	_id: string;
	title: string;
	description?: string;
	location?: string;
	createdAt: Date;
	imageUrl: string;
	startDateTime: Date;
	endDateTime: Date;
	boardGamesSuggestions: IBoardGameSuggestion[]; // New field for suggested board games
	attendees: IAttendee[]; // New field for attendees
	attendeeCount: number; // New field for count of attendees
	url?: string;
	category: { _id: string; name: string };
	organizer: { _id: string; firstName: string; lastName: string };
}

const BoardGameSuggestionSchema = new Schema({
	bggId: { type: Number, required: true },
	title: { type: String, required: true },
	imageUrl: { type: String, required: true },
	complexityScore: { type: Number },
	rating: { type: Number },
	duration: { type: Number },
	bggLink: { type: String, required: true },
});

const AttendeeSchema = new Schema({
	userId: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
});

const EventSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String },
	location: { type: String },
	createdAt: { type: Date, default: Date.now },
	imageUrl: { type: String, required: true },
	startDateTime: { type: Date, default: Date.now },
	endDateTime: { type: Date, default: Date.now },
	boardGamesSuggestions: [BoardGameSuggestionSchema],
	attendees: [AttendeeSchema], // Adding attendees to the schema
	attendeeCount: { type: Number, default: 0 }, // Count of attendees
	url: { type: String },
	category: { type: Schema.Types.ObjectId, ref: "Category" },
	organizer: { type: Schema.Types.ObjectId, ref: "User" },
});

const Event = models.Event || model("Event", EventSchema);

export default Event;
