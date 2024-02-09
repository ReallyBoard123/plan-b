"use server";

import Participation from "../database/models/participation.model";
import {
	CreateParticipationParams,
	GetParticipationsByEventParams,
	GetParticipationsByUserParams,
} from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";

export const createParticipation = async (
	params: CreateParticipationParams
) => {
	try {
		await connectToDatabase();

		const newParticipation = await Participation.create({
			event: params.eventId,
			participant: params.userId,
			confirmed: params.confirmed,
			guests: params.guests,
			boardGames: params.boardGames,
		});

		return JSON.parse(JSON.stringify(newParticipation));
	} catch (error) {
		handleError(error);
	}
};

export async function getParticipationsByEvent(
	params: GetParticipationsByEventParams
) {
	try {
		await connectToDatabase();

		const participations = await Participation.find({ event: params.eventId })
			.populate("participant", "firstName lastName")
			.populate("event", "title")
			.exec();

		return JSON.parse(JSON.stringify(participations));
	} catch (error) {
		handleError(error);
	}
}

export async function getParticipationsByUser(
	params: GetParticipationsByUserParams
) {
	try {
		await connectToDatabase();

		const limit = params.limit || 10;
		const page = params.page || 1;
		const skip = (page - 1) * limit;

		const participations = await Participation.find({
			participant: params.userId,
		})
			.populate("event", "title dateTime")
			.skip(skip)
			.limit(limit)
			.exec();

		const count = await Participation.countDocuments({
			participant: params.userId,
		});

		return {
			data: JSON.parse(JSON.stringify(participations)),
			totalPages: Math.ceil(count / limit),
		};
	} catch (error) {
		handleError(error);
	}
}
