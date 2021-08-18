import Card from '../UI/Card';
import styles from './Transaction.module.css';
import useScreenDimensions from '../../Hooks/useScreenDimensions';
import { Fragment } from 'react';

export default function Transaction(props){
	// declarations
	const { width } = useScreenDimensions();

	let receiver = props.receiver;
	let sender = props.sender;
	let amount = '£' + props.amount;
	let time = props.time;

	const highlighted = receiver !== 'Charity' && receiver !== "N/A";

	// JSX
	let toShow = (
		<div className={styles.transactionDetails}>
			<div className={styles.receiver}>
				<p>To:</p>
				<p>{receiver}</p>
			</div>
			<div className={styles.sender}>
				<p>From:</p>
				<p>{sender}</p>
			</div>
			<div>
				<p>DateTime:</p>
				<p>{time}</p>
			</div>
			<div className={styles.amount}>
				<p>{amount}</p>
			</div>
		</div>
	)
	
	// highlight which transactions were moved from the charity
	if (highlighted){
		toShow = (
		<div className={[styles.transactionDetails, styles.highlight].join(" ")}>
			<div className={styles.receiver}>
				<p>To:</p>
				<p>{receiver}</p>
			</div>
			<div className={styles.sender}>
				<p>From:</p>
				<p>{sender}</p>
			</div>
			<div>
				<p>DateTime:</p>
				<p>{time}</p>
			</div>
			<div className={styles.amount}>
				<p>{amount}</p>
			</div>
		</div>
		)
	}


	// Ommits time if the screen is too small to make the screen look better
	if (width <=580){
		toShow = (
			<div className={styles.transactionDetails}>
				<div className={styles.receiver}>
					<p>To:</p>
					<p>{receiver}</p>
				</div>
				<div className={styles.sender}>
					<p>From:</p>
					<p>{sender}</p>
				</div>
				<div className={styles.amount}>
					<p>{amount}</p>
				</div>
			</div>
		)
	}

	return (

		<Fragment>
		{highlighted ? 
		(
			<Card isHighlighted={true}>
				{toShow}
			</Card>
		)
		:
		(
			<Card>
				{toShow}
			</Card>
		)
		}

		</Fragment>

	)
}