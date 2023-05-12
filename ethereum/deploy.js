const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
  'steak credit cradle hospital stick menu virtual renew theme cave time pluck',
  'https://goerli.infura.io/v3/802b7332f59f4e56bcfc1d6074e8fdc5'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: '1000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};
deploy();
/**
 * 20/03/23 - Contract deployed to 0x71575cBa17583eA55D20d0Fb9cF55540Be9774e5
 */
