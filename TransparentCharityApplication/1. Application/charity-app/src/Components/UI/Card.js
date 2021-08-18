import { Fragment } from 'react';
import styles from './Card.module.css';


export default function Card(props){

	// declarations
	let highlight = styles.card;
	let isSmall = "";

	// alter above states
	if (props.isHighlighted) {
		highlight = styles.card_highlight;
	}

	if(props.isSmall) {
		isSmall = styles.small;
	}

	// classname based on states
	let addedClassName = [highlight, isSmall].join(" ");

	return (
		<Fragment>
			{
				<div className={addedClassName}>
					{props.children}
				</div>	
			}
		</Fragment>

	)
}
