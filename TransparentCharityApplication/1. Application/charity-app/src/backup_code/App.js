import './App.css';
import Header from './Components/Header';
import TransactionController from './Components/TransactionController';
import { useState, useCallback } from 'react';
import Login from './Components/Forms/Login';
import TransactionOverview from './Components/TransactionOverview/TransactionOverview';
import DonationModal from './Components/Donation/DonationModal';
import ReactLoading from 'react-loading';
import styles from './App.css'
import { Fragment } from 'react-is';


function App(props) {

  const [transactions, setTransactions] = useState([])
  const [overviewData, setOverviewData] = useState({})

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAllTransactions = useCallback(async function() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:5001/get_chain');
      const data = await response.json();

      if (!response.ok) {throw new Error('Encountered an error!');};

      // split blockchain into transaction data
      const transactions = data.blockchain.map(
        (block) => {

          let time = block.timestamp;
          let year = time.substring(0, 4)
          let month = time.substring(5, 7)
          let day = time.substring(8, 10)

          let hour = time.substring(11, 13)
          let minute = time.substring(14, 16)
          let second = time.substring(17, 19)


          let details = block.transactions['0'];
          let length = block.transactions.length;

          if (length < 1) {
            return {
              time: `${hour}:${minute}:${second} (${day}/${month}/${year})`,
              sender: 'GENESIS BLOCK',
              receiver: 'N/A',
              amount: 'N/A'
            };
          }

          return {
            time: `${hour}:${minute}:${second} (${day}/${month}/${year})`,
            sender: details['from'],
            receiver: details['to'],
            amount: details['amount']
          }
        }
      );
      let reversedList = transactions.map(item => item).reverse();
      setTransactions(reversedList);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
	}, []);

  const fetchOverview = useCallback(async function() {
    setLoading(true);
    setError(null);
    try {
      const response1 = await fetch('http://127.0.0.1:5001/total_donated');
      const total_donated = await response1.json();

      const response2 = await fetch('http://127.0.0.1:5001/total_to_beneficiary');
      const total_given = await response2.json();

      if (!response1.ok || !response2.ok) {throw new Error('Encountered an error!');};

      // split blockchain JSON
      const overviewData = {
        total : total_donated,
        total_given: total_given
      }

      setOverviewData(overviewData);

    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
	}, []);

  const [loginVisible, setLoginVisible] = useState(false);
  const [donateVisible, setDonateVisible] = useState(false);
  const [overviewVisible, setOverviewVisible] = useState(false);

  function hideLogin() {
    setLoginVisible(false)
  }  

  function showLogin() {
    setLoginVisible(true)
  }

  function hideDonate() {
    setDonateVisible(false)
  }  

  function showDonate() {
    setDonateVisible(true)
  }

  function hideOverview() {
    setOverviewVisible(false)
  }  
  
  function showOverview() {
    fetchOverview();
    setOverviewVisible(true)
  }

 

  return (
        <Fragment>
        {loginVisible? <Login setLoading={setLoading} hideLogin={hideLogin}/> : ''}
        {overviewVisible? <TransactionOverview hideOverview={hideOverview} overviewData={overviewData}/> : ''}
        {donateVisible? <DonationModal setLoading={setLoading} hideDonate={hideDonate} setError={setError}/> : ''}


      <div className="App">
        <Header showLogin={showLogin} showDonate={showDonate}/>
        <div className="information_box">
        </div>
          <div className={styles}>
            {loading? <ReactLoading className="load_pic" type="spin"/> : ''}
            {error? <div><p>An error occured. Unable to retrive transactions.</p></div> : ''}
            <TransactionController startup={fetchAllTransactions} refresh={fetchAllTransactions} transactions={transactions} showOverview={showOverview}/>
            
          </div>
      </div>
    </Fragment>
  );
}

export default App;
