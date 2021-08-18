import { useState, useEffect } from "react";
import Username from "../../../Forms/Inputs/Username";
import Email from "../../../Forms/Inputs/Email";
import Phone from "../../../Forms/Inputs/Phone";
import styles from "./BeneficiaryForm.module.css";
import styles2 from "../../../Forms/Form.module.css";

export default function BeneficiaryForm(props) {

	// declarations
	const [name, setName] = useState("");
	const [nameValid, setNameValid] = useState(false)

	const [email, setEmail] = useState("");
	const [emailValid, setEmailValid] = useState(false)

	const [phone, setPhone] = useState("")
	const [phoneValid, setPhoneValid] = useState(false)

	const [buttonActive, setButtonActive] = useState(false)
	const [touched, setTouched] = useState(false)

	// update to changes to check if button should be activated
	useEffect(() => {
		if (nameValid && emailValid && phoneValid && touched) {

			setButtonActive(true)
			
		} else {
			setButtonActive(false)
		}

	}, [nameValid, emailValid, phoneValid, touched])

	// update whether or not users have attempted to change any fields
	useEffect(() => {
		if (name === "" && email === "" && phone) {
			setTouched(false)
		} else {
			setTouched(true)
		}

	}, [name, email, phone])

	// get value functions
	function getName(value) {
		setName(value);
	}
	function getEmail(value) {
		setEmail(value);
	}
	function getPhone(value) {
		setPhone(value);
	}

	// form submission
	function formSubmit(event) {
		event.preventDefault();

		if(nameValid && emailValid && phoneValid) {

			const toSubmit = {
				"beneficiary": name,
				"phone": phone,
				"email": email
			};
			props.formButtonFunction(toSubmit);
		}

		return;
	}

	return (
		<div className={styles.surroundingBox}>
			<form>
			<div className={styles2["control-group"]}>
				<Username getValue={getName} validityChecker={setNameValid}/>
				<Email getValue={getEmail} validityChecker={setEmailValid}/>
				<Phone getValue={getPhone} validityChecker={setPhoneValid}/>
			</div>
			<div>
			
				<button className={styles2["form-actions"]} disabled={!buttonActive} onClick={formSubmit}>Submit</button>
			</div>
				
			</form>
		</div>

		
	);
}