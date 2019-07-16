import React from 'react';
import Navbar from './Dashboard/Navbar';
import { withRouter,Link } from "react-router-dom";
import '../components/Dashboard/Dashboard.css'

const Layout=(props)=>{

        return(
            <>
                <Navbar currRoute={props.location.pathname}/>
                <main> 
                <Link to="/post/add" className="float">
                    <i className="fa fa-plus fa-lg my-float"></i>
                </Link>
                {props.children} </main>
            </>
        )
}

export default withRouter(Layout);