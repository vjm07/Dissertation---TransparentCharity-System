import { useState, useEffect, useCallback } from "react";
import Username from "../../Forms/Inputs/Username";
import Modal from "../../UI/Modal";
import styles from "./RemoveBeneficiaryModal.module.css";


export default function RemoveBeneficiary(props) {

	// declarations
	const [beneficiary, setvalue] = useState("");
	const [valid, setvalid] = useState();

	const [sent, setsent] = useState(false)
	const [message, setmessage] = useState("")

	const [buttonActive, setButtonActive] = useState(false)

	// refresh button active values based on input validity
	useEffect(() => {
		if (valid) {
			setButtonActive(true);
		} else {
			setButtonActive(false);
		}

	}, [valid])

	// function called when button is clicked
	function buttonClick(event) {
		event.preventDefault();
		formSubmit();
		setsent(true)
	}

	// POST this - details of beneficiary
	// eslint-disable-next-line react-hooks/exhaustive-deps
	let toPost = {
		"beneficiary": beneficiary
	}

	// submitForm
	const formSubmit = useCallback(async function() {



	// POST request
	try {
		const message1 = await fetch('http://127.0.0.1:5000/remove_beneficiary',  {
			method: 'POST',
			body: JSON.stringify(toPost),
			headers: {
				'Content-Type': 'application/json'
			}});

		const message2 = await message1.json();
		setmessage(message2["message"]);
		
	} catch (error) {
	}

	props.getBeneficiaries();
	}, 	[toPost, props]);


	// Return JSX 
	return (
		<Modal hideFunction={props.hideFunction}>
		{!sent ? 
			(<form>
				<h3 className={styles.header}>Type the beneficiary you want to remove</h3>
				<h5 className={styles.notice}>Case and whitespace sensitive to prevent accidental removal.</h5>
				<Username getValue={setvalue} validityChecker={setvalid}/>
				<button disabled={!buttonActive} onClick={buttonClick}>Submit</button>
			</form>)		
				:
				<p>{message}</p>
		}

		</Modal>		
	)

}