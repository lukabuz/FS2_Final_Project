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
import UserPage from "./Components/UserPage/UserPage";

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

	render() {
		const authenticatedButton = logout => {
			return (
				<NavbarEnd>
					<NavbarItem>
						<Button onClick={logout} isColor="danger">
							Log Out
						</Button>
					</NavbarItem>
				</NavbarEnd>
			);
		};
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
		// this.state.loading
		if (!this.state.loading) {
			const authenticated = this.state.auth.authenticated;
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

								{authenticated ? (
									<NavbarItem>
										<Link to="/me">My Page</Link>
									</NavbarItem>
								) : (
									""
								)}
							</NavbarStart>
							{authenticated
								? authenticatedButton(this.state.auth.logout)
								: unAuthenticatedButton}
						</NavbarMenu>
					</Navbar>
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
							<Route path="/">
								<Home />
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

function Home() {
	return <h2>Home</h2>;
}

export default App;
