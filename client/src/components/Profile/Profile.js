import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { isAuthenticated } from '../../auth/index';
import { fetchUserProfile } from '../../auth/apiUser';
import { getPostByUser, update, remove } from '../../auth/apiPost';
import './Profile.css';
import { Link } from 'react-router-dom';
import FollowButton from './FollowButton';
import Followers from './FollowersList';
import Following from './FollowingList';
import Modal from '../Modal/Modal';
import EditPostModal from './EditPostModal';

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: "",
            redirectToLogin: false,
            following: false,
            numFollowers: null,
            numFollowing: null,
            showModalfollowing: false,
            showModalfollowers: false,
            posts: [],
            loading: true,
            postModal: false,
            message: "",
            editPostModal: false
        };

        this.hasAutherization = this.hasAutherization.bind(this);
        this.init = this.init.bind(this);
        this.checkFollow = this.checkFollow.bind(this);
        this.clickFollowButton = this.clickFollowButton.bind(this);
        this.showFollowersList = this.showFollowersList.bind(this);
        this.showFollowingList = this.showFollowingList.bind(this);
        this.renderModalFollowers = this.renderModalFollowers.bind(this);
        this.renderModalFollowing = this.renderModalFollowing.bind(this);
        this.displayPostsByUser = this.displayPostsByUser.bind(this);
        this.getPostImage = this.getPostImage.bind(this);
        this.handlePostDelete = this.handlePostDelete.bind(this);
        this.handlePostEdit = this.handlePostEdit.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.returnModal = this.returnModal.bind(this);
        this.updateCaption = this.updateCaption.bind(this);
    }

    hasAutherization() {
        return (isAuthenticated().user && isAuthenticated().user._id === this.state.user._id);
    }

    async showFollowersList() {


        await this.setState({ showModalfollowers: true });
    }

    showFollowingList() {

        this.setState({ showModalfollowing: true });
    }

    checkFollow(user) {
        const token = isAuthenticated();
        let match = false;
        if (user.followers.length !== 0) {

            user.followers.find(follower => {

                if (follower._id === token.user._id)
                    match = true;

            });
        }
        return match;
    }

    async handlePostEdit(postId) {

        //console.log("edit called");
        await this.setState({ editPostModal: true, currentSinglePost: postId });
    }

    closeModal() {
        this.setState({ editPostModal: false });
    }

    returnModal(post) {

        //console.log("return model called");
        if (this.state.editPostModal === true && this.state.currentSinglePost === post._id) {
            return (
                <>
                    <EditPostModal show={this.state.editPostModal} modalClosed={this.closeModal} postId={post._id}
                        caption={post.caption} updateCaption={this.updateCaption}/>
                </>
            )
        }
    }

    handlePostDelete(postId) {
        const token = isAuthenticated().token;
        remove(postId, token)
            .then(data => {
                console.log(data);
                this.setState({ message: data.message });
            });

    }

    updateCaption(postId, newCaption) {

        this.setState({
            posts: this.state.posts.map(post => (post._id === postId ? { ...post, caption: newCaption } : post))
        });

    }
    clickFollowButton(followUser, buttonType) {

        const token = isAuthenticated().token;
        const userId = isAuthenticated().user._id;
        followUser(userId, token, this.state.user._id, buttonType)
            .then(data => {
                if (data.error) {
                    this.setState({ error: data.error });
                } else {
                    this.setState({ user: data.user, following: !this.state.following });
                }

            });
    }

    getPostImage(postId) {

        const postUrl = `${
            process.env.REACT_APP_API_URL}/postImage/${postId}`;

        return postUrl;
    }

    init(userId) {

        const token = isAuthenticated().token;
        fetchUserProfile(userId, token)
            .then(data => {
                if (data.error) {
                    this.setState({
                        redirectToLogin: true
                    });
                } else {

                    let following = this.checkFollow(data);
                    this.setState({ user: data, following });
                    let numFollowers = this.state.user.followers.length;
                    let numFollowing = this.state.user.following.length;
                    this.setState({ numFollowers, numFollowing });

                    if (this.state.user.image) {

                        const photoUrl = `${
                            process.env.REACT_APP_API_URL}/image/${this.state.user._id}`;
                        document.getElementById("userImage").style.backgroundImage = `url('${photoUrl}')`;
                    }
                }

            });

        getPostByUser(userId, token)
            .then(data => {
                if (data.error) {
                    this.setState({ error: data.error });
                } else {
                    this.setState({ posts: data, loading: false });
                }
            });
    }


    displayPostsByUser() {

        if (this.state.loading) {
            return (
                <div className="loader">Loading...</div>
            )
        } else {

            return (
                <div className="row containerForPost mb-5">
                    {this.state.posts.length !== 0 && this.state.posts ? (this.state.posts.map((post, index) => (
                        <div className="card col-md-3 postImageCard mr-4 ml-4 col-sm-5 mb-3" key={index} >
                            <img alt="" src={this.getPostImage(post._id)} className="userPostImage" id="singlePostImage"/>

                            {this.returnModal(post)}

                            <div className="postBackdrop">

                                <div className="likeCommentOnPost mb-3">
                                    <i className="fas fa-heart postBackdropIcons mr-2"></i>
                                    {post.likedBy.length}
                                    <i className="fas fa-comment postBackdropIcons ml-3 mr-2"></i>
                                    {post.comments.length}
                                </div>
                                {this.hasAutherization() &&
                                    <div>
                                        <button className="btn EditPost" onClick={() => this.handlePostEdit(post._id)}> Edit </button>
                                        <button className="btn deletePost" onClick={() => this.handlePostDelete(post._id)}> Delete </button>

                                    </div>
                                }

                            </div>

                        </div>
                    ))) : (<p className="lead"> No posts to show </p>)}
                </div>
            )
        }


    }

    closeModalFollower = () => {
        this.setState({ showModalfollowers: false });
    }

    closeModalFollowing = () => {
        this.setState({ showModalfollowing: false });
    }

    renderModalFollowers() {
        if (this.state.showModalfollowers === true)
            return (
                <Modal show={this.state.showModalfollowers} modalClosed={this.closeModalFollower}>
                    <Followers followers={this.state.user.followers} />
                </Modal>
            )
    }

    renderModalFollowing() {
        if (this.state.showModalfollowing === true)
            return (
                <Modal show={this.state.showModalfollowing} modalClosed={this.closeModalFollowing}>
                    <Following following={this.state.user.following} />
                </Modal>
            )
    }

    componentDidMount() {

        if (isAuthenticated().user) {
            let userId = this.props.match.params.userId;
            this.init(userId);
        }
        this.setState({ showModalfollowers: false, showModalfollowing: false })
    }

    componentWillReceiveProps(props) {

        if (isAuthenticated().user) {
            let userId = props.match.params.userId;
            this.init(userId);
        }

        if (this.state.user.image) {

            const photoUrl = `${
                process.env.REACT_APP_API_URL}/image/${this.state.user._id}`;
            document.getElementById("userImage").style.backgroundImage = `url('${photoUrl}')`;
        }

        this.setState({ showModalfollowers: false, showModalfollowing: false })
    }

    render() {

        if (this.state.redirectToLogin) {
            return <Redirect to='/login' />
        }

        return (
            <div className="profileDiv">
                <header className="profileHeader" style={{ display: "flex" }}>
                    {!this.state.user.image &&
                        <div className="noUserImg"
                            style={{ width: "150px", height: "150px", marginLeft: "auto" }}>

                        </div>
                    }
                    {this.state.user.image &&

                        <div className="noUserImg" id="userImage"
                            style={{ width: "150px", height: "150px", marginLeft: "auto" }}>
                        </div>

                    }
                    <section style={{ marginLeft: "50px", marginRight: "auto" }}>
                        <div className="section1">
                            <h1 className="userName"> {this.state.user.userName} </h1>
                            {this.hasAutherization() ? (
                                <Link to={{ pathname: `/settings/${this.state.user._id}`, state: { user: this.state.user } }} className="editLink">
                                    <button className="editButton"> Edit Profile</button>
                                </Link>)
                                :
                                (<FollowButton followStatus={this.state.following} onButtonClick={this.clickFollowButton} />)
                            }
                        </div>
                        {isAuthenticated().user.bio &&
                            <p style={{ fontSize: "20px", fontWeight: "300" }}> {this.state.user.bio}</p>
                        }
                        <ul style={{ display: "flex", marginBottom: "20px", listStyle: "none", padding: "0" }}>
                            <li style={{ fontSize: "16px", marginRight: "40px" }}>
                                <b> {this.state.posts.length}</b>  Posts
                            </li>
                            <li style={{ fontSize: "16px", marginRight: "40px", cursor: "pointer" }}
                                onClick={this.showFollowersList}>
                                <b>  {this.state.numFollowers} </b> Followers
                            </li>
                            <li style={{ fontSize: "16px", marginRight: "40px", cursor: "pointer" }}
                                onClick={this.showFollowingList}>
                                <b> {this.state.numFollowing}</b> Following
                            </li>
                        </ul>

                        {this.renderModalFollowers()}
                        {this.renderModalFollowing()}
                        <h1 style={{ fontWeight: "600", fontSize: "16px" }}>  {this.state.user.fullName}</h1>
                    </section>
                </header>
                <div className="postsByUser">
                    {(this.hasAutherization() || this.state.following) && (
                        (this.displayPostsByUser())
                    )}
                </div>

            </div>

        )
    }
}

export default Profile;