import {useState, useEffect} from 'react'
import useInput from '../hooks/input-hook';

const SimpleInput = (props) => {

  // Name states
  const 
  {
    enteredValue: enteredName, 
    valueValid: enteredNameValid, 
    hasError: nameInputIsInvalid, 
    handleValueChange: nameInputChangeHandler, 
    handleInputBlur: nameInputBlur, 
    reset: nameReset
  } = useInput(value => value.trim() !== '');

  // Email states
  const 
  {
    enteredValue: enteredEmail, 
    valueValid: enteredEmailValid, 
    hasError: emailInputIsInvalid, 
    handleValueChange: emailInputChangeHandler, 
    handleInputBlur: emailInputBlur, 
    reset: emailReset
  } = useInput(value => value.includes('@') && value.includes('.'));

  // Class controls
  const nameInputClass = nameInputIsInvalid ? 'form-control invalid' : 'form-control'
  const emailInputClass = emailInputIsInvalid ? 'form-control invalid' : 'form-control'

  // Overall form states - Managing overall form vaildity - just for reevaluation whenever things change... hope it doesnt make things slow lol
  const [formIsValid, setformIsValid] = useState(false)
  useEffect(
    function(){
      if (enteredNameValid && enteredEmailValid){
        setformIsValid(true);
      } else {
        setformIsValid(false)
      }
    }, [enteredNameValid, enteredEmailValid] // put all validity constants here to run it whenever they change
  )

  // Form submission
  function formSubmissionHandler(event) {
    event.preventDefault(); // to not send the http request! =D

    if (!enteredNameValid){
      return;
    }

    nameReset();
    emailReset();
  }

  return (
    <form onSubmit={formSubmissionHandler}>

        <div className={nameInputClass}>
          <label htmlFor='name'>Your Name</label>
          <input onBlur={nameInputBlur} value={enteredName} type='text' id='name' onChange={nameInputChangeHandler}/>
          {nameInputIsInvalid ? <p>No name entered!</p> : ''}
        </div>

        <div className={emailInputClass}>
          <label htmlFor='email'>Your Email</label>
          <input onBlur={emailInputBlur} value={enteredEmail} type='text' id='email' onChange={emailInputChangeHandler}/>
          {emailInputIsInvalid ? <p>Email Invalid!</p> : ''}
        </div>

        <div className="form-actions">
          <button disabled={!formIsValid}>Submit</button>
        </div>

    </form>
  );
};

export default SimpleInput;
