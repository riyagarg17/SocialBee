import React, { Component } from "react";
import "./Profile.css";
import { followUser } from "../../auth/apiUser";

class FollowButton extends Component {
  onButtonClick = () => {
    if (document.getElementById("followButton").innerHTML === "Follow")
      this.props.onButtonClick(followUser, "follow");
    else {
      this.props.onButtonClick(followUser, "unfollow");
    }
  };

  render() {
    return (
      <button
        className="ml-3 followButton"
        onClick={this.onButtonClick}
        id="followButton"
      >
        {this.props.followStatus ? "Unfollow" : "Follow"}
      </button>
    );
  }
}

export default FollowButton;
