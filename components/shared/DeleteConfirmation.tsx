"use client";

import { useTransition } from "react";
import { MdOutlineDelete } from "react-icons/md";
import { usePathname } from "next/navigation";
import Image from "next/image";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { deleteEvent } from "@/lib/actions/event.actions";

export const DeleteConfirmation = ({ eventId }: { eventId: string }) => {
	const pathname = usePathname();
	let [isPending, startTransition] = useTransition();

	return (
		<AlertDialog>
			<AlertDialogTrigger>
				<MdOutlineDelete className="w-4 h-4 text-red-500" />
			</AlertDialogTrigger>

			<AlertDialogContent className="bg-white">
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
					<AlertDialogDescription className="p-regular-16 text-grey-600">
						This will permanently delete this event
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>

					<AlertDialogAction
						onClick={() =>
							startTransition(async () => {
								await deleteEvent({ eventId, path: pathname });
							})
						}
					>
						{isPending ? "Deleting..." : "Delete"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
