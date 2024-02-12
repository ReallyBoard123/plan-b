// attendee.model.ts
import mongoose, { Document, Schema, model } from "mongoose";
import { SearchGameResult } from "@/lib/searchBoardGames";

const searchGameResultSchema = new Schema<SearchGameResult>({
	id: { type: String, required: true },
	name: { type: String, required: true },
});

interface IAttendee extends Document {
	eventId: string;
	userId: string;
	guests: number;
	boardGames: SearchGameResult[];
}

const attendeeSchema = new Schema<IAttendee>({
	eventId: { type: String, required: true },
	userId: { type: String, required: true },
	guests: { type: Number, default: 0 },
	boardGames: [searchGameResultSchema],
});

export const Attendee =
	mongoose.models.Attendee || model<IAttendee>("Attendee", attendeeSchema);
