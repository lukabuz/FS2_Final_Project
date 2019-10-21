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
	NavbarEnd
} from "bloomer";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Auth from "./Auth.js";
import Login from "./Components/Login/Login";

export class App extends Component {
	state = { isActive: false };

	componentDidMount(){
		let auth = new Auth();
		this.setState({auth: auth})
	}

	toggleNav = () => {
		this.setState({ isActive: !this.state.isActive });
	};

	render() {
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
							<NavbarItem>
								<Link to="/login">Log In</Link>
							</NavbarItem>
						</NavbarStart>
						<NavbarEnd></NavbarEnd>
					</NavbarMenu>
				</Navbar>
				<Container isFluid style={{ marginTop: 10 }}>
					<Switch>
						<Route path="/login">
							<Login authIntefrace={} />
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
