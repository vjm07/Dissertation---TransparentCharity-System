import Beneficiary from "./Beneficiary";
import styles from "./BeneficiariesController.module.css";
import {Fragment, useState} from "react";
import DonationModal from "../Donation/CharityDonationModal";


export default function BeneficiariesController(props) {

	// declarations
	const [showAmount, setshowAmount] = useState(false)
	const [name, setName] = useState("")
	const beneficiaries =  props.beneficiaries;

	// function called when donation is made
	function donateFunction(value) {
		setName(value);
		setshowAmount(true);
	}

	// posting the donations
	async function finaliseDonation(value) {
		const toPost = {
			"beneficiary": name,
			"amount": Number(value)
		}

		try {
			await fetch('http://127.0.0.1:5001/move_to_beneficiary',  {
			method: 'POST',
			body: JSON.stringify(toPost),
			headers: {
				'Content-Type': 'application/json'
				}
			})
			// refresh transactions
			props.refreshTransactions();
		} catch (error) {
		}
	}

	// hodes the overlay
	function hideAmountOverlay() {
		setshowAmount(false);
	}

	// displayed beneficiaries
	const showBeneficiaries = beneficiaries.map(
		function(beneficiary) {
			return (
				<Fragment>
					<Beneficiary 
					key={beneficiary.name}		
					name={beneficiary.name}
					number={beneficiary.phone}
					email={beneficiary.email}
					clickFunction={donateFunction}
					function={"DONATE"}
					/>
					{showAmount ? <DonationModal key={Math.random} hideFunction={hideAmountOverlay} finaliseDonation={finaliseDonation}/> : ''}
				</Fragment>
			)
		}
	)

	return (
		<div className={styles.beneficiary_box}>
			{showBeneficiaries}
		</div>
	)
}