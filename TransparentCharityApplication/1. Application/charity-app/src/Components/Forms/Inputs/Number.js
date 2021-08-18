import { useState, Fragment, useEffect } from 'react';
import styles from '../Form.module.css';

export default function Number (props) {

	// States used
	const [value, setValue] = useState(0);
	const [touched, setTouched] = useState(false);
	const [valueInvalid, setValueInvalid] = useState(true);
	
	// Input controllers
	
	// on specialised on change for second input box
	function changeHandler(event) {

		const entered = event.target.value;

		if (entered < 1) {
			setValueInvalid(true);
		} else {
			setValueInvalid(false);
		}			
		setValue(entered);
	}

	// handles what happens when someone clicks off the second form
	function inputTouchHandler(event) {

		try {
			setValue((parseFloat(event.target.value, 10)).toFixed(2));
		} catch (error) { 
			setValueInvalid(false);
		}
		setTouched(true);
	}

	// handles what happens when area is selected
	function handleFocus(event) {
		event.target.select();
	}

	// validity declaration
	const valid = !valueInvalid;

	// updates parent values when values in this input changes
	useEffect(() => {
		props.validityChecker(valid);
		props.getValue(value);
		}, 
		[props, valid, value]
	);

	// style declarations
	let labelClassName = styles.label;
	let inputClassName = styles.input;

	// update style if invalid
	if (touched && valueInvalid) {
		labelClassName = [styles.label, styles.invalidText].join(' ');
		inputClassName = [styles.input, styles.invalid].join(' ');
	}

	return (

		<div className={styles["form-control"]}>
				
			<Fragment>
				<label className={labelClassName} htmlFor="Amount">Amount to donate [£]</label>
				<input className={inputClassName} onFocus={handleFocus} onBlur={inputTouchHandler} onChange={changeHandler} type={"number"} value={value}/>
				{touched && valueInvalid ? <p className={styles.invalidText} >Minimum amount is £1</p> : ''}
			</Fragment>
				
		</div>
	);
}