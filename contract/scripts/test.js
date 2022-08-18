const ethers = require("ethers");
const privateKey =
  "0x4967d9360f24a79a6b0e7eae94c9460ef00039a7d04f89defcb07ef7f4ec80ad";
const contractAddress = "0x5e7fE8E7243925B4e239fc0B93617Fe4903cA2f8";
const contractABI = require("./abi.json");
const signature =
  "0x4a3e0bf1f4bf926f99bda0bfa0d031c88e198969510c617651012237529922ea7d29b1fe890daf96e081640d889575429a8881b368def4f8ab33480197b6e8ad1b";
const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/b_hn2oETygzJLSLi4Bt69dDZVzPz5P-l");
const wallet = new ethers.Wallet(privateKey, provider);
const newContract = new ethers.Contract(contractAddress, contractABI, provider);
const signingContract = newContract.connect(wallet);
const { r, s, v } = ethers.utils.splitSignature(signature);
console.log("r: ",r)
console.log("s: ",s)
console.log("v: ",v)
const trxPromise = signingContract.lendToAave(
  v.toString(),
  r.toString(),
  s.toString(),
  "0x69e666767Ba3a661369e1e2F572EdE7ADC926029",
  "123456",
  { value: ethers.utils.parseEther("0.001") }
);
const createTrx = async()=>{
await trxPromise
  .then(async function (tx) {
    console.info("Transaction sent: %o", tx);
    await tx.wait(3);
    console.log(tx)
  })
  .catch((err) => {
    console.error("Unable to complete transaction, error: %o", err);
  });
}
createTrx()