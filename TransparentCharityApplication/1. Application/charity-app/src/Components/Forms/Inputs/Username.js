import { Fragment, useState, useEffect } from 'react';
import styles from '../Form.module.css';

export default function Username (props) {
	// declarations
	const [enteredName, setEnteredValue] = useState('');
	const [touched, setTouched] = useState(false);

	const valid = validateValue(enteredName);
	const nameInputIsInvalid = !valid && touched;

	// changes variables on input change
	function nameInputChangeHandler(event) {
		setEnteredValue(event.target.value);
	}

	// set touched or not for styles check
	function nameInputBlur(){
		setTouched(true);
	}

	// validates input values
	function validateValue(value) {
		return value.trim() !== "";
	}
	
	// updates parent variables 
	useEffect(() => {
		props.validityChecker(valid);
		props.getValue(enteredName);

	}, [enteredName, props, valid])

	// classname declarations
	let labelClassName = styles.label;
	let inputClassName = styles.input;

	// update styles declarations
	if (touched && nameInputIsInvalid) {
		labelClassName = [styles.label, styles.invalidText].join(' ');
		inputClassName = [styles.input, styles.invalid].join(' ');
	}

	// Output JSX
	return (

		<div className={styles["form-control"]}>
			<Fragment>
				<label className={labelClassName} htmlFor="username">Username</label>
				<input className={inputClassName} onBlur={nameInputBlur} value={enteredName} onChange={nameInputChangeHandler} type="text" id="name" />
				{touched && nameInputIsInvalid ? <p className={styles.invalidText}>Username invalid!</p> : ''}
			</Fragment>
		</div>
	);
}