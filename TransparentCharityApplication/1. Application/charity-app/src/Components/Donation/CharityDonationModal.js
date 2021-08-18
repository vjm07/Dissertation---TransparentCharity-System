import Modal from "../UI/Modal";
import { useState, useEffect, Fragment } from 'react';
import styles from './DonationModal.module.css';
import Number from "../Forms/Inputs/Number";

// Donation Model component
export default function DonationModal(props) {

	// useState declarations
	const [amount, setamount] = useState(0.00)
	const [valid, setvalid] = useState()
	
	const [buttonActive, setbuttonActive] = useState(false)

	// function to run whenever "valid" variable changes
	useEffect(() => {
		if (valid) {
			setbuttonActive(true);
		} else {
			setbuttonActive(false);
		}
	}, [valid])

	// form submission function
	function submitForm(event) {
		event.preventDefault();
		props.finaliseDonation(amount);
		props.hideFunction();
	}

	// JSX variable
	const FORM = (
		<Modal key={Math.random} hideFunction={props.hideFunction}>
			<form>
				<h2 className={styles.header}>Donation</h2>

				<p className={styles.notice}>Enter the amount to give.</p>

				<Number key={Math.random} getValue={setamount} validityChecker={setvalid}/>

				<div className={styles["form-actions"]}>
					<button disabled={!buttonActive} onClick={submitForm}>
						Submit
					</button>
				</div>
			</form>
		</Modal>	
	)

	return (
		<Fragment>
			{FORM}
		</Fragment>
	)
}