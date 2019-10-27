import React, { Component } from "react";
import {
	Column,
	Columns,
	Box,
	Card,
	CardContent,
	Media,
	MediaLeft,
	Image,
	MediaContent,
	Title,
	Subtitle
} from "bloomer";
import Transactions from "../Transactions/Transactions";
import Listings from "../Listings/Listings";

import DataInterface from "../../Data";

export default class UserPage extends Component {
	constructor(props) {
		super(props);
		this.state = { transactions: {}, loaded: false };
	}
	componentDidMount = async () => {
		this.dataInterface = new DataInterface(
			this.props.authInterface.getAuthDetails().username,
			this.props.authInterface.getAuthDetails().password
		);

		const userInfo = await this.getInfo();

		this.setState(state => ({
			...state,
			transactions: { sent: userInfo.sent, received: userInfo.received },
			purchases: userInfo.purchases,
			listings: userInfo.listings,
			balance: userInfo.balance,
			userInfo: userInfo.userInfo,
			loaded: true
		}));
	};

	getInfo = async () => {
		return new Promise((resolve, reject) => {
			this.dataInterface
				.getInfo()
				.then(res => {
					resolve(res);
				})
				.catch(e => {
					reject(e);
				});
		});
	};

	load = () => {
		this.setState(state => ({ ...state, loaded: true }));
	};

	render() {
		if (this.state.loaded) {
			return (
				<Columns>
					<Column isSize="1/3">
						<div>
							<Card>
								<CardContent>
									<Media>
										<MediaLeft>
											<Image
												isSize="48x48"
												src="https://via.placeholder.com/96x96"
											/>
										</MediaLeft>
										<MediaContent>
											<Title isSize={7}>{this.state.userInfo.username}</Title>
											<Subtitle isSize={5}>
												{this.state.userInfo.email}
											</Subtitle>
											<Subtitle isSize={10}>
												<strong>Balance: {this.state.balance}</strong>
											</Subtitle>
										</MediaContent>
									</Media>
								</CardContent>
							</Card>
						</div>
						<hr />
						<Title>Received Transactions</Title>
						<Transactions
							width="100%"
							transactions={this.state.transactions.received}
						/>
						<Title>Sent Transactions</Title>
						<Transactions
							width="100%"
							transactions={this.state.transactions.sent}
						/>
					</Column>
					<Column isSize="1/3">
						<Listings listings={this.state.listings} />
					</Column>
					<Column isSize="1/3">3</Column>
				</Columns>
			);
		} else return <div>Loading</div>;
	}
}
