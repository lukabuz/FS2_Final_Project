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

export default class Register extends Component {
	state = {
		username: "",
		password: "",
		email: ""
	};
	handleChange = e => {
		this.setState({
			[e.target.name]: e.target.value
		});
	};
	register = async () => {
		this.props.authInterface
			.register(this.state.username, this.state.email, this.state.password)
			.then(res => {
				alert(res);
			})
			.catch(e => {
				alert(e);
			});
	};
	render() {
		return (
			<Column isSize="1/3" isOffset={4}>
				<Box>
					<Title> Register </Title>
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
						<Label>Email</Label>
						<Control>
							<Input
								type="text"
								placeholder="Email"
								name="email"
								onChange={this.handleChange}
								value={this.state.email}
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
							<Button onClick={this.register} isColor="primary">
								Register
							</Button>
						</Control>
					</Field>
				</Box>
			</Column>
		);
	}
}
