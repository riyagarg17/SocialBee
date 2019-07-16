import React from 'react';
import './SearchResults.css';
import { Link } from 'react-router-dom';

const searchResults = (props) => {

    const photoUrl = (id) => {

        return `${
            process.env.REACT_APP_API_URL}/image/${id}`;
    }

    const closeSearchBox=()=>{

        document.getElementById("searchBox").style.display="none";
    };

    return (
        <div className="searchResultDiv" style={{ display: props.show ? "" : "none", paddingBottom: "0" }} onMouseLeave={closeSearchBox} id="searchBox">
            <ul style={{ padding: "0", marginBottom: "0", marginTop: "4px" }}>
                {props.users
                    .map((singleUser, i) =>
                        <Link to={`/user/${singleUser._id}`} style={{ textDecoration: "none" }} key={i}>
                            <li className="eachUser mb-2" >

                                <div style={{ display: "flex" }}>
                                    {singleUser.image ? (

                                        <img alt="profile" src={photoUrl(singleUser._id)} style={{ borderRadius: "50%", width: "40px", height: "40px" }} />
                                    ) : (
                                            <div className="noUserImg"
                                            style={{width: "40px", height: "40px" }}/>
                                        )
                                    }

                                    <div className="ml-3">

                                        <p className="searchResultUsername">
                                            {singleUser.userName}
                                        </p>
                                        <p className="searchResultFullname">
                                            {singleUser.fullName}</p>
                                    </div>
                                </div>


                            </li>
                        </Link>)
                }
            </ul>

        </div>
    )
};

export default searchResults;