import Modal from '../UI/Modal';
import Form from './Form';
import styles from './Login.module.css';
import React, {useEffect, useCallback, useState, Fragment} from 'react';

// Just a mock login page to allow charity controls!
export default function Login(props) {

	// declarations
	const [isCharity, setisCharity] = useState()
	const [loginAttempted, setLoginAttempted] = useState(false)

	// update parent variables
	useEffect(() => {
		setisCharity(props.isCharity);
		
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// props.setIsCharity(); // set logged in or not
	useEffect(() => {
		props.setIsCharity(isCharity)
	}, [isCharity, props])

	// submit form function
	const formButtonFunction = useCallback(async function(values) {

		props.setLoading(true);

		const toPost = {
			'username': String(values['value1']),
			'password': String(values['value2'])
		}

		// if payment successful then add to blockchain!	
		try {
			const response = await fetch('http://127.0.0.1:5000/login',  {
			method: 'POST',
			body: JSON.stringify(toPost),
			headers: {
				'Content-Type': 'application/json'
				}
			});
			
			const json = await response.json();
			const isCharity = json["login_success"];
			setisCharity(isCharity);
			localStorage.setItem('loggedIn', String(json["login_hash"]));


				// shut down popup
			if (isCharity === true) {
				props.setLoginVisible(false);
			} else {
				setLoginAttempted(true);
			}

		} catch (error) {
			console.log(error);
		}

		props.setLoading(false);

		// eslint-disable-next-line react-hooks/exhaustive-deps
		}, 	[]);

	// Login failed JSX
	const incorrectCredentials = (
		<Fragment>
			<h2 className={styles.notice}>
				The username or password was incorrect, please try again.
			</h2>
		</Fragment>
	);

	return (
		<Modal hideFunction={props.hideLogin}>
			{
				loginAttempted ? incorrectCredentials : ''
			}
			<h2 className={styles["header2"]}>Charity Login</h2>
			<Form 
			secondaryInputType={'password'}	
			formButtonFunction={formButtonFunction}
			setLoading={props.setLoading}
			/>
		</Modal>
	)
}		
