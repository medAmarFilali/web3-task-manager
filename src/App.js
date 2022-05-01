import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Manager from "./artifacts/contracts/Manager.sol/Manager.json";

function App() {
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [tickets, setTickets] = useState([]);
  const [contract, setContract] = useState(null);

  const getTickets = async () => {
    const transaction = await contract.getTickets();
    console.log(transaction);
    setTickets(transaction);
  };

  const createTicket = async (_name) => {
    console.log("Name: ", _name);
    const transaction = await contract.createTicket(_name);
    await transaction.wait();
    getTickets();
  };

  const updateTicketStatus = async (_index, _status) => {
    const transaction = await contract.updateTicketStatus(_index, _status);
    await transaction.wait();
    getTickets();
  };

  const updateTicketName = async (_index) => {
    const _newName = prompt("New name: ");
    const transaction = await contract.updateTicketName(_index, _newName);
    await transaction.wait();
    getTickets();
  };

  const initConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const newSigner = provider.getSigner();
      setAccount(accounts[0]);
      setContract(
        new ethers.Contract(
          "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9",
          Manager.abi,
          newSigner
        )
      );
    } else {
      alert("Please install MetaMask");
    }
  };

  useEffect(() => {
    initConnection();
  }, []);

  return (
    <div className="page">
      <div className="header">
        <p>Web3 Task Manager</p>
        {account !== "" ? (
          <p>{account.substring(0, 9)}</p>
        ) : (
          <button className="big_button" onClick={initConnection}>
            Connect
          </button>
        )}
      </div>
      <div className="input_section"></div>
      <div className="main">
        <div className="main_col" style={{ backgroundColor: "lightPink" }}>
          <div className="main_col_heading">Todo</div>
        </div>
        <div className="main_col" style={{ backgroundColor: "lightBlue" }}>
          <div className="main_col_heading">Busy</div>
        </div>
        <div className="main_col" style={{ backgroundColor: "lightGreen" }}>
          <div className="main_col_heading">Done</div>
        </div>
      </div>
    </div>
  );
}

export default App;
