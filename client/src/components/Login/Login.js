import React from 'react';
import Loginform from './LoginForm';
import {Link} from 'react-router-dom';
import './Login.css';

const login=()=>{

    return(
            <div className=" loginDiv mt-5 mb-3">
                <h2 className="appName"> SocialBee</h2>
                <Loginform/>
                <div className="orBox mb-3">
                    <div className="orLine"> </div>
                    <div className="orText"> OR</div>
                    <div className="orLine"> </div>
                </div>
                <button className="btn btn-danger btn-block mt-3 mb-3"> 
                    <i className="fab fa-google-plus-g"></i> Login with google 
                </button>
                <Link to="/" className="forgotPwd mb-2 btn "> Forgot Password? </Link>
                <div className="SignupDiv">
                    <p className="signupText">Don't have an account?
                        <Link to="/"> Signup </Link>
                    </p>
                </div>
            </div>
       
    )

};

export default login;