import Modal from "../../UI/Modal";
import { Fragment, useCallback, useState } from 'react';
import styles from '../../Donation/DonationModal.module.css';
import BeneficiaryForm from "./BeneficiaryForm.js/BeneficiaryForm";

// Add Beneficiary Model component
export default function AddBeneficiary(props) {

	// declarations
	const [formSubmmited, setFormSubmmited] = useState(false);
	const [message, setMessage] = useState("")



	// function for the form button - posts beneficiary details to API
	const addFormButtonFunction = useCallback(async function(object) {
		props.setLoading(true);

		// POST this - details of beneficiary
		const toPost = {
			"beneficiary": object["beneficiary"],
			"phone": String(object["phone"]),
			"email": object["email"]
		}

		console.log(toPost);

		// POST request
		try {
			const message1 = await fetch('http://127.0.0.1:5000/add_beneficiary',  {
				method: 'POST',
				body: JSON.stringify(toPost),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const message2 = await message1.json();
			setMessage(message2["message"])

		} catch (error) {
			setMessage(error.message)
		}

		props.setLoading(false);
		setFormSubmmited(true);
		props.getBeneficiaries();

		// eslint-disable-next-line react-hooks/exhaustive-deps
		}, 	[]);

	// Form JSX
	const FORM = (
		<Fragment>
			<h2 className={styles.header}>Add Beneficiary</h2>
			<BeneficiaryForm
				formButtonFunction={addFormButtonFunction}
			/>
		</Fragment>
	)

	// Result screen JSX
	const RESULT = (
		<Fragment>
			<h2 className={styles.notificationHeaderSuccess}>{message}</h2>
		</Fragment>
	)

	// return
	return (
		<Modal hideFunction={props.hideFunction}>
			{!formSubmmited? FORM : RESULT}
		</Modal>
	)
}