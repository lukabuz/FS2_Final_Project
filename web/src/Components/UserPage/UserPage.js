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
	Content,
	MediaContent,
	Title,
	Subtitle
} from "bloomer";
import Transactions from "../Transactions/Transactions";

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

		const transactions = await this.getTransactions();
		this.setState(state => ({ ...state, transactions, loaded: true }));
	};

	getTransactions = async () => {
		return new Promise((resolve, reject) => {
			this.dataInterface
				.getTransactions()
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
						<Box>
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
											<Title isSize={4}>Username</Title>
											<Subtitle isSize={6}>
												Balance: {this.state.transactions.balance}
											</Subtitle>
										</MediaContent>
									</Media>
									<Content>Test Content</Content>
								</CardContent>
							</Card>
							<Transactions
								width="100%"
								transactions={this.state.transactions.received}
							/>
							<Transactions
								width="100%"
								transactions={this.state.transactions.sent}
							/>
						</Box>
					</Column>
					<Column isSize="1/3">2</Column>
					<Column isSize="1/3">3</Column>
				</Columns>
			);
		} else return <div>Loading</div>;
	}
}
