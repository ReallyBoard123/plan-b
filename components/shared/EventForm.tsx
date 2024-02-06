"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { HiOutlineMapPin } from "react-icons/hi2";
import { HiOutlineCalendar } from "react-icons/hi";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { eventFormSchema } from "@/lib/validator";
import * as z from "zod";
import { eventDefaultValues } from "@/constants";
import Dropdown from "./Dropdown";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "./FileUploader";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { useUploadThing } from "@/lib/uploadthing";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import { createEvent, updateEvent } from "@/lib/actions/event.actions";

import { BoardGameCombobox } from "./BoardGameCombobox";
import { IEvent } from "@/lib/database/models/event.model";

type EventFormProps = {
	userId: string;
	type: "Create" | "Update";
	event?: IEvent;
	eventId?: string;
};

const EventForm = ({ userId, type, event, eventId }: EventFormProps) => {
	const [files, setFiles] = useState<File[]>([]);
	const initialValues =
		event && type === "Update"
			? {
					...event,
					dateTime: new Date(event.dateTime),
					boardGamesSuggestions: event.boardGamesSuggestions || [],
			  }
			: {
					...eventDefaultValues,
					boardGamesSuggestions: [],
			  };
	const router = useRouter();

	const { startUpload } = useUploadThing("imageUploader");

	const form = useForm<z.infer<typeof eventFormSchema>>({
		resolver: zodResolver(eventFormSchema),
		defaultValues: initialValues,
	});

	async function onSubmit(values: z.infer<typeof eventFormSchema>) {
		let uploadedImageUrl = values.imageUrl;

		if (files.length > 0) {
			const uploadedImages = await startUpload(files);

			if (!uploadedImages) {
				return;
			}

			uploadedImageUrl = uploadedImages[0].url;
		}

		if (type === "Create") {
			try {
				const newEvent = await createEvent({
					event: { ...values, imageUrl: uploadedImageUrl },
					userId,
					path: "/profile",
				});

				if (newEvent) {
					form.reset();
					router.push(`/events/${newEvent._id}`);
				}
			} catch (error) {
				console.log(error);
			}
		}

		if (type === "Update") {
			if (!eventId) {
				router.back();
				return;
			}

			try {
				const updatedEvent = await updateEvent({
					userId,
					event: { ...values, imageUrl: uploadedImageUrl, _id: eventId },
					path: `/events/${eventId}`,
				});

				if (updatedEvent) {
					form.reset();
					router.push(`/events/${updatedEvent._id}`);
				}
			} catch (error) {
				console.log(error);
			}
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-5"
			>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem className="w-full">
							<FormControl>
								<Input
									placeholder="Event title"
									{...field}
									className="input-field"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="boardGamesSuggestions"
					render={({ field }) => (
						<FormItem className="w-full">
							<FormControl>
								<BoardGameCombobox
									onGameSelect={(games) => field.onChange(games)}
									selectedGames={field.value || []}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex flex-col gap-5 md:flex-row">
					<FormField
						control={form.control}
						name="seats"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<Input
										placeholder="Max seats"
										{...field}
										className="input-field"
										type="number"
										onChange={(e) => field.onChange(Number(e.target.value))}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="categoryId"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<Dropdown
										onChangeHandler={field.onChange}
										value={field.value}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex flex-col gap-5 md:flex-row">
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl className="h-72">
									<Textarea
										placeholder="Description"
										{...field}
										className="textarea rounded-2xl"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="imageUrl"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl className="h-72">
									<FileUploader
										onFieldChange={field.onChange}
										imageUrl={field.value}
										setFiles={setFiles}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex flex-col gap-5 md:flex-row">
					<FormField
						control={form.control}
						name="location"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
										<HiOutlineMapPin className="w-6 h-6" />
										<Input
											placeholder="Event location"
											{...field}
											className="input-field"
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="dateTime"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
										<HiOutlineCalendar className="w-6 h-6" />
										<p className="ml-3 whitespace-nowrap text-grey-600">
											Date:
										</p>
										<DatePicker
											selected={field.value}
											onChange={(date: Date) => field.onChange(date)}
											showTimeSelect
											timeInputLabel="Time:"
											dateFormat="MM/dd/yyyy h:mm aa"
											wrapperClassName="datePicker"
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<Button
					type="submit"
					size="lg"
					disabled={form.formState.isSubmitting}
					className="button col-span-2 w-full"
				>
					{form.formState.isSubmitting ? "Submitting..." : `${type} Event `}
				</Button>
			</form>
		</Form>
	);
};

export default EventForm;
