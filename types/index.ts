import { SearchGameResult } from "@/lib/searchBoardGames";

// ====== USER PARAMS
export type CreateUserParams = {
	clerkId: string;
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	photo: string;
};

export type UpdateUserParams = {
	firstName: string;
	lastName: string;
	username: string;
	photo: string;
};

// ====== BOARD GAME SUGGESTION PARAMS
export type BoardGameSuggestionParams = {
	id: number;
	title: string;
	imageUrl: string;
	complexityScore: number;
	rating: number;
	duration: number;
	bggLink: string;
};

// Common type for user reference, reusable in different contexts
export type UserRef = {
	userId: string;
	firstName?: string; // Optional for updates or when not needed
	lastName?: string; // Optional for updates or when not needed
};

// ====== EVENT PARAMS
export type CreateEventParams = {
	userId: string; // Organizer's user ID
	event: {
		title: string;
		description: string;
		location: string;
		imageUrl: string;
		dateTime: Date;
		categoryId: string;
		seats: number;
		boardGamesSuggestions: SearchGameResult[];
		attendees?: UserRef[]; // Optional at creation, might not have attendees yet
	};
	path: string;
};

export type UpdateEventParams = {
	userId: string; // Organizer's user ID
	event: {
		_id: string;
		title?: string; // Optional for updates
		imageUrl?: string; // Optional for updates
		description?: string; // Optional for updates
		location?: string; // Optional for updates
		dateTime?: Date; // Optional for updates
		seats?: number; // Optional for updates
		categoryId?: string; // Optional for updates
		boardGamesSuggestions?: SearchGameResult[]; // Optional for updates
		attendees?: UserRef[]; // For adding or updating attendees
		url?: string; // Optional for updates
	};
	path: string;
};

export type DeleteEventParams = {
	eventId: string;
	path: string;
};

export type GetAllEventsParams = {
	query: string;
	category: string;
	limit: number;
	page: number;
};

export type GetEventsByUserParams = {
	userId: string;
	limit?: number;
	page: number;
};

export type GetRelatedEventsByCategoryParams = {
	categoryId: string;
	eventId: string;
	limit?: number;
	page: number | string;
};

// ====== CATEGORY PARAMS
export type CreateCategoryParams = {
	categoryName: string;
};

// ====== URL QUERY PARAMS
export type UrlQueryParams = {
	params: string;
	key: string;
	value: string | null;
};

export type RemoveUrlQueryParams = {
	params: string;
	keysToRemove: string[];
};

export type SearchParamProps = {
	params: { id: string };
	searchParams: { [key: string]: string | string[] | undefined };
};
