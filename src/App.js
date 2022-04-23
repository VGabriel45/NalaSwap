import logo from "./logo.svg";
import "./App.css";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar"

import { ethers } from "ethers";
import React, { useEffect, useState } from "react";

function App() {

    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
      isMetamaskConnected()
    },[isConnected]);

    const isMetamaskConnected = async () => {
      if (typeof window !== "undefined") {
        const { ethereum } = window;
        if (ethereum) {
            var provider = new ethers.providers.Web3Provider(ethereum);
        }
      }
      const accounts = await provider.listAccounts();
      setIsConnected(accounts.length > 0);
    }

  return (
    <div className="App">
      <Navbar />
      <header className="App-header">
        {isConnected ? 
          <div style={{marginTop: "-150px"}}>
            <img src={logo} style={{width:"90%", height:"30vh"}} className="App-logo" alt="logo" />
            <HomePage />
          </div>
          : ""
        }
      </header>
    </div>
  );
}

export default App;
