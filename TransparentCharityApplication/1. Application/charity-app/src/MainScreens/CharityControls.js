import BeneficiariesController from '../Components/Beneficiaries/BeneficiariesController';
import  styles  from './CharityControls.module.css';
import { useEffect, useState, useCallback } from 'react';
import Button from '../Components/Buttons/Button';
import Card from '../Components/UI/Card';
import AddBeneficiary from '../Components/Beneficiaries/AddModal/AddBeneficiary';
import RemoveBeneficiary from '../Components/Beneficiaries/RemoveBeneficiaryModal/RemoveBeneficiary';


export default function CharityControls(props) {

  //useState and variable declarations
  const [beneficiaries, setBeneficiaries] = useState([])
  const [showBeneficiaries, setshowBeneficiaries] = useState(false);
  const [showAddBeneficiary, setShowAddBeneficiary] = useState(false);
  const [showRemoveBeneficiary, setshowRemoveBeneficiary] = useState(false)
  const [remainder, setRemainder] = useState(0)

  const received = props.received;
  const given = props.given;


  // get overview on startup
  useEffect(() => {
    props.getOverview();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // display charity statistics on startup
  useEffect(() => {
    let percentage = received - given;
    if (isNaN(percentage)) {
      setRemainder(0);
    } else {
      setRemainder(percentage);
    }

  }, [received, given])

  // show beneficiaries
  function showBeneficiary() {
    getBeneficiaries();
    setshowBeneficiaries(!showBeneficiaries)
    setshowRemoveBeneficiary(false)
  }

  // show remove beneficiaries
  function removeBeneficiary() {
    setshowRemoveBeneficiary(!showRemoveBeneficiary);
    setShowAddBeneficiary(false);

  }

  // hide beneficiaries
  function hideAddBeneficiaryModal() {
    setShowAddBeneficiary(false);
  }

  // show beneficiary modal
  function showAddBeneficiaryModal() {
    setShowAddBeneficiary(true);
  }

  // get beneficiaries from database ------ In progress ------------------------------------------------------------------------------------------------
  const getBeneficiaries = useCallback(async function() {

    try {

      const response1 = await fetch('http://127.0.0.1:5000/get_beneficiaries');
      let data = await response1.json();

      data = data["beneficiaries"]; // returns a list of lists
      if (!response1.ok) {throw new Error('Encountered an error!');};

      // Continue from here <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

      const beneficiaryArray = data.map(array => {return {
         "name": array[0],
         "phone":array[1],
         "email":array[2]
      }})

      setBeneficiaries(beneficiaryArray);

    } catch (error) {
      console.log(error);
    }

	}, []);

  // Message to show
  let message1 = "Move to Beneficiary";
  if (!showBeneficiaries === false) {
    message1 = "Hide Beneficiaries";
  }

 // JSX
  return (

    <div className={styles.charity_controls}>

      <div className={styles.buttons}>
        <Button function={showAddBeneficiaryModal} buttonTitle={"Add Beneficiary"}/>
        <Button function={removeBeneficiary} buttonTitle={"Remove Beneficiary"}/>
        <Button function={showBeneficiary} buttonTitle={message1}/>
      </div>

      {
        showAddBeneficiary? <AddBeneficiary key={6} getBeneficiaries={getBeneficiaries} setLoading={props.setLoading} hideFunction = {hideAddBeneficiaryModal}/> : ''
      }

      {
        showRemoveBeneficiary ? <RemoveBeneficiary key={7} getBeneficiaries={getBeneficiaries} hideFunction={removeBeneficiary}/> : ''
      }


      {showBeneficiaries && !showRemoveBeneficiary? 
        (
          <div className={styles.info_box}>
            <BeneficiariesController refreshTransactions={props.refreshTransactions} beneficiaries={beneficiaries}/>
          </div>
        ) 
        :       
        (
          <div className={styles.info_box}>
            <Card  isSmall={true}>
              <p>Amount received: £{received}</p>
            </Card>
            <Card isSmall={true}>
              <p>Amount given to good causes: £{given}</p>
            </Card>
            <Card  isHighlighted={true} isSmall={true}>
              <p className={styles.highlighted_text}>Amount retained by charity: £{remainder.toFixed(2)}</p>
            </Card>
          </div>
        )
      }
    </div>
  );
}

