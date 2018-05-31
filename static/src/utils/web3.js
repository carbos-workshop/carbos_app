/* eslint camelcase: 0 */

import axios from 'axios';

//--------------------
//import Web3 from 'web3';
//
// const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
// web3.eth.getAccounts().then(console.log);
//----------------------


export function get_txs_for_address() {
    return axios.get('http://api-ropsten.etherscan.io/api?module=account&action=txlist&address=0xcCD07F547c5DA7adcb71992e33bBAa292d2B9EB6&startblock=0&endblock=99999999&sort=asc&apikey=Z94APTDSX23QQ338SKR8CC1GUPYS8EDDVA');
}

export function get_abi() {
    return axios.get('http://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=0xcCD07F547c5DA7adcb71992e33bBAa292d2B9EB6&apikey=Z94APTDSX23QQ338SKR8CC1GUPYS8EDDVA');
}
