import React ,{Component} from 'react';
import './SlideShow.css';
 
class Slideshow extends Component{

    constructor(props){
        super(props);
        this.state={
            fadeImages :[
                'https://www.instagram.com/static/images/homepage/screenshot5.jpg/0a2d3016f375.jpg',
                'https://www.instagram.com/static/images/homepage/screenshot4.jpg/842fe5699220.jpg',
                'https://www.instagram.com/static/images/homepage/screenshot3.jpg/f0c687aa6ec2.jpg',
                'https://www.instagram.com/static/images/homepage/screenshot2.jpg/6f03eb85463c.jpg',
                'https://www.instagram.com/static/images/homepage/screenshot1.jpg/d6bf0c928b5a.jpg'
            ]
              
        };
    }

    componentDidMount() {
        let k = 0;
        this.interval=setInterval(function () {
            document.getElementById("slideImg").src = this.state.fadeImages[k];
            k = k + 1;
            if (k === this.state.fadeImages.length)
                k = 0;
        }.bind(this), 4000);
    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }
        
    render(){
        return (
            <div className="slideShowDiv"> 
                <img src={this.state.fadeImages[0]} alt="slideshow" id="slideImg"/>
            </div>
            );
    }
}

export default Slideshow;