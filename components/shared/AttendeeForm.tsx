"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BoardGameCombobox } from "./BoardGameCombobox";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogDescription,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { attendeeFormSchema } from "@/lib/validator";
import {
	BoardGameSuggestion,
	addAttendeeToEvent,
	updateAttendeeDetails,
} from "@/lib/actions/attendee.actions";

const attendeeDefaultValues = {
	guests: 0,
	boardGames: [],
};

interface AttendeeFormValues {
	guests: number;
	boardGames: BoardGameSuggestion[];
}

interface AttendeeDetails extends AttendeeFormValues {
	_id: string;
}

const schema = z.object({
	guests: z.number(),
	boardGames: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
		})
	),
});

type AttendeeFormProps = {
	eventId: string;
	userId: string;
	type: "Add" | "Update";
	attendeeDetails?: {
		_id: string;
		guests: number;
		boardGames: Array<{ id: string; name: string }>;
	};
};

const AttendeeForm = ({
	eventId,
	userId,
	type,
	attendeeDetails,
}: AttendeeFormProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			guests: attendeeDetails?.guests ?? 0,
			boardGames: attendeeDetails?.boardGames ?? [],
		},
	});

	const onSubmit = async (values: AttendeeFormValues) => {
		if (type === "Add") {
			const newAttendee = await addAttendeeToEvent({
				eventId,
				userId,
				guests: values.guests,
				boardGames: values.boardGames,
			});
			if (newAttendee) {
				form.reset();
				window.location.reload();
			}
		} else if (type === "Update" && attendeeDetails?._id) {
			const updateAttendee = await updateAttendeeDetails({
				attendeeId: attendeeDetails._id,
				guests: values.guests,
				boardGames: values.boardGames,
			});
			if (updateAttendee) {
				form.reset();
				window.location.reload();
			}
		}

		setIsOpen(false);
	};

	useEffect(() => {
		if (attendeeDetails && type === "Update") {
			form.reset({
				guests: attendeeDetails.guests,
				boardGames: attendeeDetails.boardGames,
			});
		}
	}, [attendeeDetails, form.reset, type]);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className="button">
					{type === "Add" ? "Attend Event" : "Update Attendance"}
				</Button>
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
							name="guests"
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
							name="boardGames"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormControl>
										<BoardGameCombobox
											selectedGames={field.value || []}
											onGameSelect={(games) => field.onChange(games)}
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

export default AttendeeForm;
