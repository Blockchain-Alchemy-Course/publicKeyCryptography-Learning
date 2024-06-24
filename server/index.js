const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const userDetails = require("./scripts/userdetails.json");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");

app.use(cors());
app.use(express.json());

// recieve Bitint after serializing it
const reciever = (key, value) => {
  if (
    value !== null &&
    typeof value === "object" &&
    "$bigint" in value &&
    typeof value.$bigint === "string"
  ) {
    return BigInt(value.$bigint);
  } else {
    return value;
  }
};

const balances = {};

balances[userDetails.userDetails[0].publicKey] = 100;
balances[userDetails.userDetails[1].publicKey] = 50;
balances[userDetails.userDetails[2].publicKey] = 75;

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const {
    recipient,
    amount,
    sender,
    signature,
    hashedMessage,
    SendersPublicKey,
  } = req.body;
  const parsedSignature = JSON.parse(signature, reciever);
  const parsedHashedMessage = JSON.parse(hashedMessage, reciever);
  const finalHash = new Uint8Array(Object.keys(parsedHashedMessage).length);

  for (let i = 0; i < finalHash.length; i++) {
    finalHash[i] = parsedHashedMessage[i];
  }

  const isValid = secp256k1.verify(
    parsedSignature,
    finalHash,
    SendersPublicKey
  );

  console.log(isValid);

  if (isValid == true) {
    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    res
      .status(400)
      .send({ message: "the public key cryptography authentication failed" });
  }
});

// app.post("/send", (req, res) => {
//   const { sender, recipient, amount } = req.body;

//   setInitialBalance(sender);
//   setInitialBalance(recipient);

//   if (balances[sender] < amount) {
//     res.status(400).send({ message: "Not enough funds!" });
//   } else {
//     balances[sender] -= amount;
//     balances[recipient] += amount;
//     res.send({ balance: balances[sender] });
//   }
// });

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
