// const { secp256k1 } = require("ethereum-cryptography/secp256k1");
// const { keccak256 } = require("ethereum-cryptography/keccak");
// const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");

function messageGenerate(sender, recipient, amount) {
  const transactionDetails = {
    sender: sender,
    recipient: recipient,
    amount: amount,
  };

  const message = JSON.stringify(transactionDetails);

  return message;
}

export default messageGenerate;
