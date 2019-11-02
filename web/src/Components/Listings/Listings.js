import React, { Component } from "react";
import {
	Button,
	CardFooter,
	CardContent,
	Subtitle,
	Title,
	Tag,
	Card,
	Tile
} from "bloomer";

const pageSize = 3;

export default class Listings extends Component {
	constructor(props) {
		super(props);
		const listings = props.listings;
		const pages = Math.ceil(listings.length / pageSize);
		const paginatedListings = this.paginate(listings, 1, pageSize);
		this.state = {
			listings: paginatedListings,
			page: 1,
			pageSize: pageSize,
			pages: pages,
			allListings: listings
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

	newPage = page => {
		if (page < 1 || page > this.state.pages) return;
		const paginatedListings = this.paginate(
			this.state.allListings,
			page,
			this.state.pageSize
		);
		this.setState({
			...this.state,
			listings: paginatedListings,
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

	unixToDateTime = unix => {
		let date = new Date(unix);
		return date.toLocaleString();
	};

	listings = () => {
		const listings = this.state.listings.map((val, index) => (
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
								{val.buyer === "" ? (
									<Tag isSize="large" isColor="info">
										Not Purchased
									</Tag>
								) : (
									<Tag isSize="large" isColor="success">
										Purchased
									</Tag>
								)}
							</Tile>
						</Tile>
					</CardFooter>
				</Card>
				<hr />
			</div>
		));
		return listings;
	};

	render() {
		return (
			<div>
				<Title>Listings</Title>
				{this.listings()}{" "}
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
			</div>
		);
	}
}
