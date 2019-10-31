import React, { Component } from "react";
import {
	Column,
	Columns,
	Card,
	CardContent,
	Media,
	MediaLeft,
	Image,
	MediaContent,
	Title,
	Subtitle,
	Modal,
	ModalBackground,
	ModalClose,
	ModalContent,
	Box,
	Field,
	Label,
	Control,
	Input,
	Button
} from "bloomer";
import Transactions from "../Transactions/Transactions";
import Listings from "../Listings/Listings";
import Purchases from "../Purchases/Purchases";

import DataInterface from "../../Data";

export default class UserPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			transactions: {},
			loaded: false,
			sendModalActive: false,
			depositModalActive: false
		};
		this.handleChange = this.handleChange.bind(this);
	}
	componentDidMount = async () => {
		this.dataInterface = new DataInterface(
			this.props.authInterface.getAuthDetails().username,
			this.props.authInterface.getAuthDetails().password
		);

		const userInfo = await this.dataInterface.getInfo();

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

	handleChange = e => {
		this.setState({
			[e.target.name]: e.target.value
		});
	};

	openSendModal = () => {
		this.setState(state => ({ ...state, sendModalActive: true }));
	};

	closeSendModal = () => {
		this.setState(state => ({ ...state, sendModalActive: false }));
	};

	openDepositModal = () => {
		this.setState(state => ({ ...state, depositModalActive: true }));
	};

	closeDepositModal = () => {
		this.setState(state => ({ ...state, depositModalActive: false }));
	};

	load = () => {
		this.setState(state => ({ ...state, loaded: true }));
	};

	send = async () => {
		this.dataInterface
			.sendMoney(this.state.recipient, this.state.sendAmount)
			.then(res => {
				alert(res);
			})
			.catch(e => {
				e.map(val => alert(val));
			});
	};

	deposit = async () => {
		console.log(this.state.depositAmount);
		this.dataInterface
			.depositMoney(this.state.depositAmount)
			.then(res => {
				alert(res);
			})
			.catch(e => {
				e.map(val => alert(val));
			});
	};

	render() {
		if (this.state.loaded) {
			if (this.state.sendModalActive) {
				return (
					<Modal isActive="true">
						<ModalBackground />
						<ModalContent>
							<Box>
								<Title>Send Money</Title>
								<Field>
									<Label>Amount</Label>
									<Control>
										<Input
											name="sendAmount"
											value={this.state.sendAmount}
											onChange={this.handleChange}
											type="number"
											min="1"
											step="1"
											placeholder="Amount"
										/>
									</Control>
								</Field>

								<Field>
									<Label>Recipient:</Label>
									<Control>
										<Input
											name="recipient"
											value={this.state.recipient}
											onChange={this.handleChange}
											type="text"
											min="1"
											placeholder="Username"
										/>
									</Control>
								</Field>

								<Field isGrouped>
									<Control>
										<Button onClick={this.send} isColor="primary">
											Submit
										</Button>
									</Control>
									<Control>
										<Button isLink onClick={this.closeSendModal}>
											Cancel
										</Button>
									</Control>
								</Field>
							</Box>
						</ModalContent>
						<ModalClose onClick={this.closeSendModal} />
					</Modal>
				);
			} else if (this.state.depositModalActive) {
				return (
					<Modal isActive="true">
						<ModalBackground />
						<ModalContent>
							<Box>
								<Title>Deposit Money</Title>
								<Field>
									<Label>Amount</Label>
									<Control>
										<Input
											name="depositAmount"
											value={this.state.depositAmount}
											onChange={this.handleChange}
											type="number"
											min="1"
											step="1"
											placeholder="Amount"
										/>
									</Control>
								</Field>

								<Field isGrouped>
									<Control>
										<Button onClick={this.deposit} isColor="primary">
											Submit
										</Button>
									</Control>
									<Control>
										<Button isLink onClick={this.closeDepositModal}>
											Cancel
										</Button>
									</Control>
								</Field>
							</Box>
						</ModalContent>
						<ModalClose onClick={this.closeDepositModal} />
					</Modal>
				);
			} else {
			}
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
												src={`https://robohash.org/${this.state.userInfo.username}.png`}
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
											<Field isGrouped>
												<Control>
													<Button isLink onClick={this.openSendModal}>
														Send Money
													</Button>
												</Control>
												<Control>
													<Button isLink onClick={this.openDepositModal}>
														Deposit Money
													</Button>
												</Control>
											</Field>
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
					<Column isSize="1/3">
						<Purchases purchases={this.state.purchases} />
					</Column>
				</Columns>
			);
		} else return <div>Loading</div>;
	}
}
