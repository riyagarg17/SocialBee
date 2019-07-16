import React, { Component } from 'react';
import './SinglePostModal.css';
import Backdrop from '../Modal/Backdrop';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../../auth/index';
import { addComment,deleteComment } from '../../auth/apiPost';

class SinglePostModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: "",
            error: "",
            post: {},
            postImage: "",
            commentBody: "",
            comments: []
        };

        this.getPostUserImage = this.getPostUserImage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete= this.handleDelete.bind(this);
        this.hasAutherization = this.hasAutherization.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        //this.postData.set(name,value);
        this.setState({ [name]: value });
    }

    handleSubmit(event) {

        // console.log("handle Submit called");
        event.preventDefault();
        //console.log("current model",this.state.currentModal);
        const user = isAuthenticated().user;
        const post = this.props.post;
        const token = isAuthenticated().token;
        const comment = this.state.commentBody;
        addComment(user._id, token, post._id, comment)
            .then(data => {
                //console.log("data recieved after submit",data.user);
                if (data.error)
                    this.setState({ error: data.error });
                else {
                    //console.log(data);
                    this.props.updateComment(post._id, data.comments);
                    this.setState({ commentBody: "" });

                    /*this.setState(prevState => ({
                       post: [
                           ...prevState.post,
                           data
                       ],
                   }));  
                   console.log("set state after calling add comment fn",this.state.comments);     */
                }
            });

    }


    handleDelete(comment) {

        //console.log("handle delete called",comment);
        const user = isAuthenticated().user;
        const post = this.props.post;
        const token = isAuthenticated().token;
        deleteComment(user._id, token, post._id, comment)
            .then(data => {
                //console.log("data recieved after submit",data.user);
                if (data.error)
                    this.setState({ error: data.error });
                else {
                    //console.log(data);
                    this.props.updateComment(post._id, data.comments);
                    //this.setState({ commentBody: "" });

                }
            });

    }

    hasAutherization(postedBy) {
        //console.log("hasauth called");
        return (isAuthenticated().user && isAuthenticated().user._id === postedBy);
    }

    getPostUserImage(userID) {

        const photoUrl = `${
            process.env.REACT_APP_API_URL}/image/${userID}`;

        return photoUrl;
    }

    componentDidMount() {

        //console.log("mounted comments",this.props.comments);
    }


    render() {

        const post = this.props.post;
        const comments = this.props.comments;
        const singlePostPhoto = `${
            process.env.REACT_APP_API_URL}/postImage/${post._id}`;


        //const {post}=this.state;

        return (
            <>
                <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
                <div className="postModal" style={{
                    transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: this.props.show ? '1' : '0'
                }}>
                    <div className="SinglePostContainer">
                        <div className="sideContainer mr-2">
                            <img src={singlePostPhoto} alt="postImage" className="singlePostImage" />
                        </div>
                        <article style={{ width: "60%", height: "300px" }}>
                            <div className="singlePostHeader mt-2">
                                {post.postedBy.image ? (

                                    <img alt="profile" src={this.getPostUserImage(post.postedBy._id)} style={{ borderRadius: "50%", width: "40px", height: "40px" }} />
                                ) : (
                                        <div className="noUserImg"
                                            style={{ width: "40px", height: "40px" }} />
                                    )
                                }
                                <div className="ml-3 ">
                                <Link to={`/user/${post.postedBy._id}`} style={{ textDecoration: "none" }}>
                                    <p className="searchResultUsername ">
                                        {post.postedBy.userName}
                                    </p>
                                    <p className="searchResultFullname">
                                        {post.postedBy.fullName}</p>
                                </Link>
                                </div>

                            </div>
                            <div className="commentSection">
                                <ul style={{ padding: "0", marginBottom: "0", marginTop: "4px" }}>
                                    {comments
                                        .map((comment, i) =>
                                            
                                                <li className="eachComment mb-2" >

                                                    <div style={{ display: "flex" }}>
                                                        {comment.commentUser.image ? (

                                                            <img alt="profile" src={this.getPostUserImage(comment.commentUser._id)} style={{ borderRadius: "50%", width: "40px", height: "40px" }} />
                                                        ) : (
                                                                <div className="noUserImg"
                                                                    style={{ width: "40px", height: "40px" }} />
                                                            )
                                                        }

                                                        <div className="ml-3" style={{ display: "flex" }}>

                                                        <Link to={`/user/${comment.commentUser._id}`} style={{ textDecoration: "none" }} key={i}>
                                                            <p className="searchResultUsername commentPostedBy">
                                                                {comment.commentUser.userName}
                                                            </p>
                                                        </Link>
                                                            <p className="searchResultFullname commentBody">
                                                                {comment.commentBody}</p>
                                                        </div>
                                                        {this.hasAutherization(comment.commentUser._id) &&
                                                            <div className="deleteComment">
                                                                <i className="fas fa-times" onClick={()=>this.handleDelete(comment)}></i>
                                                            </div>
                                                        }
                                                    </div>


                                                </li>
                                            )
                                    }
                                </ul>

                            </div>
                            <div className="addCommentSection">
                                <input type="text" name="commentBody" placeholder="Add a comment..." className="addCommentInput" onChange={this.handleChange} value={this.state.commentBody}>
                                </input>
                                <button className="btn submitComment" onClick={this.handleSubmit}> Post </button>
                            </div>
                        </article>

                    </div>


                </div>

            </>
        )
    }
}

export default SinglePostModal;
