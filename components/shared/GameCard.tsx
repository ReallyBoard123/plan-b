"use client";

import { useEffect, useState } from "react";
import { fetchBoardGameDetails } from "@/lib/searchBoardGames";
import { BoardGameSuggestionParams } from "@/types";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { GameCardSkeleton } from "./GameCardSkeleton";

export function GameCard({ gameId }: { gameId: string }) {
	const [game, setGame] = useState<BoardGameSuggestionParams | null>(null);

	useEffect(() => {
		const fetchGame = async () => {
			const gameDetails = await fetchBoardGameDetails(gameId);
			setGame(gameDetails);
		};

		fetchGame();
	}, [gameId]);

	if (!game) {
		return <GameCardSkeleton />;
	}

	return (
		<Card className="flex flex-col md:flex-row p-4 gap-4">
			<div className="self-center">
				<Image src={game.imageUrl} alt={game.title} height={128} width={128} />
			</div>
			<CardContent className="flex-grow">
				<div className="flex items-center gap-2">
					<Badge className="bg-green-500">{game.rating.toFixed(1)}</Badge>
					<h5 className="font-medium">{game.title}</h5>
				</div>
				<Separator className="my-4" />
				<div className="p-regular-16 flex justify-evenly flex-col gap-4 items-center">
					<p>Weight: {game.complexityScore.toFixed(2)} / 5</p>
					<p className="text-primary-500">
						<a href={game.bggLink} target="_blank" rel="noopener noreferrer">
							more details...
						</a>
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
