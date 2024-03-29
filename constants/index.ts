export const headerLinks = [
	{
		label: "Home",
		route: "/",
	},
	{
		label: "Create Event",
		route: "/events/create",
	},
	{
		label: "My Profile",
		route: "/profile",
	},
];

export const eventDefaultValues = {
	title: "",
	description: "",
	location: "",
	imageUrl: "",
	seats: undefined,
	dateTime: new Date(),
	categoryId: "",
	guestAttendeesCount: 0,
	boardGamesSuggestions: [],
	guestsFromAttendee: 0,
	boardGamesSuggestionsByAttendee: [],
	attendees: [],
};
