import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [sendersPrivateKey, setSendersPrivateKey] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        sendersPrivateKey={sendersPrivateKey}
        setSendersPrivateKey={setSendersPrivateKey}
      />
      <Transfer
        setBalance={setBalance}
        address={address}
        sendersPrivateKey={sendersPrivateKey}
        setSendersPrivateKey={setSendersPrivateKey}
      />
    </div>
  );
}

export default App;
