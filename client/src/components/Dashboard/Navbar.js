import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import { signout } from '../../auth/index';
import { isAuthenticated } from '../../auth/index';
import {searchUser} from '../../auth/apiUser';
import SearchResults from './SearchResults';

const isActive = (history, path) => {
    if (history.location.pathname === path)
        return ({ fontWeight: "bold" });
};

/*export const getUserName=()=>{

    let token=JSON.parse(localStorage.getItem("token"));
    return(token.user);
};*/

class Navbar extends Component {

    constructor(props){
        super(props);
        this.state={
            searchValue:"",
            searchResults:[],
            error:"",
            display:false
        };

        this.handleChange = this.handleChange.bind(this);
        //this.removeSearchResults= this.removeSearchResults.bind(this);
    }

    async handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        await this.setState({
            [name]: value
        });

        const token = isAuthenticated().token;
        if(this.state.searchValue.length>0){
            //console.log(this.state.searchValue.length);
            searchUser(value,token)
            .then(data => {
                //console.log(data.users);
                if (data.error) {
                    this.setState({
                        error: data.error
                    });
                } else {
                    this.setState({ searchResults: data.users ,
                        display:true});
                }

            });
        }
        if(this.state.searchValue.length<1){
            this.setState({display:false});
        }

    }

    /*removeSearchResults(event){
        this.setState({display:false});
    }*/

    render() {
        return (
            <>
                {isAuthenticated().user &&
                    <nav className="navbar navbar-expand-lg mb-5" style={{ display: this.props.currRoute !== '/' && this.props.currRoute !== '/login' ? "" : "none" }}>
                        <a className="navbar-brand appName ml-5" href="/dashboard" style={{ fontSize: "42px",textDecoration:"none" }}>
                            SocialBee
                        </a>
            
                            <div style={{position:"relative"}}>
                            <input className=" mx-auto"  placeholder="Search.." name="searchValue" id="Search" value={this.state.searchValue} onChange={this.handleChange} autoComplete="off"
                           />
                            <SearchResults users={this.state.searchResults} show={this.state.display}/>
                            </div>

                        <ul className="mx-auto" style={{display:"flex",listStyle:"none"}}>
                            <li className="mr-5">

                                <Link className="appName" to={`/user/${isAuthenticated().user._id}`}
                                    id="signedInUser"
                                    style={{ fontSize: "26px", letterSpacing: "3px", fontStyle: "oblique" }}>
                                    Signed in as {isAuthenticated().user.fullName}
                                </Link>
                            </li>
                            <li className=" mr-3 ">
                                <Link className="" to="/">
                                    <i className="far fa-heart fa-2x"></i>
                                </Link >
                            </li>
                            <li className="  mr-3">
                                <Link className="" to={`/user/${isAuthenticated().user._id}`}>
                                    <i className="far fa-user fa-2x"></i>
                                </Link >
                            </li>
                            <li className="dropdown">
                                <Link className=" dropdown-toggle" data-toggle="dropdown" to="#">
                                    <i className="fas fa-cog fa-2x" style={{ color: "black" }}></i> </Link>
                                <div className="dropdown-menu ">
                                    <span className="dropdown-item" style={{cursor:"pointer"}}
                                        onClick={() => signout(() => this.props.history.push('/login'))}>
                                        <i className="fas fa-sign-out-alt"></i>    Logout
                                        </span>
                                    <hr />
                                    <Link className="dropdown-item" to={`/settings/${isAuthenticated().user._id}`} style={isActive(this.props.history, "/settings")}>
                                        <i className="fas fa-user-circle"></i> Account Settings </Link >
                                </div>
                            </li>
                        </ul>
                    </nav>}
            </>
        )
    }

}

export default withRouter(Navbar);