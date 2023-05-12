import React, { Component } from 'react';
import { Button, Card } from 'semantic-ui-react'

import factory from '../ethereum/factory';
import Layout from '../components/Layout';

// 1. Configure Web3 with a provider from MetaMask
// 2. Tell Web3 that a deployed copy of 'CampaignFactory' exists
// 3. Use Factory instance to retrieve a list of deployed campaigns
// 4. Use React to show something about eacth campaign


class CampaignIndex extends Component {
    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        return { campaigns };
    }

    renderCampaigns() {
        const items = this.props.campaigns.map(address => {
            return {
                header: address,
                description: <a>View Campaign</a>,
                fluid: true
            };
        });
        return <Card.Group items={items} />;
    }

    render() {
        return (
            <Layout>
            <div>
                <link
                    async
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
                />
                <h3>Open Campaigns</h3>
                { this.renderCampaigns() }
                <Button 
                    content="Create Campaign"
                    icon="add circle"
                    primary
                />
            </div>
            </Layout>
        );
    }
}

export default CampaignIndex;