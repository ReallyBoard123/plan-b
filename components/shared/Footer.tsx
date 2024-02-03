import Link from "next/link";
import Image from "next/image";

const Footer = () => {
	return (
		<footer className="border-t">
			<div className="flex-center wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row">
				<Link href="/">
					<Image
						alt="logo"
						src="/assets/images/plan-b.svg"
						height={32}
						width={96}
					/>
				</Link>
				<p>2024 Plan-b. All Rights Reserved.</p>
			</div>
		</footer>
	);
};

export default Footer;
