import Modal from "../UI/Modal";
import Form from '../Forms/Form';
import { Fragment, useCallback, useState } from 'react';
import styles from './DonationModal.module.css';

// Donation Model component
export default function DonationModal(props) {

	// useState declarations
	const [success, setSuccess] = useState()
	const [paid, setPaid] = useState(false)

	// donation form function
	const formButtonFunction = useCallback(async function(donation) {
		props.setLoading(true);
		props.setError(null);

		const toPost = {
			'sender': donation['value1'],
			'amount': donation['value2']
		}

	// Insert Confirmation model here - this is just a mock payment API to illustrate the application
			let paymentSuccess = false;
		try {
			const payment = await fetch('http://127.0.0.1:5000/palpay');
			const json = await payment.json();
			if (payment.ok) {
				paymentSuccess = json["success"];
			}

		} 
		catch (error) {
			return props.setError(error.message)
		}

	// if payment successful then add to blockchain!
	if (paymentSuccess === true)
		{		
			try {
			await fetch('http://127.0.0.1:5001/donate',  {
			method: 'POST',
			body: JSON.stringify(toPost),
			headers: {
				'Content-Type': 'application/json'
				}
			});
	

			setSuccess(true);

		} catch (error) {
			props.setError(error.message);
			setSuccess(false);
		}}

		props.setLoading(false);
		
		// refresh transactions now that a donation has been made
		props.fetchAllTransactions();

		setPaid(true)
		
		// eslint-disable-next-line react-hooks/exhaustive-deps
		}, 	[]);

	// JSX variables
		const FORM = (
			<Fragment>
				<h2 className={styles.header}>Donation</h2>
				<h5 className={styles.notice}>You can use the username entered here to identify which is your donation!</h5>
				<Form
					setLoading={props.setLoading}
					secondaryInputType={'number'}	
					formButtonFunction={formButtonFunction}
				/>
			</Fragment>
		)

		const SUCCESS = (
			<Fragment>
				<h2 className={styles.notificationHeaderSuccess}>Payment Successful</h2>
			</Fragment>
		)
		const FAILURE = (
			<Fragment>
				<h2 className={styles.notificationHeaderFail}>Payment Failed!</h2>
			</Fragment>
		)

	return (
		<Modal hideFunction={props.hideDonate}>
			{!paid? FORM : ''}
			{paid && success ? SUCCESS : ''}
			{paid && !success ? FAILURE : ''}
		</Modal>
	)
}