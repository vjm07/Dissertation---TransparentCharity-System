import Header from '../Components/Header';
import TransactionController from '../Components/TransactionController';
import { useState, useCallback, useEffect } from 'react';
import Login from '../Components/Forms/Login';
import TransactionOverview from '../Components/TransactionOverview/TransactionOverview';
import DonationModal from '../Components/Donation/DonationModal';
import ReactLoading from 'react-loading';
import styles from './DonorScreen.module.css'
import { Fragment } from 'react-is';
import CharityControls from './CharityControls';


export default function DonorScreen() {

  // State declarations
  const [isCharity, setIsCharity] = useState(false);

	const [transactions, setTransactions] = useState([]);
	const [overviewData, setOverviewData] = useState({});

  const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

  const [loginVisible, setLoginVisible] = useState(false);
  const [donateVisible, setDonateVisible] = useState(false);
  const [overviewVisible, setOverviewVisible] = useState(false);  


	const received = overviewData["total"];
	const given = overviewData["total_given"];

  // keep login on refresh
	useEffect(() => {
    
    // get hash stored
    const storedLoginInfo = localStorage.getItem('loggedIn');

    // check if hash matches what is stored on the server
    async function checkLogin() {
      setLoading(true);
      setError(null);

      // remove card coded hash! use storedLoginInfo
      const toPost = {
        "hash": String(storedLoginInfo)
      }      

      // check login using stored hash!
			try {
        const response = await fetch('http://127.0.0.1:5000/check_login',  {
        method: 'POST',
        body: JSON.stringify(toPost),
        headers: {
          'Content-Type': 'application/json'
          }
        });
        
        const json = await response.json();
        const success = json["match"];
        
        setIsCharity(success);
  
      } catch (error) {
        setError(error.message);
      }
    }

    checkLogin();
    setLoading(false);

	}, [])

  // logout
  function logout() {
    localStorage.removeItem('loggedIn');
    setIsCharity(false);
  }

  // get transactions function from API
  const fetchAllTransactions = useCallback(async function() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:5001/get_chain');
      const data = await response.json();

      if (!response.ok) {throw new Error('Encountered an error!');};

      // split blockchain JSON
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
            amount: details['amount'].toFixed(2)
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

  // get overview function from API
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
        total : total_donated.toFixed(2),
        total_given: total_given.toFixed(2)
      }

      setOverviewData(overviewData);

    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
	}, []);

  // show/hide modal functions
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

  // return JSX
	return (
		<Fragment>
			{loginVisible? <Login isCharity={isCharity} setLoginVisible={setLoginVisible} setLoading={setLoading} hideLogin={hideLogin} setIsCharity={setIsCharity}/> : ''}
			{overviewVisible? <TransactionOverview hideOverview={hideOverview} overviewData={overviewData}/> : ''}
			{donateVisible? <DonationModal fetchAllTransactions={fetchAllTransactions} setLoading={setLoading} hideDonate={hideDonate} setError={setError}/> : ''}

			<div className="App">
				<Header isCharity={isCharity} logout={logout} showLogin={showLogin} showDonate={showDonate}/>
        <div className={styles.fill}></div>
				<div className={styles.padding}>
          {
            isCharity ? 
            (
              <div className={styles.charity_controls}>
              <CharityControls refreshTransactions={fetchAllTransactions} setLoading={setLoading} given={given} received={received} getOverview={fetchOverview}/>
              </div>
            ) : ''
          }
            {loading? <ReactLoading className="load_pic" type="spin"/> : ''}
            {error? <Fragment><p>An error occured.</p></Fragment> : ''}
            <TransactionController startup={fetchAllTransactions} refresh={fetchAllTransactions} transactions={transactions} showOverview={showOverview}/>
				</div>
			</div>
		</Fragment>
	);
}

