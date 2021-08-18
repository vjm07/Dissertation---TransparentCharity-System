import { Fragment, useState, useEffect } from 'react';
import styles from '../Form.module.css';

export default function Phone (props) {
	// declarations
	const [enteredPhone, setEnteredValue] = useState('');
	const [touched, setTouched] = useState(false);

	const valid = validateValue(enteredPhone);
	const nameInputIsInvalid = !valid && touched;

	// update on input changes 
	function phoneInputChangeHandler(event) {
		const entered = event.target.value;
		props.getValue(entered);
		setEnteredValue(entered);
	}

	// set whether the user has touched input
	function phoneInputBlur(){
		setTouched(true);
	}

	// validates input
	function validateValue(value) {
		
		return value.trim().length === 11 && /^\d+$/.test(value);
	}
	
	// update parent variables
	useEffect(() => {
		props.validityChecker(valid);
	}, [props, valid])

	// styles declarations
	let labelClassName = styles.label;
	let inputClassName = styles.input;

	// update invalid status
	if (touched && nameInputIsInvalid) {
		labelClassName = [styles.label, styles.invalidText].join(' ');
		inputClassName = [styles.input, styles.invalid].join(' ');
	}

	// Output JSX
	return (

		<div className={styles["form-control"]}>
			
			<Fragment>
				<label className={labelClassName} htmlFor="phone">Phone</label>
				<input className={inputClassName} onBlur={phoneInputBlur} value={enteredPhone} onChange={phoneInputChangeHandler} type="text" id="phone" />
				{touched && nameInputIsInvalid ? <p className={styles.invalidText}>Phone is invalid!</p> : ''}
			</Fragment>

		</div>
	);
}