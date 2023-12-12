"use client";
import Form from "./Form";

export default function TestForm() {
	return (
		<Form
			initialValues={{ email: "", password: "" }}
			validate={(values) => {
				const errors = {};
				if (!values.email) {
					errors.email = "Required";
				} else if (
					!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
				) {
					errors.email = "Invalid email address";
				}
				return errors;
			}}
			onSubmit={(values) => {
				alert(JSON.stringify(values, null, 2));
			}}
		>
			<Form.TextInput formid="email" />
			<Form.PasswordInput formid="password" />
		</Form>
	);
}
