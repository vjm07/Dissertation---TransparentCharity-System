import styles from "./Button.module.css";
import React from "react";

// reusable button function
function Button(props) {


	return(
		<button  onClick={props.function} className={styles.button}>
			<p>
				{props.buttonTitle}
			</p>
		</button>
	)
}

export default Button;