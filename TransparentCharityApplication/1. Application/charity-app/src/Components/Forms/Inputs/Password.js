import { useState, Fragment, useEffect } from 'react';
import styles from '../Form.module.css';

export default function Password (props) {

	// declarations
	const [, setValue] = useState("");
	const [touched, setTouched] = useState(false);
	const [valid, setValid] = useState(false);

	// set if the user has attempted to change the input
	function blurHandler() {
		setTouched(true);
	}

	// update value changes
	function changeHandler(event) {	
		
		const entered = event.target.value;
		props.getValue(entered);
	
		if (entered.length > 5) {
			setValid(true);
		} else {
			setValid(false);
		}
		setValue(entered);
	}

	// update parent variables on change in input states
	useEffect(() => {
		props.validityChecker(valid);
	}, [props, valid])


	// style declarations
	let labelClassName = styles.label;
	let inputClassName = styles.input;

	// update style if invalid
	if (touched && !valid) {
		labelClassName = [styles.label, styles.invalidText].join(' ');
		inputClassName = [styles.input, styles.invalid].join(' ');
	}

	return (
		<div className={styles["form-control"]}>
				<Fragment>
					<label className={labelClassName} htmlFor="Amount">Password</label>
					<input className={inputClassName} onBlur={blurHandler} onChange={changeHandler} type="password" id="password" />
					{touched && !valid ? <p className={styles.invalidText}>Password must be 6 letters or more!</p>: ''}
				</Fragment>
		</div>
	);
}