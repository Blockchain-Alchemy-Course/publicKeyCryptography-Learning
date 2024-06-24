import { useState } from "react";
import server from "./server";
import messageGenerate from "./scripts/messageGenerate";
import { keccak256 } from "ethereum-cryptography/keccak";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";

function Transfer({
  address,
  setBalance,
  sendersPrivateKey,
  setSendersPrivateKey,
}) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  const message = messageGenerate(address, recipient, sendAmount);
  const msgBytes = utf8ToBytes(message);
  const hashedMessage = keccak256(msgBytes);
  const signature = secp256k1.sign(sendersPrivateKey, hashedMessage);
  const SendersPublicKey = signature.recoverPublicKey(hashedMessage).toHex();

  const replacer = (key, value) => {
    if (typeof value === "bigint") {
      return { $bigint: value.toString() };
    }
    return value;
  };

  // console.log(hashedMessage);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance },
      } = await server.post("send", {
        sender: address,
        amount: parseInt(sendAmount),
        recipient: recipient,
        // dataToSend: JSON.stringify(dataToTransfer),
        signature: JSON.stringify(signature, replacer),
        hashedMessage: JSON.stringify(hashedMessage, replacer),
        SendersPublicKey: SendersPublicKey,
      });
      setBalance(balance);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an public Key, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
