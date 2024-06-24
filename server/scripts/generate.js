const secp = require("ethereum-cryptography/secp256k1");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

function getAddress(publicKey) {
  const withoutFirstIndex = publicKey.slice(1);

  const hashed = keccak256(withoutFirstIndex);

  const address = hashed.slice(-20);

  return address;
}

const privatekey = secp.secp256k1.utils.randomPrivateKey();
const publicKey = secp.secp256k1.getPublicKey(privatekey, true);
const address = getAddress(publicKey);

console.log("private key : ", toHex(privatekey));
console.log("public key : ", toHex(publicKey));
console.log("address : ", toHex(address));
