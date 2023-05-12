import Web3 from "web3";
 
let web3

if (typeof window != 'undefined' && typeof window.ethereum != 'undefined') {
    // we are in the browser and metamask is running
    window.ethereum.request({ method: "eth_requestAccounts" });
    web3 = new Web3(window.ethereum);
} else {
    // We are on the server *OR* the user is not running metamask
    const provider = new Web3.providers.HttpProvider("https://goerli.infura.io/v3/802b7332f59f4e56bcfc1d6074e8fdc5")
    web3 = new Web3(provider)
}
 
export default web3;