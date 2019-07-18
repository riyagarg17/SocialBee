import React, { Component } from "react";
import "./Dashboard.css";
import { isAuthenticated } from "../../auth/index";
import { Link } from "react-router-dom";
import { getPosts, likeUnlikePost } from "../../auth/apiPost";
import SinglePostModal from "./SinglePostModal";
import unliked from "../../images/unliked.png";
import comment from "../../images/comment.png";
import liked from "../../images/liked.png";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      error: "",
      posts: [],
      redirectToProfile: false,
      singlePost: false,
      currentSinglePost: "",
      loading: true,
      message: ""
    };
    this.renderPosts = this.renderPosts.bind(this);
    this.getPostImage = this.getPostImage.bind(this);
    this.getPostUserImage = this.getPostUserImage.bind(this);
    this.handleLikeUnlike = this.handleLikeUnlike.bind(this);
    this.checkLiked = this.checkLiked.bind(this);
    this.openSinglePostModal = this.openSinglePostModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.returnModal = this.returnModal.bind(this);
    this.updateComment = this.updateComment.bind(this);
  }

  renderPosts(posts) {
    if (this.state.loading) {
      return <div className="loader">Loading...</div>;
    } else if (this.state.message) {
      return <p className="lead text-center"> {this.state.message} </p>;
    } else {
      return (
        <div className="row container mx-auto">
          {posts.map((post, index) => (
            <div
              className="card col-md-auto ml-5 mr-4 mb-4 offset-md-4"
              key={index}
            >
              {this.returnModal(post)}
              <div className="postHeader">
                {post.postedBy.image ? (
                  <img
                    alt="profile"
                    src={this.getPostUserImage(post.postedBy._id)}
                    style={{
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px"
                    }}
                  />
                ) : (
                  <div
                    className="noUserImg"
                    style={{ width: "40px", height: "40px" }}
                  />
                )}
                <div className="ml-3 mt-2">
                  <Link
                    to={`/user/${post.postedBy._id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <p className="searchResultUsername ">
                      {post.postedBy.userName}
                    </p>
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <img
                  src={this.getPostImage(post._id)}
                  alt="postImage"
                  className="postImage"
                />
              </div>

              <div className="postFooter mt-2">
                <div style={{ display: "flex" }}>
                  {this.checkLiked(post) ? (
                    <img
                      src={liked}
                      className="postFooterIcons mr-2"
                      id="likeButton"
                      onClick={() => this.handleLikeUnlike(post._id)}
                      alt=""
                    />
                  ) : (
                    <img
                      src={unliked}
                      className="postFooterIcons mr-2"
                      id="likeButton"
                      onClick={() => this.handleLikeUnlike(post._id)}
                      alt=""
                    />
                  )}

                  <img
                    src={comment}
                    className="postFooterIcons ml-2"
                    alt=""
                    onClick={() => this.openSinglePostModal(post._id)}
                  />
                </div>
                <div className="searchResultUsername ml-1 mt-2">
                  {post.likedBy ? (
                    <> {post.likedBy.length} Likes</>
                  ) : (
                    <> 0 Likes </>
                  )}
                </div>
                <div className="captionSection" style={{ display: "flex" }}>
                  <Link
                    to={`/user/${post.postedBy._id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <p className="searchResultUsername postedBy ml-1 mt-2">
                      {post.postedBy.userName}
                    </p>
                  </Link>
                  <p className="postCaption ml-1 mt-2">{post.caption}</p>
                </div>
                {post.comments.length !== 0 ? (
                  <div>
                    {post.comments.length === 1 ? (
                      <p
                        className="postCaption"
                        onClick={() => this.openSinglePostModal(post._id)}
                        style={{ cursor: "pointer" }}
                      >
                        {" "}
                        View Comment{" "}
                      </p>
                    ) : (
                      <p
                        className="postCaption"
                        onClick={() => this.openSinglePostModal(post._id)}
                        style={{ cursor: "pointer" }}
                      >
                        {" "}
                        View all {post.comments.length} Comments{" "}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="postCaption"> This post has no comments yet </p>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }
  }
  checkLiked(post) {
    //console.log("checkLiked called",post);
    const token = isAuthenticated();
    let match = false;
    if (post.likedBy) {
      post.likedBy.find(loggedInUser => {
        //console.log("check follow fn called",follower._id===token.user._id);
        match = loggedInUser === token.user._id;
      });
    }

    return match;
  }

  handleLikeUnlike(postId) {
    const token = isAuthenticated().token;
    const userId = isAuthenticated().user._id;
    let type = "like";
    if (document.getElementById("likeButton").src === liked) {
      type = "unlike";
      document.getElementById("likeButton").src = unliked;
    } else {
      document.getElementById("likeButton").src = liked;
    }
    likeUnlikePost(userId, token, postId, type).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        //console.log(data);
        this.setState(prevState => ({
          posts: prevState.posts.map(singlePost =>
            singlePost._id === postId
              ? Object.assign(singlePost, { likedBy: data.post.likedby })
              : singlePost
          )
        }));
        //console.log(this.state.posts);
      }
    });
  }

  async openSinglePostModal(postId) {
    // console.log("single post opened");
    await this.setState({ singlePost: true, currentSinglePost: postId });
    // console.log(this.state.singlePost);
  }

  returnModal(post) {
    // console.log("return model called");
    if (
      this.state.singlePost === true &&
      this.state.currentSinglePost === post._id
    ) {
      return (
        <SinglePostModal
          show={this.state.singlePost}
          modalClosed={this.closeModal}
          post={post}
          comments={post.comments}
          updateComment={this.updateComment}
        />
      );
    }
  }

  closeModal() {
    this.setState({ singlePost: false });
  }

  updateComment(postId, newComment) {
    //console.log("update comment called",newComment);
    this.state.posts.find(post => {
      if (post._id === postId) {
        //console.log("post found");
        /*this.setState(prevState => ({
                    post: {
                        ...prevState.post,
                        comments:newComment
                    },
                }))*/

        this.setState({
          posts: this.state.posts.map(post =>
            post._id === postId ? { ...post, comments: newComment } : post
          )
        });
      }
    });
  }
  getPostImage(postId) {
    const postUrl = `${process.env.REACT_APP_API_URL}/postImage/${postId}`;

    return postUrl;
  }

  getPostUserImage(userID) {
    const photoUrl = `${process.env.REACT_APP_API_URL}/image/${userID}`;

    return photoUrl;
  }

  componentDidMount() {
    const user = isAuthenticated().user;
    const token = isAuthenticated().token;

    getPosts(user._id, token).then(data => {
      //console.log(data);
      if (data.error) {
        this.setState({ error: data.error });
      } else if (data.message) {
        this.setState({ message: data.message, loading: false });
      } else {
        //console.log(data);
        this.setState({ posts: data, loading: false });
        //console.log("post in dashboard",this.state.posts);
      }
    });
  }

  render() {
    const { posts } = this.state;
    return <>{this.renderPosts(posts)}</>;
  }
}

export default Dashboard;
