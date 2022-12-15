import { useState, useEffect } from "react";
import Web3 from "web3";
import "../CSS/App.css";

import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "../utils/load-contracts";
import { useNavigate } from "react-router-dom";

function Contribution() {
  const navigate = useNavigate();
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });

  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [reload, shouldReload] = useState(false);
  const [input,setInput]=useState(0);

  const reloadEffect = () => shouldReload(!reload);
  
  const setAccountListener = (provider) => {
    provider.on('accountsChanged',(accounts)=>{
           return setAccount(accounts[0]);
          })
        }

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      const contract = await loadContract("Funder", provider);
      

      if (provider) {
        setAccountListener(provider);
        provider.request({ method: "eth_requestAccounts" });
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
        });
      } else {
        console.error('Please install MetaMask!')
      }
    };

    loadProvider();
  }, []);


 
  
////////////////// To get all accounts and set 0 index account as connected /////////////// 
      useEffect(()=>{
        const getAccount=async()=>{
          const accounts= await web3Api.web3.eth.getAccounts();
         setAccount(accounts[0]);

         }
        
        web3Api.web3 && getAccount();

      },[web3Api]);
/////////////// To get Balance of the contract ///////////////////////////////// 
  useEffect(()=>{
     const loadBalance=async()=>{
      const {contract,web3}=web3Api
       const balance=await web3.eth.getBalance(contract.address);
       setBalance(web3.utils.fromWei(balance,"ether"));
     }
     web3Api.contract && loadBalance();
  },[web3Api,reload]);
      
 /////////////////TransFund ////////////////// 
  const transferFund = async () => {
    if(input<=0){
      return alert("Please! Enter Positive Values ");
     }
            console.log("i'm working")
      const { web3, contract } = web3Api;
    await contract.transfer({
      from:account,
      value: web3.utils.toWei(input, "ether"),
    });
    reloadEffect();
  };
  
  function toOwner(){
    navigate('/Owner')
  }


  
  


  
  return (
    <>
      <div class="card text-center">
        <div class="card-header">
          <div className="Title">CrowdFunding</div>
        

          <button
            type="button"
            class="btn btn-success"
            onClick={toOwner}
          >
            Owner Page
          </button>
        </div>
        <div class="card-body">
          <h1> Please Contribute </h1>
          <h5 class="card-title">Balance: {balance} ETH </h5>
          <p class="card-text">
            Account :{account ? account : "not connected"} 
          
          </p>
          
          

         <div className="trans">
         <input value={input} onInput={e => setInput(e.target.value)}/>        
    
    <div className="btn">
    <button type="button" class="btn btn-success "  onClick={transferFund}>
          Transfer
        </button>
      
       
    </div>
         </div>
        </div>
        <div class="card-footer text-muted">Thanks for Contribution</div>
      </div>
    </>
  );
}

export default Contribution;
