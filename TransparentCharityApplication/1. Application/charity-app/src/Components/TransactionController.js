import Button from "./Buttons/Button";
import Transaction from "./Transaction/Transaction";
import styles from './TransactionController.module.css'
import {useEffect} from 'react';



export default function TransactionController(props) {

	// left empty so it runs once during startup
	useEffect(() => {
		props.startup();
	  // eslint-disable-next-line react-hooks/exhaustive-deps
	  }, []);
	
	// show transaction function stored in variable.
	const showTransactions = props.transactions.map(
		function(product) {
			return (
				<Transaction 
				key={product.sender + Math.random()}
				sender={product.sender}
				receiver={product.receiver}
				amount={product.amount}
				time={product.time}
				/>
			)
		}
	)

	return (
		<div className={styles.transactionController}>
			<div className={styles.button_box}>
					<div className={styles.inline}>
						<Button function={props.refresh} buttonTitle={'Refresh All Transactions'}/>
					</div>	
					<div className={[styles.inline, styles.right_box].join(" ")}>
						<Button fetchOverview={props.fetchOverview} function={props.showOverview} buttonTitle={'Transaction Summary'}/>
					</div>			
			</div>

				{showTransactions}
		</div>
	)
}