import React, { Component } from "react";
import {
	Button,
	Box,
	CardFooter,
	CardContent,
	Title,
	Card,
	Tile
} from "bloomer";

const pageSize = 3;

export default class Purchases extends Component {
	constructor(props) {
		super(props);
		const purchases = props.purchases;
		const pages = Math.ceil(purchases.length / pageSize);
		const paginatedPurchases = this.paginate(purchases, 1, pageSize);
		this.state = {
			purchases: paginatedPurchases,
			page: 1,
			pageSize: pageSize,
			pages: pages,
			allPurchases: purchases
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
		const paginatedPurchases = this.paginate(
			this.state.allPurchases,
			page,
			this.state.pageSize
		);
		this.setState({
			...this.state,
			purchases: paginatedPurchases,
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

	purchases = () => {
		const purchases = this.state.purchases.map((val, index) => (
			<div key={index}>
				<Card>
					<CardContent>
						<Title>{val.listingObject.itemName}</Title>

						<Box>
							<Title>Purchase Contents:</Title>
							{val.itemPayload}
						</Box>
					</CardContent>
					<CardFooter>
						<Tile
							isSize="6"
							hasTextAlign="centered"
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center"
							}}
						>
							<ul style={{ margin: "20px" }}>
								<li>Price: {val.listingObject.itemPrice}</li>
								<li>Date: {this.unixToDateTime(val.date)}</li>
							</ul>
						</Tile>
					</CardFooter>
				</Card>
				<hr />
			</div>
		));
		return purchases;
	};

	render() {
		return (
			<div>
				<Title>Purchases</Title>
				{this.purchases()}{" "}
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
