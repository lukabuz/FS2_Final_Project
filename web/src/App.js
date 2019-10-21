import React, { Component } from "react";
import "./App.css";
import {
	Container,
	Navbar,
	NavbarBrand,
	NavbarItem,
	NavbarMenu,
	NavbarBurger,
	NavbarStart,
	NavbarEnd,
	brand
} from "bloomer";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

export class App extends Component {
	state = { isActive: false };

	toggleNav = () => {
		this.setState({ isActive: !this.state.isActive });
	};

	render() {
		return (
			<Router>
				<Navbar style={{ border: "solid 1px #00D1B2", margin: "0" }}>
					<NavbarBrand>
						<NavbarItem>
							<img src={brand} style={{ marginRight: 5 }} /> FSCoin
						</NavbarItem>
						<NavbarItem></NavbarItem>
						<NavbarBurger
							isActive={this.state.isActive}
							onClick={this.toggleNav}
						/>
					</NavbarBrand>
					<NavbarMenu isActive={this.state.isActive} onClick={this.toggleNav}>
						<NavbarStart>
							<NavbarItem>
								<Link to="/">Home</Link>
							</NavbarItem>
						</NavbarStart>
						<NavbarEnd></NavbarEnd>
					</NavbarMenu>
				</Navbar>
				<Container isFluid style={{ marginTop: 10 }}>
					<Switch>
						<Route path="/">
							<Home />
						</Route>
					</Switch>
				</Container>
			</Router>
		);
	}
}

function Home() {
	return <h2>Home</h2>;
}

export default App;
