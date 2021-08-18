import React, {useState, Fragment} from "react"
import styles from './Beneficiary.module.css';
import Card from "../UI/Card";

export default function Beneficiary(props) {

	// declarations
	const [displayNotification, setDisplayNotification] = useState(false)

	// copy email to clipboard
	function copy(event) {
		navigator.clipboard.writeText(props.email);
		showNotification();
	}

	// shows notification that email has been copied when clicked. Dissapears after 1.5 seconds
	function showNotification() {

		setDisplayNotification(true);

		const timeId = setTimeout(() => {
		setDisplayNotification(false)
		}, 1500)
		
		return () => {
			clearTimeout(timeId)
		}
	}

	// calls parent function when form is clicked
	function clickFunction() {
		props.clickFunction(props.name)
	}
	
	return (
		<Card key={props.name + "Card"}>
			<div className={styles.Beneficiary} >
				<Fragment>
					<div className={styles.header_bar}>
						<h3 className={styles.beneficiary_header} onClick={clickFunction}>{props.name} </h3>
					</div>

					{ !displayNotification ? <div onClick={copy} className={styles.email}><p>{props.email}</p></div> : ''}
					{displayNotification? <div className={styles.notification}><p>Email Copied to clipboard!</p></div> : ''}
					<div className={styles.number}>{props.number}</div>
				</Fragment>
			</div>
		</Card>
	)
}
