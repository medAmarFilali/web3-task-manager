import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Manager from "./artifacts/contracts/Manager.sol/Manager.json";
import "./App.css";

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

      <div className="input_section">
        <div>
          <button onClick={() => createTicket(name)} className="big_button">
            Create ticket
          </button>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
          <button onClick={getTickets} className="big_button">
            Load Data
          </button>
        </div>
      </div>

      <div className="main">
        <div className="main_col" style={{ backgroundColor: "lightPink" }}>
          <div className="main_col_heading">Todo</div>
          {tickets
            .map((t, i) => ({ id: i, item: t }))
            .filter((t) => t.item.status === 0)
            .map((ticket, index) => (
              <div className="main_ticket_card" key={index}>
                <p className="main_ticket_card_id">#{ticket.id}</p>
                <p>{ticket.item.name}</p>
                <div className="main_ticket_button_section">
                  <button
                    className="small_button"
                    style={{ backgroundColor: "lightBlue" }}
                    onClick={() => updateTicketStatus(ticket.id, 1)}
                  >
                    Busy
                  </button>
                  <button
                    className="small_button"
                    style={{ backgroundColor: "lightGreen" }}
                    onClick={() => updateTicketStatus(ticket.id, 2)}
                  >
                    Done
                  </button>
                  <button
                    className="small_button"
                    style={{ backgroundColor: "lightGrey" }}
                    onClick={() => updateTicketName(ticket.id)}
                  >
                    Rename
                  </button>
                </div>
              </div>
            ))}
        </div>
        <div className="main_col" style={{ backgroundColor: "lightBlue" }}>
          <div className="main_col_heading">Busy</div>
          {tickets
            .map((t, i) => ({ id: i, item: t }))
            .filter((t) => t.item.status === 1)
            .map((ticket, index) => (
              <div className="main_ticket_card" key={index}>
                <p className="main_ticket_card_id">#{ticket.id}</p>
                <p>{ticket.item.name}</p>
                <div className="main_ticket_button_section">
                  <button
                    className="small_button"
                    style={{ backgroundColor: "lightPink" }}
                    onClick={() => updateTicketStatus(ticket.id, 0)}
                  >
                    Todo
                  </button>
                  <button
                    className="small_button"
                    style={{ backgroundColor: "lightGreen" }}
                    onClick={() => updateTicketStatus(ticket.id, 2)}
                  >
                    Done
                  </button>
                  <button
                    className="small_button"
                    style={{ backgroundColor: "lightGrey" }}
                    onClick={() => updateTicketName(ticket.id)}
                  >
                    Rename
                  </button>
                </div>
              </div>
            ))}
        </div>
        <div className="main_col" style={{ backgroundColor: "lightGreen" }}>
          <div className="main_col_heading">Done</div>
          {tickets
            .map((t, i) => ({ id: i, item: t }))
            .filter((t) => t.item.status === 2)
            .map((ticket, index) => (
              <div className="main_ticket_card" key={index}>
                <p className="main_ticket_card_id">#{ticket.id}</p>
                <p>{ticket.item.name}</p>
                <div className="main_ticket_button_section">
                  <button
                    className="small_button"
                    style={{ backgroundColor: "lightPink" }}
                    onClick={() => updateTicketStatus(ticket.id, 0)}
                  >
                    Todo
                  </button>
                  <button
                    className="small_button"
                    style={{ backgroundColor: "lightBlue" }}
                    onClick={() => updateTicketStatus(ticket.id, 1)}
                  >
                    Busy
                  </button>
                  <button
                    className="small_button"
                    style={{ backgroundColor: "lightGrey" }}
                    onClick={() => updateTicketName(ticket.id)}
                  >
                    Rename
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
