const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from : accounts[0], gas: '1000000' });

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface), 
        campaignAddress
    );
});

describe('Campaign', () => {
    it('deploys the contracts for the factory and the campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('it marks caller as the Campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(manager, accounts[0]);
    });

    it('can people contribute', async () => {
        const approversCountBefore = await campaign.methods.approversCount().call();

        await campaign.methods.contribute().send({
            from: accounts[1],
            value: '200'
        });

        const approversCountAfter = await campaign.methods.approversCount().call();

        assert.equal(approversCountAfter - 1, approversCountBefore);

        const isContributor = await campaign.methods.approvers(accounts[1]).call();

        assert(isContributor);
    });

    it('require a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                from: accounts[2],
                value: '50'
            });
            assert(false)
        } catch (error) {
            assert(error);
        }
    });

    it('allows the manager to make payment request', async () =>{
        await campaign.methods.createRequest(
                'Test Description', 
                '100', 
                accounts[4])
            .send({
                from: accounts[0],
                gas: '1000000'
            });
        
        const request = await campaign.methods.requests(0).call();

        assert.equal(request.description, 'Test Description');
    });

    it('process requests', async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods
            .createRequest(
                'Test Description',
                web3.utils.toWei('5', 'ether'),
                accounts[1]
            )
            .send({
                from: accounts[0],
                gas: '1000000'
        });

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });
        
        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);

        assert(balance > 104); // because we don't restart balance in accounts
    });

});