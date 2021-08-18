import Modal from '../UI/Modal';
import styles from './TransactionOverview.module.css';



export default function TransactionOverview(props) {

	// variables
	const percentage = ((props.overviewData['total_given'] / props.overviewData['total']) * 100).toFixed(2);
	const total_kept = (props.overviewData['total'] - props.overviewData['total_given']).toFixed(2)

	// JSX
	return (
		<Modal hideFunction={props.hideOverview}>
			<div className={styles.overview_backgrop}>
				<h3>Total Donated To Charity</h3>
				<p>£{props.overviewData['total']}</p>
				<h3>Total Given to Beneficiaries</h3>
				<p>£{props.overviewData['total_given']}</p>
				<h3>Total Kept by Charity</h3>
				<p>£{total_kept}</p>
				<h3>Percentage of Donations Given</h3>
				<p>{percentage}%</p>
			</div>
		</Modal>
	)

}
