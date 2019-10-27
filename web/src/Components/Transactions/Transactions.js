import React, { Component } from "react";
import { Table, Button, Box, Columns, Column } from "bloomer";

const pageSize = 5;

export default class Transactions extends Component {
	constructor(props) {
		super(props);
		const transactions = props.transactions;
		const pages = Math.ceil(transactions.length / pageSize);
		const paginatedTransactions = this.paginate(transactions, 1, pageSize);
		this.state = {
			transactions: paginatedTransactions,
			page: 1,
			pageSize: pageSize,
			pages: pages,
			allTransactions: transactions
		};
	}

	paginate(array, pageNumber, pageSize) {
		--pageNumber;
		return array.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
	}

	unixToDateTime = unix => {
		let date = new Date(unix);
		return date.toLocaleString();
	};

	table = () => {
		const table = this.state.transactions.map((val, index) => (
			<tr key={index}>
				<td>{index}</td>
				<td>{val.to}</td>
				<td>{this.unixToDateTime(val.date)}</td>
				<td>{val.amount}</td>
				<td>{val.from}</td>
			</tr>
		));
		return table;
	};

	newPage = page => {
		if (page < 1 || page > this.state.pages) return;
		const paginatedTransactions = this.paginate(
			this.state.allTransactions,
			page,
			this.state.pageSize
		);
		console.log(paginatedTransactions);
		console.log(this.state.allTransactions);
		console.log(page);
		console.log(this.state.pageSize);
		this.setState({
			...this.state,
			transactions: paginatedTransactions,
			page: page
		});
	};

	nextPage = () => {
		let newPage = this.state.page + 1;
		this.newPage(newPage);
	};

	lastPage = () => {
		let newPage = this.state.page - 1;
		this.newPage(newPage);
	};

	render() {
		return (
			<Box>
				<Table isBordered={true} isStriped={true} isFullWidth={true}>
					<thead>
						<tr>
							<th>#</th>
							<th>To</th>
							<th>Date</th>
							<th>Amount</th>
							<th>From</th>
						</tr>
					</thead>
					<tbody>{this.table()}</tbody>
				</Table>
				<Columns>
					<Column hasTextAlign={"center"} isSize={"1/3"}>
						<Button onClick={this.lastPage} isColor="primary">
							Last
						</Button>
					</Column>
					<Column hasTextAlign={"center"} isSize={"1/3"}>
						{this.state.page + " / " + this.state.pages}
					</Column>
					<Column hasTextAlign={"center"} isSize={"1/3"}>
						<Button onClick={this.nextPage} isColor="primary">
							Next
						</Button>
					</Column>
				</Columns>
			</Box>
		);
	}
}
