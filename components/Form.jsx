"use client";

import { Formik } from "formik";
import React from "react";

const Form = ({ initialValues, validate, onSubmit, children }) => (
	<Formik
		initialValues={initialValues}
		validate={validate}
		onSubmit={(values, { setSubmitting }) => {
			onSubmit(values);
			setSubmitting(false);
		}}
	>
		{({
			values,
			errors,
			touched,
			handleChange,
			handleBlur,
			handleSubmit,
			isSubmitting,
		}) => (
			<form onSubmit={handleSubmit}>
				{React.Children.map(children, (child) => {
					return (
						<div>
							{React.cloneElement(child, {
								handleChange,
								handleBlur,
								value: values[child.props.formid],
							})}

							{errors[child.props.formid] &&
								touched[child.props.formid] &&
								errors[child.props.formid]}
						</div>
					);
				})}
				<button
					className="btn btn-primary"
					disabled={isSubmitting}
					type="submit"
				>
					Submit
				</button>
			</form>
		)}
	</Formik>
);

Form.PasswordInput = function PasswordInput({
	title = "Password",
	placeholder = "Enter password...",
	formid,
	handleChange,
	value,
}) {
	return (
		<div>
			<label className="label">
				<span className="text-base label-text">{title}</span>
			</label>
			<input
				type="password"
				value={value}
				onChange={handleChange}
				placeholder={placeholder}
				name={formid}
				className="w-full input input-bordered border-primary form-input"
			/>
			{/* {errors.email && touched.email && errors.email} */}
		</div>
	);
};

Form.TextInput = function TextInput({
	title = "Text",
	placeholder = "Enter text...",
	formid,
	handleChange,
	handleBlur,
	value,
}) {
	return (
		<div>
			<label className="label">
				<span className="text-base label-text">{title}</span>
			</label>
			<input
				type="text"
				value={value}
				onChange={handleChange}
				onBlur={handleBlur}
				name={formid}
				placeholder={placeholder}
				className="w-full input input-bordered border-primary form-input"
			/>
		</div>
	);
};

export default Form;
