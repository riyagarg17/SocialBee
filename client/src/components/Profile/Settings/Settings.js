import React, { Component} from 'react';
import './Settings.css';
import { isAuthenticated,signout } from '../../../auth/index';
import { withRouter } from "react-router-dom";
import { Redirect } from 'react-router-dom';
import { editUser } from '../../../auth/apiUser';
import { fetchUserProfile } from '../../../auth/apiUser';
import {deleteUser,uploadImage,updateLocalStorage} from '../../../auth/apiUser';
import Modal from '../../Modal/Modal';

const isActive = (history, path) => {
    if (history.location.pathname === path)
        return ({ fontWeight: "600", borderLeft: "2px solid #262626" });
};

class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: "",
            error: "",
            message: "",
            updated: false,
            currentModal:"",
            userImage:""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.goToProfile = this.goToProfile.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.uploadPhotoDialog = this.uploadPhotoDialog.bind(this);
        this.handlePhoto= this.handlePhoto.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState(prevState => ({
            user: {
                ...prevState.user,
                [name]: value
            },
        }));
    }

    handleSubmit(event) {

       // console.log("handle Submit called");
        event.preventDefault();
        //console.log("current model",this.state.currentModal);
        const { user } = this.state;
        const token = isAuthenticated().token;
        user.image=undefined;
        user.followers=undefined;
        user.following=undefined;
        editUser(user, token)
            .then(data => {
                //console.log("data recieved after submit",data.user);
                if (data.error)
                    this.setState({ error: data.error });
                else {
                    updateLocalStorage(data.user,()=>{

                        this.setState({
                            message: "Successfully Updated",
                            user: data.user,
                            updated: true,
                            currentModal:'Submit',
                            redirectToSignup:false
                        });
                    });                    
                }
            });

    }

      handleDeleteClick(){
        //console.log("executing function handleDeleteClick");
        this.setState({currentModal:"Delete",updated:true});
        //console.log(this.state.currentModal,this.state.updated);
    }

    deleteUser(){

        const token = isAuthenticated().token;
        const userId = this.props.match.params.userId;
        deleteUser(userId,token)
        .then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                signout(()=>console.log("user deleted"));
                this.setState({redirectToSignup:true});
            }
        });
    }

    init = userId => {

        const token = isAuthenticated().token;
        fetchUserProfile(userId, token)
            .then(data => {
                if (data.error) {
                    this.setState({
                        redirectToLogin: true
                    });
                } else {
                    //console.log(data);
                    this.setState({ user: data});
                }

            });
    }

    closeModal() {
        this.setState({ updated: false,currentModal:"" });
    }

    goToProfile() {

        return this.props.history.push(`/user/${this.state.user._id}`);
    }

    uploadPhotoDialog(){
        document.getElementById('photo').click();
    }

     handlePhoto(event){
        const value=event.target.files[0];
        const name = event.target.name;
        const token = isAuthenticated().token;
        const userId = this.props.match.params.userId;
        const imageData=new FormData();
        imageData.append(name,value);
        //console.log(imageData);
        uploadImage(userId,imageData,token)
        .then(data=>{
             this.setState({user:data.user});
             const photoUrl = `${
                process.env.REACT_APP_API_URL}/image/${this.state.user._id}`;
            document.getElementById("userImage").src=photoUrl;
            
        });
        //console.log(this.state.user)
    }
    componentDidMount() {

        //console.log("component rendered");
        
        if (isAuthenticated().user) {
            let userId = this.props.match.params.userId;
            this.init(userId);
        }
    }


    render() {
        const photoUrl = `${
               process.env.REACT_APP_API_URL}/image/${this.state.user._id}`;
        if(this.state.redirectToSignup){
            return <Redirect to='/'/>
        }
        return (
            <div className="settingsContainer">
                {isAuthenticated().user && isAuthenticated().user._id === this.state.user._id &&
                    <>
                        <Modal show={this.state.updated} modalClosed={this.closeModal}>
                        {this.state.currentModal==="Delete" &&
                         <div className="modalContent1">
                         <div className=" text-center">
                            
                                 <i className="far fa-times-circle" style={{ color: "#f15e5e", fontSize: "54px" }}></i>    
                         </div>
                         <div className="modalText1 text-center mt-3">
                             <h4 style={{ color: "#262626" }}> Are You Sure? </h4>
                             <p>Do you really want to delete your profile? This process cannot be undone</p> 
                             <div>
                                <button onClick={this.closeModal} className="btn ml-3 px-4 cancelButton" >
                                    Cancel
                                </button>
                                <button onClick={this.deleteUser} className="btn ml-3 px-4 deleteButton " >
                                    Delete
                                </button>
                             </div>
                             
                         </div>
                     </div>
                    }
                            {this.state.message && this.state.currentModal==="Submit" && 
                             <div className="modalContent1">
                             <div className="modalHeader1 text-center">
                                 <div className="modalIcon1">
                                     <i className="fas fa-check" style={{ color: "white", fontSize: "54px" }}></i>
                                 </div>
                             </div>
                             <div className="modalText1 text-center mt-3">
                                 <h4 style={{ color: "#262626" }}> {this.state.message}! </h4>
                                 <button className="modalButton btn" onClick={this.goToProfile}>
                                     <span>Go To Profile</span>
                                     <i className="fas fa-arrow-right ml-2"></i>
                                 </button>
                             </div>
                         </div>
                }

                            </Modal>
                        <ul className="side">
                            <li>
                                <a href="/settings" className="sideSettings" style={isActive(this.props.history, `/settings/${isAuthenticated().user._id}`)}> Edit Profile </a>
                            </li>
                            <li>
                                <a href="/settings" className="sideSettings">Change Password </a>
                            </li>
                            <li>
                                <a href="/settings" className="sideSettings">Privacy and Security</a>
                            </li>
                            <li>
                                <a href="/settings" className="sideSettings">Email and SMS </a>
                            </li>
                        </ul>
                        <article className="mainContainer">
                            <header style={{ margin: "32px 0 0", flexDirection: "row", display: "flex" }}>
                                {!this.state.user.image &&
                                    <div className="noUserImg">

                                    </div>
                                }
                                {this.state.user.image &&
                                    <img alt="profile" src={photoUrl} style={{borderRadius:"50%",width:"50px",height:"50px"}} id="userImage"/>
                                }
                                <div style={{ marginLeft: "30px" }}>
                                    <h1 className="userName" style={{ fontSize: "20px", fontWeight: "400" }}> {isAuthenticated().user.userName} </h1>
                                    
                                       
                                        <button style={{ color: "#3897f0", padding: "0", background: "0 0", fontWeight: "600", border: "0", fontSize: "14px" }}
                                        onClick={this.uploadPhotoDialog}> 
                                        Change Profile Picture
                                        <form encType='multipart/form-data' id="imageUploadForm">
                                         <input type="file" accept="image/*" style={{display:"none"}} onChange={this.handlePhoto} id="photo" name="photo"/>
                                         </form>
                                        </button>
                                    
                                </div>

                            </header>
                            <form style={{ marginTop: "25px", marginBottom: "16px", width: "100%", marginLeft: "0" }} onSubmit={this.handleSubmit}>
                                <div style={{ display: "flex" }}>
                                    <label style={{ fontWeight: "600", textAlign: "right" }}>  Name</label>
                                    <input type="text" className="editInput" value={this.state.user.fullName}
                                        onChange={this.handleChange} name="fullName" />
                                </div>

                                <div style={{ display: "flex" }}>
                                    <label style={{ fontWeight: "600", textAlign: "right" }}>  Userame</label>
                                    <input type="text" className="editInput" value={this.state.user.userName}
                                        style={{ marginLeft: "55px" }} name="userName"
                                        onChange={this.handleChange} />
                                </div>

                                <div style={{ display: "flex" }}>
                                    <label style={{ fontWeight: "600", textAlign: "right" }}> Email</label>
                                    <input type="email" className="editInput" value={this.state.user.email}
                                        onChange={this.handleChange} name="email" />
                                </div>

                                <div style={{ display: "flex" }} className="mb-4">
                                    <label style={{ fontWeight: "600", textAlign: "right" }}> Bio</label>
                                    <textarea className="editInput" value={this.state.user.bio} data-emojiable="true"
                                        onChange={this.handleChange} name="bio"> </textarea>
                                </div>
                                <button className="btn btn-primary" type="submit"> Submit </button>
                                <button className="btn btn-danger ml-3" onClick={this.handleDeleteClick} type="button"> Delete my account </button>
                            </form>
                            
                            
                        </article>
                    </>
                }
                {!isAuthenticated().user &&
                    <Redirect to="/login" />
                }
            </div>
        )
    }
}

export default withRouter(Settings);