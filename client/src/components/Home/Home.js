import React,{Component} from 'react';
import iphoneImg1 from '../../images/iphone1.png';
import iphoneImg2 from '../../images/iphone2.png';
import './Home.css';
import {Link} from 'react-router-dom';
import SlideShow from './SlideShow';
import Signup from './Signup';

class home extends Component{

    render(){
        return(
            <div className="main"> 
            <div className="imgContainer"> 
                    <img src={iphoneImg1} alt="iphone" className="homeImg1 "/>
                    <img src={iphoneImg2} alt="iphone" className="homeImg2"/> 
                    <SlideShow/>
            </div>
            <div className=" signupDiv mt-3 mb-3">
                <h2 className="appName"> SocialBee</h2>
                <p className="signText">Sign up to see photos and videos from your friends.</p> 
                <button className="btn btn-danger mt-3 mb-2" id="googleLogin"> 
                    <i className="fab fa-google-plus-g"></i> Login with google 
                </button>
                <div className="orBox mb-3">
                    <div className="orLine"> </div>
                    <div className="orText"> OR</div>
                    <div className="orLine"> </div>
                </div>
                <Signup/>
                <div className="LoginDiv">
                    <p className="loginText"> Already have an account?
                        <Link to="/login"> Log in </Link>
                    </p>
                </div>
            </div>
       </div>
        )
    }
}

export default home;