import { AlertIcon } from "@primer/octicons-react";
import { ReactNode } from "react";
import MainHero from "./MainHero";

export default function ErrorInfo({
	title,
	children,
	footer,
}: { title: string; children: ReactNode; footer: ReactNode }) {
	return (
		<MainHero padding={10}>
			<div className="mt-5">{title}</div>
			<div role="alert" className="alert alert-error mt-10 mb-10">
				<AlertIcon size="medium" />
				{children}
			</div>
			{footer}
		</MainHero>
	);
}
