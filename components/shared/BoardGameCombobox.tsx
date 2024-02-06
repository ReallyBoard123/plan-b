"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
	SearchGameResult,
	searchBoardGamesByName,
} from "@/lib/searchBoardGames";
import { useEffect, useRef, useState } from "react";

type BoardGameComboboxProps = {
	selectedGames: SearchGameResult[];
	onGameSelect: (selectedGame: SearchGameResult[]) => void; // Adjust according to how you manage state
};

export function BoardGameCombobox({
	selectedGames,
	onGameSelect,
}: BoardGameComboboxProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [open, setOpen] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState<string>("");
	const [availableGames, setAvailableGames] = useState<SearchGameResult[]>([]);

	useEffect(() => {
		if (inputValue.trim()) {
			const delayDebounce = setTimeout(async () => {
				const games = await searchBoardGamesByName(inputValue);
				// Filter to keep only unique games based on 'id'
				const uniqueGames = Array.from(
					new Map(games.map((game) => [game["name"], game])).values()
				).slice(0, 8);
				setAvailableGames(uniqueGames); // Set the unique games
			}, 300); // Delay fetch to make input smoother
			return () => clearTimeout(delayDebounce);
		} else {
			setAvailableGames([]);
		}
	}, [inputValue]);

	const handleUnselect = (game: SearchGameResult) => {
		const updatedGames = selectedGames.filter((g) => g.id !== game.id);
		onGameSelect(updatedGames);
	};

	const handleSelect = (game: SearchGameResult) => {
		if (!selectedGames.some((selectedGame) => selectedGame.id === game.id)) {
			const updatedGames = [...selectedGames, game];
			onGameSelect(updatedGames);
			setInputValue("");
			setOpen(false);
		}
	};

	return (
		<Command
			onKeyDown={(e) => {
				if (e.key === "Escape") inputRef.current?.blur();
			}}
			className="relative overflow-visible bg-transparent w-full"
		>
			<div className="input-field flex items-center">
				<div className="flex flex-wrap gap-1">
					{selectedGames.map((game) => (
						<Badge key={game.id} variant="secondary">
							{game.name}
							<button onClick={() => handleUnselect(game)} className="ml-1">
								<X className="h-3 w-3" />
							</button>
						</Badge>
					))}
					<input
						ref={inputRef}
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onFocus={() => setOpen(true)}
						placeholder="Suggest boardgames"
						className="outline-none bg-transparent  placeholder:text-grey-500 "
					/>
				</div>
			</div>
			{open && (
				<div className="absolute mt-14 z-50 w-full max-h-40 overflow-y-auto no-scrollbar bg-white shadow-lg rounded-md">
					<CommandGroup>
						{availableGames.map((game) => (
							<CommandItem
								className="p-medium-14 py-3 pl-8 hover:text-primary-500 focus:text-primary-500"
								key={game.id}
								onSelect={() => handleSelect(game)}
							>
								{game.name}
							</CommandItem>
						))}
					</CommandGroup>
				</div>
			)}
		</Command>
	);
}
