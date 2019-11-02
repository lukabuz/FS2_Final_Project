import React, { Component } from "react";
import { Section, Columns, Column, Title, Tile, Image } from "bloomer";
import DataInterface from "../../Data";
import Transactions from "../Transactions/Transactions";

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			transactions: [],
			loaded: false
		};
	}

	componentDidMount = async () => {
		this.dataInterface = new DataInterface(
			this.props.authInterface.getAuthDetails().username,
			this.props.authInterface.getAuthDetails().password
		);

		const transactions = await this.dataInterface.getAllTransactions();

		this.setState(state => ({
			...state,
			transactions: transactions,
			loaded: true
		}));
	};

	render() {
		return (
			<div>
				<Section hasTextAlign="center">
					<Columns>
						<Column
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center"
							}}
						>
							<Title>What is FSCoin?</Title>
						</Column>
					</Columns>
					<br />
					<Columns>
						<Column
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								flexDirection: "column"
							}}
							isSize="1/2"
						>
							<Tile
								style={{
									width: "100%",
									heigh: "100%",
									display: "flex",
									alignItems: "center",
									justifyContent: "center"
								}}
							>
								<Image isSize="64x64" src={"/Static/money.png"} />
							</Tile>
							<Tile
								style={{
									marginTop: "20px",
									width: "100%",
									heigh: "100%",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									textAlign: "center"
								}}
							>
								<ul>
									<li>
										- Deposit money into the system using Cryptocurrencies or
										bank cards.
									</li>
									<li>- Send money to other users.</li>
									<li>- Recieve money from other users.</li>
									<li>- View all transactions within the system</li>
								</ul>
							</Tile>
						</Column>
						<Column
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								flexDirection: "column"
							}}
							isSize="1/2"
						>
							<Tile
								style={{
									width: "100%",
									heigh: "100%",
									display: "flex",
									alignItems: "center",
									justifyContent: "center"
								}}
							>
								<Image isSize="64x64" src={"/Static/online-shop.png"} />
							</Tile>
							<Tile
								style={{
									marginTop: "20px",
									width: "100%",
									heigh: "100%",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									textAlign: "center"
								}}
							>
								<ul>
									<li>
										- Integrated marketplace that uses FSCoins as a payment
										solution.
									</li>
									<li>
										- Create listings and sell game keys, wallet private keys,
										or anything that can be put in a string.
									</li>
									<li>- Purchase listings from other users.</li>
									<li>- View and filter all listings</li>
								</ul>
							</Tile>
						</Column>
					</Columns>
				</Section>
				<Section>
					<Columns>
						<Column
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center"
							}}
						>
							<Title>Recent Transactions</Title>
						</Column>
					</Columns>
					<br />
					<Columns
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							width: "auto"
						}}
					>
						<Column
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center"
							}}
							isSize="1"
						>
							{this.state.loaded ? (
								<Transactions
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										margin: "auto"
									}}
									transactions={this.state.transactions}
								/>
							) : (
								""
							)}
						</Column>
					</Columns>
				</Section>
			</div>
		);
	}
}
