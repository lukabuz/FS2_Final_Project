import React, { Component } from "react";
import "./App.css";
import {
	Container,
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
import UserPage from "./Components/UserPage/UserPage";
import ListingsPage from "./Components/ListingsPage/ListingsPage";
import Home from "./Components/Home/Home";

export class App extends Component {
	state = { isActive: false, loading: true };

	async componentDidMount() {
		const auth = new Auth();
		await auth.initialize(() => {
			this.setState();
		});
		await this.setState({ auth: auth });
		this.loadedCallback();
	}

	loadedCallback = () => {
		this.setState({ loading: false });
	};

	toggleNav = () => {
		this.setState({ isActive: !this.state.isActive });
	};

	logout = () => {
		this.state.auth.logout();
		window.location.href = "/";
	};

	render() {
		const authenticatedButton = logout => {
			return (
				<NavbarEnd>
					<NavbarItem>
						<NavbarItem>
							<Link to="/me" style={{ color: "black" }}>
								<Button isColor="info">Dashboard</Button>
							</Link>
						</NavbarItem>
						<Button
							onClick={logout}
							isColor="danger"
							style={{ color: "black" }}
						>
							Log Out
						</Button>
					</NavbarItem>
				</NavbarEnd>
			);
		};
		const unAuthenticatedButton = (
			<NavbarEnd>
				<NavbarItem>
					<Button isColor="link">
						<Link to="/login" style={{ color: "black" }}>
							Log In
						</Link>
					</Button>
				</NavbarItem>
				<NavbarItem>
					<Button isColor="success">
						<Link to="/register" style={{ color: "black" }}>
							Register
						</Link>
					</Button>
				</NavbarItem>
			</NavbarEnd>
		);
		// this.state.loading
		if (!this.state.loading) {
			const authenticated = this.state.auth.authenticated;
			return (
				<Router>
					<nav className="navbar is-dark">
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
									<Button isColor="link">
										<Link to="/" style={{ color: "black" }}>
											Home
										</Link>
									</Button>
								</NavbarItem>
								<NavbarItem>
									<Button isColor="link">
										<Link to="/listings" style={{ color: "black" }}>
											Listings
										</Link>
									</Button>
								</NavbarItem>
							</NavbarStart>
							{authenticated
								? authenticatedButton(this.logout)
								: unAuthenticatedButton}
						</NavbarMenu>
					</nav>
					<Container isFluid style={{ marginTop: 10 }}>
						<Switch>
							<Route path="/login">
								<Login authInterface={this.state.auth} />
							</Route>

							<Route path="/register">
								<Register authInterface={this.state.auth} />
							</Route>
							<Route path="/me">
								<UserPage authInterface={this.state.auth} />
							</Route>
							<Route path="/listings">
								<ListingsPage authInterface={this.state.auth} />
							</Route>
							<Route path="/">
								<Home authInterface={this.state.auth} />
							</Route>
						</Switch>
					</Container>
				</Router>
			);
		} else {
			return (
				<div className="spinnerContainer">
					<div className="sk-cube-grid">
						<div className="sk-cube sk-cube1"></div>
						<div className="sk-cube sk-cube2"></div>
						<div className="sk-cube sk-cube3"></div>
						<div className="sk-cube sk-cube4"></div>
						<div className="sk-cube sk-cube5"></div>
						<div className="sk-cube sk-cube6"></div>
						<div className="sk-cube sk-cube7"></div>
						<div className="sk-cube sk-cube8"></div>
						<div className="sk-cube sk-cube9"></div>
					</div>
				</div>
			);
		}
	}
}

export default App;
