import React, { Component } from "react";
import { Table, Button, Box, Tile } from "bloomer";

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
				{val.from === "ADMIN" ? (
					<td style={{ color: "green", fontWeight: "bold" }}>Deposit</td>
				) : (
					<td>{val.from}</td>
				)}
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
				<Tile isVertical={true}>
					<Tile>
						<div style={{ overflow: "auto" }}>
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
						</div>
					</Tile>
					<hr />
					<Tile>
						<Tile hasTextAlign={"left"} isSize={"4"}></Tile>
						<Tile hasTextAlign={"center"} isSize={"4"}>
							<Tile
								style={{
									alignItems: "center",
									justifyContent: "center",
									display: "flex"
								}}
								isSize={"4"}
							>
								<Button onClick={this.lastPage} isColor="primary">
									Last
								</Button>
							</Tile>
							<Tile
								style={{
									alignItems: "center",
									justifyContent: "center",
									display: "flex"
								}}
								isSize={"4"}
							>
								<span>{this.state.page + " / " + this.state.pages}</span>
							</Tile>
							<Tile
								style={{
									alignItems: "center",
									justifyContent: "center",
									display: "flex"
								}}
								isSize={"4"}
							>
								<Button onClick={this.nextPage} isColor="primary">
									Next
								</Button>
							</Tile>
						</Tile>
						<Tile hasTextAlign={"center"} isSize={"4"}></Tile>
					</Tile>
				</Tile>
			</Box>
		);
	}
}
