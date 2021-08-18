import styles from './Header.module.css';
import {Fragment, useState, useEffect} from 'react'
import Button from './Buttons/Button';



function Header(props){

	// declarations
	const [isCharity, setIsCharity] = useState();

	// set parent variables
	useEffect(() => {
		setIsCharity(props.isCharity)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props])

	// messages to display
	let welcome_message = "Donor Home Page";

	if (props.isCharity === true) {
		welcome_message = "Charity Home Page";
	}

	return (
		<Fragment>
			<header className={styles.header}>
				<h1 className={styles.titleStyle}>{welcome_message}</h1>
				<div className={styles.buttonArea}>
				{
					isCharity ? 
					(<Button className={styles.headerbutton} function={props.logout} buttonTitle={"Logout"}/>)
				: 
					(<Button className={styles.headerbutton} function={props.showLogin} buttonTitle={"Charity Login"}/>)
				}
					<Button function={props.showDonate} buttonTitle={"Donate"}/>
				</div>
			</header>
		</Fragment>
	)

}

export default Header;