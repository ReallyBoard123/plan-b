"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

const NotMyEventsCheckbox = () => {
	const [checked, setChecked] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();

	const toggleCheckbox = () => {
		setChecked(!checked);
		updateEventsFilter(!checked);
	};

	const updateEventsFilter = (excludeMyEvents: boolean) => {
		let newUrl = "";

		if (excludeMyEvents) {
			newUrl = formUrlQuery({
				params: searchParams.toString(),
				key: "excludeMyEvents",
				value: "true",
			});
		} else {
			newUrl = removeKeysFromQuery({
				params: searchParams.toString(),
				keysToRemove: ["excludeMyEvents"],
			});
		}

		router.push(newUrl, { scroll: false });
	};

	return (
		<div className="flex flex-row items-center gap-2 w-full max-w-40">
			<Checkbox
				id="notMyEvents"
				checked={checked}
				onCheckedChange={toggleCheckbox}
			/>
			<label htmlFor="notMyEvents" className="text-sm leading-none">
				Exclude my events
			</label>
		</div>
	);
};

export default NotMyEventsCheckbox;
