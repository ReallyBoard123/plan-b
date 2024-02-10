// attendee.model.ts
import mongoose, { Document, Schema, model } from "mongoose";
import { SearchGameResult } from "@/lib/searchBoardGames";

const searchGameResultSchema = new Schema<SearchGameResult>({
	id: { type: String, required: true },
	name: { type: String, required: true },
});

interface IAttendee extends Document {
	userId: string;
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
	boardGames: [searchGameResultSchema],
});

export const Attendee =
	mongoose.models.Attendee || model<IAttendee>("Attendee", attendeeSchema);
