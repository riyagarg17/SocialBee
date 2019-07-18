import React, { Component } from "react";
import "./AddPost.css";
import { isAuthenticated, hasAutherization } from "../../auth/index";
import { createPost } from "../../auth/apiPost";
import { Redirect } from "react-router-dom";

class AddPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      error: "",
      caption: "",
      photo: "",
      file: null,
      redirectToProfile: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.uploadPhotoDialog = this.uploadPhotoDialog.bind(this);
  }

  uploadPhotoDialog() {
    document.getElementById("photo").click();
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = name === "photo" ? target.files[0] : target.value;
    if (name === "photo") {
      this.setState({
        file: URL.createObjectURL(target.files[0])
      });
      document.getElementById("submitPostButton").disabled = false;
    }
    this.postData.set(name, value);
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    // console.log("handle Submit called");
    event.preventDefault();
    //console.log("current model",this.state.currentModal);
    const { user } = this.state;
    const token = isAuthenticated().token;
    createPost(user._id, token, this.postData).then(data => {
      //console.log("data recieved after submit",data.user);
      if (data.error) this.setState({ error: data.error });
      else {
        this.setState({ redirectToProfile: true });
      }
    });
  }

  componentDidMount() {
    this.postData = new FormData();
    this.setState({ user: isAuthenticated().user });
  }

  render() {
    if (this.state.redirectToProfile) {
      return <Redirect to={`/user/${this.state.user._id}`} />;
    }

    return (
      <div className="addPostDiv">
        <h4 className="newPostText mb-3"> New Post</h4>
        <hr style={{ width: "500px", margin: "0 auto" }} />
        <form encType="multipart/form-data" onSubmit={this.handleSubmit}>
          <div className="captionDiv">
            <input
              type="text"
              name="caption"
              placeholder="Write a caption.."
              className="captionInput"
              onChange={this.handleChange}
              autoComplete="off"
            />
          </div>
          <div className="postImageDiv mb-3">
            <button
              className="chip mt-4"
              type="button"
              onClick={this.uploadPhotoDialog}
            >
              <div className="uploadImageIcon" />
              Upload Image
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={this.handleChange}
                id="photo"
                name="photo"
              />
            </button>
            {this.state.file && (
              <div className="uploadedImageDiv mt-4">
                <img className="uploadedImage" src={this.state.file} alt="" />
              </div>
            )}
          </div>
          <button
            type="submit"
            className="btn submitPostButton"
            disabled={true}
            id="submitPostButton"
          >
            {" "}
            Add Post{" "}
          </button>
        </form>
      </div>
    );
  }
}

export default AddPost;
