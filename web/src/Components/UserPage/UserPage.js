import React, { Component } from "react";
import { Column, Columns, Box } from "bloomer";
import Transactions from "../Transactions/Transactions";

import DataInterface from "../../Data";

export default class UserPage extends Component {
	state = { transactions: {} };

	componentDidMount = async () => {
		this.dataInterface = new DataInterface(
			this.props.authInterface.getAuthDetails().username,
			this.props.authInterface.getAuthDetails().password
		);

		this.getTransactions();
	};

	getTransactions = () => {
		this.dataInterface.getTransactions().then(transactions => {
			this.setState({ transactions: transactions });
		});
	};

	render() {
		return (
			<Columns>
				<Column isSize="1/3">
					<Box>
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
	}
}
