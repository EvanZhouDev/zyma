import ErrorInfo from "./ErrorInfo";

export default function CodeNotFound({
	action,
	code,
}: {
	action: string;
	code: string;
}) {
	return (
		<ErrorInfo
			title={`Could not ${action} this group.`}
			footer={
				<div>
					<b>The Attendance Session may have ended.</b>
					<br />
					<br />
					<p className="opacity-50">
						If you are sure it hasn't, please try again, ensuring you entered
						the code correctly.{" "}
						<a href="/attendee" className="underline">
							Return Home
						</a>
					</p>
				</div>
			}
		>
			<span>
				Code <b>{code}</b> not found.
			</span>
		</ErrorInfo>
	);
}
