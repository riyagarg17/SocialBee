import React, { Component } from "react";
import "./Home.css";
import { signupUser } from "../../auth/index";
import { Redirect } from "react-router-dom";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      userName: "",
      fullName: "",
      error: "",
      redirect: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ error: "" });
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { email, password, userName, fullName } = this.state;
    const user = {
      email,
      password,
      userName,
      fullName
    };
    signupUser(user).then(data => {
      //console.log(data);
      if (data.error) this.setState({ error: data.error });
      else {
        this.setState({
          email: "",
          password: "",
          userName: "",
          fullName: "",
          error: "",
          redirect: true
        });
      }
    });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/login" />;
    }
    return (
      <>
        <span
          style={{ display: this.state.error ? " " : "none" }}
          className="error text-danger"
        >
          {" "}
          {this.state.error}{" "}
        </span>
        <form className="signupForm" onSubmit={this.handleSubmit}>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email"
            onChange={this.handleChange}
            value={this.state.email}
          />

          <input
            type="text"
            name="fullName"
            className="form-control"
            placeholder="Full Name"
            onChange={this.handleChange}
            value={this.state.fullName}
          />

          <input
            type="text"
            name="userName"
            className="form-control"
            placeholder="User Name"
            onChange={this.handleChange}
            value={this.state.userName}
          />

          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Password.."
            onChange={this.handleChange}
            value={this.state.password}
          />

          <button className="btn btn-primary btn-block mb-2" id="signup-btn">
            Sign Up
          </button>
        </form>
      </>
    );
  }
}

export default Signup;
