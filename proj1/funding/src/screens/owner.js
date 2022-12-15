import { useState, useEffect } from "react";
import Web3 from "web3";
import "../CSS/App.css";

import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "../utils/load-contracts";
import { useNavigate} from "react-router-dom";


function App() {
    const navigate = useNavigate();
    const [web3Api, setWeb3Api] = useState({
        provider: null,
        web3: null,
        contract: null,
    });

    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(0);
    const [reload, shouldReload] = useState(false);
    const [input, setInput] = useState(0);
    const [owner,setowner]=useState(null);
    const reloadEffect = () => shouldReload(!reload);

    const setAccountListener = (provider) => {
        provider.on('accountsChanged', (accounts) => {
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
                contract.getOwner().then((e)=>{
                    setowner(e);
                 });
            } else {
                console.error('Please install MetaMask!')
            }
        };

        loadProvider();
    }, []);



   
    ////////////////// To get all accounts and set 0 index account as connected /////////////// 
    useEffect(() => {
        const getAccount = async () => {
            const accounts = await web3Api.web3.eth.getAccounts();
            setAccount(accounts[0]);

        }

        web3Api.web3 && getAccount();

    }, [web3Api]);
    /////////////// To get Balance of the contract ///////////////////////////////// 
    useEffect(() => {
        const loadBalance = async () => {
            const { contract, web3 } = web3Api
            const balance = await web3.eth.getBalance(contract.address);
            setBalance(web3.utils.fromWei(balance, "ether"));
        }
        web3Api.contract && loadBalance();
    }, [web3Api, reload]);


    ////////////// To withdraw fund/////////////////////
    const withdrawFund = async () => {
        const { web3, contract } = web3Api;
        if (input <= 0) {
            return alert("Please! Enter Positive value");
        }
        if(parseInt(input) > parseInt(balance)){
            return alert ("Insufficient balance")
        }
        
        if ((account !== owner)  ) {
            
            return alert("Sorry!you can't proceed")
        }
        const amount = web3.utils.toWei(input, "ether");
        await contract.withdraw(amount, {
            from: account,
        })
        reloadEffect();
    };

    function toContro() {
        navigate('/')
    }








    return (
        <>
            <div class="card text-center">
                <div class="card-header">
                    <div className="Title">CrowdFunding</div>
                    {/* <button
            type="button"
            class="btn btn-success"
            onClick={toConnect}
          >
            Connect to metamask
          </button> */}
                    <button
                        type="button"
                        class="btn btn-success"
                        onClick={toContro}
                    >
                        Contribution
                    </button>
                </div>
                <div class="card-body">
                    <h2>Owner Page</h2>
                    <h5 class="card-title">Balance: {balance} ETH </h5>
                    <p class="card-text">
                        Account :{account ? account : "not connected"}

                    </p>



                    <div className="trans">
                        <input value={input} onInput={e => setInput(e.target.value)} />

                        <div className="btn">


                            <button type="button" class="btn btn-primary " onClick={withdrawFund}>
                                Withdraw
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-footer text-muted">Thanks for Contribution</div>
            </div>
        </>
    );
}

export default App;
