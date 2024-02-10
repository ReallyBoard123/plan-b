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
import { useState } from "react";
import { attendeeFormSchema } from "@/lib/validator";
import {
	addAttendeeToEvent,
	updateAttendeeDetails,
} from "@/lib/actions/attendee.actions";

const attendeeDefaultValues = {
	guests: 0,
	boardGames: [],
};

type AttendeeFormProps = {
	eventId: string;
	userId: string;
	type: "Add" | "Update";
	attendeeId?: string;
};

const AttendeeForm = ({
	eventId,
	userId,
	type,
	attendeeId,
}: AttendeeFormProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const form = useForm<z.infer<typeof attendeeFormSchema>>({
		resolver: zodResolver(attendeeFormSchema),
		defaultValues: attendeeDefaultValues,
	});

	async function onSubmit(values: z.infer<typeof attendeeFormSchema>) {
		if (type === "Add") {
			try {
				const response = await addAttendeeToEvent({
					eventId,
					userId,
					boardGames: values.boardGames || [],
					...values,
				});
				console.log(response);
				form.reset();
				setIsOpen(false);
			} catch (error) {
				console.error(error);
			}
		} else if (type === "Update" && attendeeId) {
			try {
				const response = await updateAttendeeDetails({
					attendeeId,
					boardGames: values.boardGames || [],
					...values,
				});
				console.log(response); // Handle response
				form.reset();
				setIsOpen(false); // Close dialog on success
			} catch (error) {
				console.error(error);
			}
		}
	}

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
