import React, { Component } from 'react';
import './Login.css';
import { Redirect } from 'react-router-dom';
import {loginUser} from '../../auth/index';

class loginForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            error: "",
            redirect: false,
            loading:false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.authenticate = this.authenticate.bind(this);
    }
    authenticate(jwt,next){

        if(typeof window!=='undefined'){
            localStorage.setItem("token",JSON.stringify(jwt));
            next();
        }
    }
    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        //this.setState({error:""});
        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({loading:true});
        const { email, password } = this.state;
        const user = {
            email,
            password
        };

        loginUser(user)
            .then(data => {
                //console.log(data);
                if (data.error)
                    this.setState({ error: data.error ,loading:false});
                else {
                    this.authenticate(data,()=>{
                        this.setState({
                            redirect: true
                        });
                    });
                }
            });

    }

    render() {
        if (this.state.redirect) {
            return <Redirect to='/dashboard' />
        }

        return (
            <div>
                <span style={{ display: this.state.error ? " " : "none" }} className="error text-danger"> {this.state.error} </span>
                <form className="loginForm" onSubmit={this.handleSubmit}>
                    <input type="email" name="email" className="form-control" placeholder="Email" onChange={this.handleChange} value={this.state.email} />

                    <input type="password" name="password" className="form-control" placeholder="Password.." onChange={this.handleChange} value={this.state.password} />

                    <button className="btn btn-primary btn-block mb-2" id="login-btn">Login</button>
                </form>
            </div>
        )
    }
}

export default loginForm;