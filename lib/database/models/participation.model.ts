// participation.model.ts
import { SearchGameResult } from "@/lib/searchBoardGames";
import { Schema, model, models, Document } from "mongoose";

const boardGameSuggestionSchema = new Schema({
	id: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
});

// Updated IParticipation interface to include guests and boardGames
export interface IParticipation extends Document {
	createdAt: Date;
	confirmed: boolean;
	event: {
		_id: string;
		title: string;
	};
	participant: {
		_id: string;
		firstName: string;
		lastName: string;
	};
	guests?: number;
	boardGames?: [SearchGameResult];
}

// Adjust the ParticipationSchema accordingly
const ParticipationSchema = new Schema({
	createdAt: {
		type: Date,
		default: Date.now,
	},
	confirmed: {
		type: Boolean,
		default: false,
	},
	event: {
		type: Schema.Types.ObjectId,
		ref: "Event",
	},
	participant: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	guests: {
		type: Number,
		default: 0,
	},
	boardGames: [boardGameSuggestionSchema],
});
const Participation =
	models.Participation || model("Participation", ParticipationSchema);

export default Participation;
