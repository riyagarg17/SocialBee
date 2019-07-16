import React,{Component} from 'react';
import './Modal.css';
import Backdrop from './Backdrop';

class Modal extends Component{

    /*shouldComponentUpdate(nextProps,nextState){
        console.log(this.props.show,nextProps.show);
        return nextProps.show !==this.props.show;
    }*/

    render(){
        //console.log("modal clicked");
        return(
            <>
                <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
                <div className="Modal" style={{
                    transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: this.props.show ? '1' : '0'
                }}>
                    {this.props.children}
                </div>

            </>
        )
    }
}

export default Modal;
   