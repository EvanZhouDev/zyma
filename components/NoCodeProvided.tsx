import { AlertIcon } from "@primer/octicons-react";
import MainHero from "./MainHero";

export default function NoCodeProvided({ action }: { action: string }) {
	return (
		<MainHero padding={10}>
			<div className="mt-5">Could not {action} this group.</div>
			<div role="alert" className="alert alert-error mt-10 mb-10">
				<AlertIcon size="medium" />
				<span>No code provided.</span>
			</div>
			Please try again, ensuring you entered the code correctly.
		</MainHero>
	);
}
