import React, { Component } from "react";
import {
	Box,
	Title,
	Field,
	Label,
	Control,
	Input,
	Column,
	Button
} from "bloomer";

export default class Login extends Component {
	state = {
		username: "",
		password: ""
	};
	handleChange = e => {
		this.setState({
			[e.target.name]: e.target.value
		});
	};
	login = async () => {
		this.props.authInterface
			.login(this.state.username, this.state.password)
			.then(res => {
				alert("Logged in successfully");
				window.location.href = "/me";
			})
			.catch(e => {
				alert(e);
			});
	};

	render() {
		return (
			<Column isSize="1/3" isOffset={4}>
				<Box>
					<Title> Log In </Title>
					<hr />
					<Field>
						<Label>Username</Label>
						<Control>
							<Input
								type="text"
								placeholder="Username"
								name="username"
								onChange={this.handleChange}
								value={this.state.username}
							/>
						</Control>
					</Field>
					<Field>
						<Label>Password</Label>
						<Control>
							<Input
								type="password"
								placeholder="Password"
								name="password"
								onChange={this.handleChange}
								value={this.state.password}
							/>
						</Control>
					</Field>
					<Field>
						<Control>
							<Button onClick={this.login} isColor="primary">
								Log In
							</Button>
						</Control>
					</Field>
				</Box>
			</Column>
		);
	}
}
