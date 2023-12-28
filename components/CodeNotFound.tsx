import ErrorInfo from "./ErrorInfo";

export default function CodeNotFound({
	action,
	code,
}: { action: string; code: string }) {
	return (
		<ErrorInfo
			title={`Could not ${action} this group.`}
			footer="Please try again, ensuring you entered the code correctly."
		>
			<span>
				Code <b>{code}</b> not found.
			</span>
		</ErrorInfo>
	);
}
