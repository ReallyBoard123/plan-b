"use server";

import { revalidatePath } from "next/cache";

import { connectToDatabase } from "@/lib/database";
import { Event } from "@/lib/database/models/event.model";
import User from "@/lib/database/models/user.model";
import Category from "@/lib/database/models/category.model";
import { handleError } from "@/lib/utils";

import {
	CreateEventParams,
	UpdateEventParams,
	DeleteEventParams,
	GetAllEventsParams,
	GetEventsByUserParams,
	GetRelatedEventsByCategoryParams,
} from "@/types";

const getCategoryByName = async (name: string) => {
	return Category.findOne({ name: { $regex: name, $options: "i" } });
};

const populateEvent = (query: any) => {
	return query
		.populate({
			path: "organizer",
			model: User,
			select: "_id firstName lastName",
		})
		.populate({ path: "category", model: Category, select: "_id name" });
};

// CREATE
export async function createEvent({ userId, event, path }: CreateEventParams) {
	try {
		await connectToDatabase();

		const organizer = await User.findById(userId);
		if (!organizer) throw new Error("Organizer not found");

		const newEvent = await Event.create({
			...event,
			category: event.categoryId,
			organizer: userId,
		});
		revalidatePath(path);

		return JSON.parse(JSON.stringify(newEvent));
	} catch (error) {
		handleError(error);
	}
}

// GET ONE EVENT BY ID
export async function getEventById(eventId: string) {
	try {
		await connectToDatabase();

		const event = await populateEvent(Event.findById(eventId));

		if (!event) throw new Error("Event not found");

		return JSON.parse(JSON.stringify(event));
	} catch (error) {
		handleError(error);
	}
}

// UPDATE
export async function updateEvent({ userId, event, path }: UpdateEventParams) {
	try {
		await connectToDatabase();

		const eventToUpdate = await Event.findById(event._id);
		if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
			throw new Error("Unauthorized or event not found");
		}

		const updatedEvent = await Event.findByIdAndUpdate(
			event._id,
			{ ...event, category: event.categoryId },
			{ new: true }
		);
		revalidatePath(path);

		return JSON.parse(JSON.stringify(updatedEvent));
	} catch (error) {
		handleError(error);
	}
}

// DELETE
export async function deleteEvent({ eventId, path }: DeleteEventParams) {
	try {
		await connectToDatabase();

		const deletedEvent = await Event.findByIdAndDelete(eventId);
		if (deletedEvent) revalidatePath(path);
	} catch (error) {
		handleError(error);
	}
}

// GET ALL EVENTS
export async function getAllEvents({
	query,
	limit = 6,
	page,
	category,
	excludeMyEvents = false,
	userId,
}: GetAllEventsParams) {
	try {
		await connectToDatabase();

		const titleCondition = query
			? { title: { $regex: query, $options: "i" } }
			: null;
		const categoryCondition = category
			? await getCategoryByName(category)
			: null;

		let conditions: any[] = [];

		if (titleCondition) conditions.push(titleCondition);
		if (categoryCondition) conditions.push({ category: categoryCondition._id });
		if (excludeMyEvents && userId)
			conditions.push({ organizer: { $ne: userId } });

		const queryConditions = conditions.length > 0 ? { $and: conditions } : {};

		const skipAmount = (Number(page) - 1) * limit;
		const eventsQuery = Event.find(queryConditions)
			.sort({ createdAt: "desc" })
			.skip(skipAmount)
			.limit(limit);

		const events = await populateEvent(eventsQuery);
		const eventsCount = await Event.countDocuments(queryConditions);

		return {
			data: JSON.parse(JSON.stringify(events)),
			totalPages: Math.ceil(eventsCount / limit),
		};
	} catch (error) {
		handleError(error);
	}
}

// GET EVENTS BY ORGANIZER
export async function getEventsByUser({
	userId,
	limit = 6,
	page,
}: GetEventsByUserParams) {
	try {
		await connectToDatabase();

		const conditions = { organizer: userId };
		const skipAmount = (page - 1) * limit;

		const eventsQuery = Event.find(conditions)
			.sort({ createdAt: "desc" })
			.skip(skipAmount)
			.limit(limit);

		const events = await populateEvent(eventsQuery);
		const eventsCount = await Event.countDocuments(conditions);

		return {
			data: JSON.parse(JSON.stringify(events)),
			totalPages: Math.ceil(eventsCount / limit),
		};
	} catch (error) {
		handleError(error);
	}
}

//GET ALL EVENTS THAT ARE NOT BY THE USER

export async function getEventsByNotUser({
	userId,
	limit = 6,
	page,
}: GetEventsByUserParams) {
	try {
		await connectToDatabase();

		const conditions = { organizer: { $ne: userId } };
		const skipAmount = (page - 1) * limit;

		const eventsQuery = Event.find(conditions)
			.sort({ createdAt: "desc" })
			.skip(skipAmount)
			.limit(limit);

		const events = await populateEvent(eventsQuery);
		const eventsCount = await Event.countDocuments(conditions);

		return {
			data: JSON.parse(JSON.stringify(events)),
			totalPages: Math.ceil(eventsCount / limit),
		};
	} catch (error) {
		handleError(error);
	}
}

// GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export async function getRelatedEventsByCategory({
	categoryId,
	eventId,
	limit = 3,
	page = 1,
}: GetRelatedEventsByCategoryParams) {
	try {
		await connectToDatabase();

		const skipAmount = (Number(page) - 1) * limit;
		const conditions = {
			$and: [{ category: categoryId }, { _id: { $ne: eventId } }],
		};

		const eventsQuery = Event.find(conditions)
			.sort({ createdAt: "desc" })
			.skip(skipAmount)
			.limit(limit);

		const events = await populateEvent(eventsQuery);
		const eventsCount = await Event.countDocuments(conditions);

		return {
			data: JSON.parse(JSON.stringify(events)),
			totalPages: Math.ceil(eventsCount / limit),
		};
	} catch (error) {
		handleError(error);
	}
}

// GET EVENTS BY ATTENDEE
export async function getEventsByAttendee({
	userId,
	limit = 6,
	page = 1,
}: {
	userId: string;
	limit?: number;
	page?: number;
}) {
	try {
		await connectToDatabase();

		const skipAmount = (page - 1) * limit;

		const conditions = { attendees: userId };
		const eventsQuery = Event.find(conditions)
			.sort({ createdAt: "desc" })
			.skip(skipAmount)
			.limit(limit);

		const events = await populateEvent(eventsQuery);
		const eventsCount = await Event.countDocuments(conditions);

		return {
			data: JSON.parse(JSON.stringify(events)),
			totalPages: Math.ceil(eventsCount / limit),
		};
	} catch (error) {
		handleError(error);
	}
}
