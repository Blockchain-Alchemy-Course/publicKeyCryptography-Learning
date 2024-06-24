import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  sendersPrivateKey,
  setSendersPrivateKey,
}) {
  async function onChange(evt) {
    const address = evt.target.value;

    const PrivateToPublicKey = toHex(secp256k1.getPublicKey(address));
    setAddress(PrivateToPublicKey);
    setSendersPrivateKey(address);
    // console.log("senders private key = ", sendersPrivateKey);
    // console.log(PrivateToPublicKey);
    console.log("privateKey - ", address);
    console.log("publicKey - ", PrivateToPublicKey);
    if (PrivateToPublicKey) {
      const {
        data: { balance },
      } = await server.get(`balance/${PrivateToPublicKey}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Your Private Key (to see your bank balance)
        <input
          placeholder="Type an address, for example: 0x1"
          value={address}
          onChange={onChange}
        ></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
