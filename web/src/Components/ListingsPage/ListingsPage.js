import React, { Component } from "react";
import {
	Card,
	CardContent,
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
	Button,
	Section,
	Tag,
	CardFooter,
	Tile,
	TextArea
} from "bloomer";

import DataInterface from "../../Data";

export default class ListingsPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			auth: false,
			loaded: false,
			listings: [],
			modalActive: false
		};
	}

	componentDidMount = async () => {
		this.dataInterface = new DataInterface(
			this.props.authInterface.getAuthDetails().username,
			this.props.authInterface.getAuthDetails().password
		);

		let listings = await this.dataInterface.getAllListings();

		this.setState({
			auth: this.props.authInterface.authenticated,
			loaded: true,
			listings: listings,
			filteredListings: listings.filter(val => {
				return val.buyer === "";
			}),
			filter: "Showing listings that are not sold"
		});
	};

	toggleModal = () => {
		if (!this.props.authInterface.authenticated) {
			window.location.href = "/login";
			return;
		}
		this.setState({ ...this.state, modalActive: !this.state.modalActive });
	};

	handleChange = e => {
		this.setState({
			[e.target.name]: e.target.value
		});
	};

	filter = opt => {
		let filter = "Showing listings that are ";
		if (opt === "sold" || opt == "not sold") {
			filter += opt;
		} else {
			filter = "Showing all listings";
		}
		let filteredListings = this.state.listings.filter(value => {
			switch (opt) {
				case "sold":
					return value.buyer !== "";
				case "not sold":
					return value.buyer === "";
				default:
					return true;
			}
		});
		this.setState({
			...this.state,
			filteredListings: filteredListings,
			filter: filter
		});
	};

	purchase = listingId => {
		let confirmation = window.confirm(
			"Are you sure you want to buy this listing?"
		);
		if (!confirmation) return;
		this.dataInterface
			.purchaseListing(listingId)
			.then(res => {
				alert(res);
			})
			.catch(e => {
				alert(e);
			});
	};

	createListing = () => {
		let confirmation = window.confirm(
			"Are you sure you want to create this listing?"
		);
		if (!confirmation) return;
		this.dataInterface
			.createListing(
				this.state.name,
				this.state.description,
				this.state.payload,
				this.state.price
			)
			.then(res => {
				alert(res);
			})
			.catch(e => {
				e.map(val => alert(val));
			});
	};

	unixToDateTime = unix => {
		let date = new Date(unix);
		return date.toLocaleString();
	};

	listings = () => {
		const listings = this.state.filteredListings.map((val, index) => {
			let purchaseButton = "";
			if (this.props.authInterface.authenticated) {
				if (this.props.authInterface.username === val.seller) {
					purchaseButton = (
						<Tag
							isSize="large"
							isColor={val.buyer === "" ? "danger" : "success"}
						>
							{val.buyer === "" ? "Not Purchased" : "Purchased"}
						</Tag>
					);
				} else {
					if (val.buyer === "") {
						purchaseButton = (
							<Tag
								isSize="large"
								onClick={() => {
									this.purchase(val.key);
								}}
								isColor="info"
							>
								Purchase
							</Tag>
						);
					} else {
						purchaseButton = (
							<Tag isSize="large" isColor="success">
								Purchased
							</Tag>
						);
					}
				}
			} else {
				purchaseButton = (
					<Tag isSize="large" isColor={val.buyer === "" ? "danger" : "success"}>
						{val.buyer === "" ? "Not Purchased" : "Purchased"}
					</Tag>
				);
			}

			return (
				<div key={index}>
					<Card>
						<CardContent>
							<Title>{val.itemName}</Title>
							<Subtitle>{val.itemDescription}</Subtitle>
						</CardContent>
						<CardFooter>
							<Tile style={{ marginTop: "10px", marginBottom: "10px" }}>
								<Tile
									isSize="6"
									hasTextAlign="centered"
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center"
									}}
								>
									<ul>
										<li>Price: {val.itemPrice}</li>
										<li>Date: {this.unixToDateTime(val.listingDate)}</li>
										<li>By: {val.seller}</li>
									</ul>
								</Tile>
								<Tile
									isSize="6"
									hasTextAlign="centered"
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center"
									}}
								>
									{purchaseButton}
								</Tile>
							</Tile>
						</CardFooter>
					</Card>
					<hr />
				</div>
			);
		});
		return listings;
	};

	render() {
		if (this.state.loaded) {
			if (this.state.modalActive) {
				return (
					<Modal isActive="true">
						<ModalBackground />
						<ModalContent>
							<Box>
								<Title>Create Listing</Title>
								<Field>
									<Label>Name</Label>
									<Control>
										<Input
											name="name"
											value={this.state.name}
											onChange={this.handleChange}
											type="text"
											min="1"
											max="40"
											placeholder="Item Name"
										/>
									</Control>
								</Field>

								<Field>
									<Label>Description</Label>
									<Control>
										<TextArea
											name="description"
											value={this.state.description}
											onChange={this.handleChange}
											min="1"
											max="2000"
											placeholder="Item Description"
										/>
									</Control>
								</Field>

								<Field>
									<Label>Payload</Label>
									<Control>
										<TextArea
											name="payload"
											value={this.state.payload}
											onChange={this.handleChange}
											min="1"
											max="50000"
											placeholder="String Being Sold"
										/>
									</Control>
								</Field>

								<Field>
									<Label>Price</Label>
									<Control>
										<Input
											name="price"
											value={this.state.price}
											onChange={this.handleChange}
											type="number"
											min="1"
											step="1"
											placeholder="Item Price"
										/>
									</Control>
								</Field>

								<Field isGrouped>
									<Control>
										<Button onClick={this.createListing} isColor="primary">
											Submit
										</Button>
									</Control>
									<Control>
										<Button isLink onClick={this.toggleModal}>
											Cancel
										</Button>
									</Control>
								</Field>
							</Box>
						</ModalContent>
						<ModalClose onClick={this.toggleModal} />
					</Modal>
				);
			} else {
				return (
					<Section>
						<Field>
							<Control>
								<Button onClick={this.toggleModal} isColor="success">
									Create Listing
								</Button>
							</Control>
						</Field>
						<Title>Listings</Title>
						<Subtitle>{this.state.filter}</Subtitle>
						<Field isGrouped>
							<Control>
								<Button
									onClick={() => this.filter("not sold")}
									isColor="primary"
								>
									Not sold
								</Button>
							</Control>
							<Control>
								<Button onClick={() => this.filter("sold")} isColor="primary">
									Sold
								</Button>
							</Control>
							<Control>
								<Button onClick={() => this.filter("all")} isColor="primary">
									All
								</Button>
							</Control>
						</Field>
						{this.listings()}
					</Section>
				);
			}
		} else {
			return <div>Loading...</div>;
		}
	}
}
