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
	Button
} from "bloomer";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Auth from "./Auth.js";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";

export class App extends Component {
	constructor(props) {
		super(props);
		const auth = new Auth(() => {
			this.updateState();
		});
		auth.initialize();
		this.state = { isActive: false, auth: auth };
	}
	toggleNav = () => {
		this.setState({ isActive: !this.state.isActive });
	};
	updateState = () => {
		this.setState({ isActive: this.state.isActive });
	};

	render() {
		console.log(this.state.auth.authenticated);
		const authenticated = this.state.auth.authenticated || false;
		const authenticatedButton = (
			<NavbarEnd>
				<NavbarItem>
					<Button onClick={this.state.auth.logout} isColor="danger">
						Log Out
					</Button>
				</NavbarItem>{" "}
			</NavbarEnd>
		);
		const unAuthenticatedButton = (
			<NavbarEnd>
				<NavbarItem>
					<Button isColor="">
						<Link to="/login">Log In</Link>
					</Button>
				</NavbarItem>
				<NavbarItem>
					<Button isColor="success">
						<Link to="/register">Register</Link>
					</Button>
				</NavbarItem>
			</NavbarEnd>
		);

		return (
			<Router>
				<Navbar style={{ border: "solid 1px #00D1B2", margin: "0" }}>
					<NavbarBrand>
						<NavbarItem>FSCoin</NavbarItem>
						<NavbarItem></NavbarItem>
						<NavbarBurger
							isActive={this.state.isActive}
							onClick={this.toggleNav}
						/>
					</NavbarBrand>
					<NavbarMenu isActive={this.state.isActive}>
						<NavbarStart>
							<NavbarItem>
								<Link to="/">Home</Link>
							</NavbarItem>
						</NavbarStart>
						<NavbarEnd></NavbarEnd>
					</NavbarMenu>
					{authenticated ? authenticatedButton : unAuthenticatedButton}
				</Navbar>
				<Container isFluid style={{ marginTop: 10 }}>
					<Switch>
						<Route path="/login">
							<Login authInterface={this.state.auth} />
						</Route>
						<Route path="/register">
							<Register authInterface={this.state.auth} />
						</Route>
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
