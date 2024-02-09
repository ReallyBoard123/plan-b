"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BoardGameCombobox } from "./BoardGameCombobox";
import { participationFormSchema } from "@/lib/validator";
import { updateEventParticipation } from "@/lib/actions/event.actions";
import { SearchGameResult } from "@/lib/searchBoardGames";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";

interface IParticipationFormData {
	guestsFromAttendee: number;
	boardGamesSuggestionsByAttendee: SearchGameResult[];
}

type ParticipationFormProps = {
	eventId: string;
	userId: string;
	router: AppRouterInstance;
};

const ParticipationForm = ({
	eventId,
	userId,
	router,
}: ParticipationFormProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const form = useForm<IParticipationFormData>({
		resolver: zodResolver(participationFormSchema),
		defaultValues: {
			guestsFromAttendee: 0,
			boardGamesSuggestionsByAttendee: [],
		},
	});

	const onSubmit: SubmitHandler<IParticipationFormData> = async (data) => {
		console.log("Form Data on Submit:", data);

		// Simplified payload without mapping if possible
		const updatePayload = {
			$push: {
				attendees: {
					userId: userId,
					guests: data.guestsFromAttendee,
					boardGamesSuggestionsByAttendee:
						data.boardGamesSuggestionsByAttendee || [],
				},
			},
			$inc: {
				attendeeCount: 1,
				guestsFromAttendee: data.guestsFromAttendee,
			},
		};

		console.log("Simplified Update Payload:", updatePayload);

		try {
			await updateEventParticipation({ eventId, updatePayload });
			form.reset();
			setIsOpen(false); // Assuming this closes the dialog
			router.push(`/events/${eventId}`);
		} catch (error) {
			console.error("Failed to submit participation", error);
		}
	};

	const watchedBoardGames = form.watch("boardGamesSuggestionsByAttendee");
	console.log("Watched Board Games:", watchedBoardGames);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className="button">Attend Event</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px] bg-white">
				<DialogHeader>
					<DialogTitle>Confirm Attendance</DialogTitle>
					<DialogDescription>
						Fill in your details to confirm your attendance.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-5"
					>
						<FormField
							control={form.control}
							name="guestsFromAttendee"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormControl>
										<Input
											{...field}
											placeholder="Bringing anyone along?"
											type="number"
											className="input-field"
											onChange={(e) => field.onChange(Number(e.target.value))}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="boardGamesSuggestionsByAttendee"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormControl>
										<BoardGameCombobox
											selectedGames={field.value || []}
											onGameSelect={(games: SearchGameResult[]) =>
												field.onChange(games)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button
								type="submit"
								className="button"
								disabled={form.formState.isSubmitting}
							>
								Confirm
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default ParticipationForm;
