import styles from "./Form.module.css";
import { useEffect, useState } from "react";
import Password from "./Inputs/Password";
import Number from "./Inputs/Number";
import Username from "./Inputs/Username";

// This is the basic form component - used by the donation and login screen
export default function Form(props) {

  // State declarations
  const inputType = props.secondaryInputType;

  const [buttonInactive, setButtonInactive] = useState(true);

  // get values from children
  const [value1, getValue1] = useState("")
  const [value2, getValue2] = useState("")

  const [value1Valid, setValue1Valid] = useState(false)
  const [value2Valid, setValue2Valid] = useState(false)

  // only runs when there are changes to the variables in []
  useEffect(() => {
    if (value1Valid && value2Valid) {
      setButtonInactive(false);
    } else {
      setButtonInactive(true);
    }
    
    return;
  }, [value1Valid, value2Valid]);


  // Form Submission
  function submitForm(event) {
    event.preventDefault();
    props.setLoading(true)

    if (!value1Valid || !value2Valid) {
      return;
    }
    
    // props function!
    props.formButtonFunction(
      {
        "value1": value1,
        "value2": value2
      }
    );

    props.setLoading(false)
  }

// Output JSX

  return (
    <form>
      <div className={styles["control-group"]}>
        <Username getValue={getValue1} validityChecker={setValue1Valid}/>
        {inputType === "password" ? <Password getValue={getValue2} validityChecker={setValue2Valid}/>: ''}
        {inputType === "number" ? <Number getValue={getValue2} validityChecker={setValue2Valid}/>: ''}
      </div>

      <div className={styles["form-actions"]}>
        <button disabled={buttonInactive} onClick={submitForm}>
          Submit
        </button>
      </div>
    </form>
  );
}
