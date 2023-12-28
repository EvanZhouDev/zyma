import ErrorInfo from "./ErrorInfo";

export default function NoCodeProvided({ action }: { action: string }) {
	return (
		<ErrorInfo
			title={`Could not ${action} this group.`}
			footer="Please try again, ensuring you entered the code correctly."
		>
			<span>No code provided.</span>
		</ErrorInfo>
	);
}
