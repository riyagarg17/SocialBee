import React from 'react';
import { Link} from 'react-router-dom';
import './Follow.css';


const Followers = (props) => {

    const photoUrl = (id) => {

        return `${
            process.env.REACT_APP_API_URL}/image/${id}`;
    }

    return (

        <div className="mainDiv">
            <h1 style={{ fontSize: "16px", textAlign: "center", fontWeight: "600" }}> Followers</h1>
            <hr />
            <ul style={{ padding: "0", marginBottom: "0", marginTop: "4px", listStyle: "none" }}>
                {props.followers
                    .map((singleUser, i) =>
                        <Link to={`/user/${singleUser._id}`} style={{ textDecoration: "none" }} key={i}>
                            <li className=" mb-2" >

                                <div style={{ display: "flex" }}>

                                    {singleUser.image ? (

                                        <img alt="profile" src={photoUrl(singleUser._id)} style={{ borderRadius: "50%", width: "50px", height: "50px" }} id="userImage" />
                                    ) : (
                                            <div className="noUserImg">

                                            </div>
                                        )
                                    }
                                    <div className="ml-3">

                                        <p className="searchResultUsername" style={{ fontSize: "16px" }}>
                                            {singleUser.userName}
                                        </p>
                                        <p className="searchResultFullname" style={{ fontSize: "16px" }}>
                                            {singleUser.userName}</p>
                                    </div>

                                </div>
                            </li>
                        </Link>)
                }
            </ul>

        </div>

    )
};

export default Followers;