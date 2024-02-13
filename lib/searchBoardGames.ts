import Fuse from "fuse.js";
import axios from "axios";
import xml2js from "xml2js";
import { BoardGameSuggestionParams } from "@/types";

export interface SearchGameResult {
	id: string;
	name: string;
}

// Helper function to parse XML to JSON
const parseXmlToJson = async (xml: string) => {
	try {
		return await xml2js.parseStringPromise(xml, {
			explicitArray: false,
			mergeAttrs: true,
		});
	} catch (error) {
		console.error("Error parsing XML to JSON:", error);
		throw new Error("Failed to parse XML response.");
	}
};

export const searchBoardGamesByName = async (
	query: string
): Promise<SearchGameResult[]> => {
	if (!query.trim()) return []; // Early return if query is empty or whitespace
	const url = `https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(
		query
	)}&type=boardgame,boardgameexpansion&exact=0`;

	try {
		const response = await axios.get(url);
		const result = await parseXmlToJson(response.data);
		const items = result.items.item ?? [];
		let games = Array.isArray(items) ? items : [items];
		games = games.map((game) => ({
			id: game.id,
			name: game.name?.value ?? "Unnamed Game",
		}));

		// Initialize Fuse.js
		const options = {
			includeScore: true,
			isCaseSensitive: false,
			findAllMatches: true,
			threshold: 0.2, // Lower threshold to make search stricter
			location: 0,
			distance: 100,
			tokenize: true,
			matchAllTokens: true,
			tokenSeparator: /[\s:]+/, // Split on whitespace and colons
			keys: ["name"],
			minMatchCharLength: 1, //lower this for partial matches
		};

		// Use Fuse to search with the preprocessed query
		const fuse = new Fuse(games, options);
		const searchResults = fuse.search(query).map((fuseResult) => ({
			id: fuseResult.item.id,
			name: fuseResult.item.name,
		}));

		return searchResults;
	} catch (error) {
		console.error("Error searching board games:", error);
		return [];
	}
};

export const fetchBoardGameDetails = async (
	gameId: string
): Promise<BoardGameSuggestionParams | null> => {
	const url = `https://boardgamegeek.com/xmlapi2/thing?id=${gameId}&stats=1`;

	try {
		const response = await axios.get(url);
		const result = await parseXmlToJson(response.data);
		const game = result.items.item;
		if (!game) return null;

		const description = game.description
			? game.description[0].value
			: "No description available.";

		const yearPublished = game.yearpublished?.value
			? parseInt(game.yearpublished.value)
			: null;
		const minPlayers = game.minplayers?.value
			? parseInt(game.minplayers.value)
			: null;
		const maxPlayers = game.maxplayers?.value
			? parseInt(game.maxplayers.value)
			: null;
		const playTime = game.playingtime?.value
			? parseInt(game.playingtime.value)
			: null;

		return {
			id: parseInt(game.id),
			title: game.name?.[0]?.value ?? "Unknown",
			imageUrl: game.thumbnail ?? "",
			complexityScore: parseFloat(
				game.statistics?.ratings?.averageweight?.value ?? "0"
			),
			rating: parseFloat(game.statistics?.ratings?.average?.value ?? "0"),
			duration: playTime,
			minPlayers: minPlayers,
			maxPlayers: maxPlayers,
			yearPublished: yearPublished,
			description: description,
			bggLink: `https://boardgamegeek.com/boardgame/${gameId}`,
		};
	} catch (error) {
		console.error("Error fetching board game details:", error);
		return null;
	}
};
