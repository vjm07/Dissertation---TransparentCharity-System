import { Fragment, useState, useEffect } from 'react';
import styles from '../Form.module.css';

export default function Email (props) {
	// declarations
	const [enteredEmail, setEnteredEmail] = useState("");
	const [touched, setTouched] = useState(false);

	const valid = validateValue(enteredEmail);
	const emailInputIsInvalid = !valid && touched;

	// handles what happens when input changes
	function nemailInputChangeHandler(event) {
		const entered = event.target.value;
		props.getValue(entered);
		setEnteredEmail(entered);
	}

	// handles what happens when they click off the input area
	function emailInputBlur(){
		setTouched(true);
	}

	// validates email value
	function validateValue(value) {
		if (value.length > 0) {
			return value.includes("@") && !value.includes(" ");
		}
		return false;

	}
	
	// updates parent validity check of this input whenever valdity changes
	useEffect(() => {
		props.validityChecker(valid);
	}, [props, valid])


	// style declarations
	let labelClassName = styles.label;
	let inputClassName = styles.input;

	// changes styles if invalid
	if (touched && emailInputIsInvalid) {
		labelClassName = [styles.label, styles.invalidText].join(' ');
		inputClassName = [styles.input, styles.invalid].join(' ');
	}

	// Output JSX
	return (

		<div className={styles["form-control"]}>
			
			<Fragment>
				<label className={labelClassName} htmlFor="email">Email</label>
				<input className={inputClassName} onBlur={emailInputBlur} value={enteredEmail} onChange={nemailInputChangeHandler} type="text" id="email" />
				{touched && emailInputIsInvalid ? <p className={styles.invalidText}>Email invalid!</p> : ''}
			</Fragment>

		</div>
	);
}