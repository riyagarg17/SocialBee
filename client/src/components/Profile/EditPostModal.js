import React,{Component} from 'react';
import { isAuthenticated } from '../../auth/index';
import { update } from '../../auth/apiPost';
import '../Modal/Modal.css';
import Backdrop from '../Modal/Backdrop';

class EditPostModal extends Component{


    constructor(props) {
        super(props);
        this.state = {
            user: "",
            error: "",
            caption:"",
            photo:"",
            file:null,
            editPost:false,
            photoUrl:""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.uploadPhotoDialog = this.uploadPhotoDialog.bind(this);
        
    }

    uploadPhotoDialog(){
        document.getElementById('photo').click();
    }

    async handleChange(event) {
        
        const target = event.target;
        const name = target.name;
        const value = name==='photo'?target.files[0]:target.value;
        
        if(name==='photo'){
            //console.log("photo changed");
           await this.setState({
                photoUrl: URL.createObjectURL(target.files[0])
              });
            //console.log(this.state.photoUrl);
        }
        this.postData.set(name,value);
        this.setState({[name]:value});
    }

    handleSubmit(event) {

        // console.log("handle Submit called");
         event.preventDefault();
         //console.log("current model",this.state.currentModal);
         const postId = this.props.postId;
         const token = isAuthenticated().token;
         update(postId, token,this.postData)
             .then(data => {
                 //console.log("data recieved after submit",data.user);
                 if (data.error)
                     this.setState({ error: data.error });
                 else {
                     this.props.updateCaption(postId,this.state.caption);
                     this.props.modalClosed();                
                 }
             });
 
     }
     
     componentDidMount() {

        console.log(this.props);
        this.postData=new FormData();
        const singlePostPhoto = `${
            process.env.REACT_APP_API_URL}/postImage/${this.props.postId}`;
        this.setState({caption:this.props.caption,photoUrl:singlePostPhoto});
    }
    render(){
        //console.log("modal clicked");
       // const singlePostPhoto = `${
       //     process.env.REACT_APP_API_URL}/postImage/${this.props.postId}`;
        return(
            <>
                <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
                <div className="Modal" style={{
                    transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: this.props.show ? '1' : '0'
                }}>
                     <div className="addPostDiv">
                <h4 className="newPostText mb-3"> Edit Post</h4>
                <hr style={{ width: "500px", margin: "0 auto" }} />
                <form encType='multipart/form-data' onSubmit={this.handleSubmit}>
                <div className="captionDiv">
                    <input type="text" name="caption" className="captionInput" onChange={this.handleChange} value={this.state.caption} autoComplete="off"/>
                </div>
                <div className="postImageDiv mb-3">
                    <button className="chip mt-4" type="button" onClick={this.uploadPhotoDialog}>
                        <div className="uploadImageIcon"> 
                           
                        </div>
                        Change Image
                        
                        <input type="file" accept="image/*" style={{ display: "none" }} onChange={this.handleChange} id="photo" name="photo" />
                        
                    </button>
                    <div className="uploadedImageDiv mt-4">
                        
                        
                        <img  className="uploadedImage" src={this.state.photoUrl} alt=""/>
                                          
                    </div>
                </div>
                <button type="submit" className="btn submitPostButton mb-5"  id="EditPostButton"> Confirm Changes </button>
                </form>
            </div>
                </div>

            </>
        )
    }
}

export default EditPostModal;
   