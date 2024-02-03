import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { HiMenu } from "react-icons/hi";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import NavItems from "./NavItems";

const MobileNav = () => {
	return (
		<nav className="md:hidden">
			<Sheet>
				<SheetTrigger className="align-middle">
					<HiMenu className="w-6 h-6" />
				</SheetTrigger>
				<SheetContent className="flex flex-col gap-6 bg-white md:hidden">
					<Image
						src="/assets/images/plan-b-dark.svg"
						alt="logo"
						width={96}
						height={24}
					/>
					<Separator className="border border-gray-50" />
					<NavItems />
				</SheetContent>
			</Sheet>
		</nav>
	);
};

export default MobileNav;
