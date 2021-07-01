import { Component } from 'react';

import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import InputEmoji from 'react-input-emoji'


import "./Modal.css"

class CommentReplaceModal extends Component {
    constructor(props){
        super(props)

        this.state = {
            name:"",
            email:"",
            body:"",
            showModal:false,
        }
    }

    isValidEmail = ( email ) => {
         
        // check is email is valid
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        console.log(re.test(String(email).toLowerCase()));
        return re.test(String(email).toLowerCase());
    
    }

    handleChange= (value,witchInput) => {

        this.setState({
          [witchInput]: value,
        });

    }

    handleToggleModal = () => {

        this.setState({
            showModal:!this.state.showModal
        })

    }
    replace = (email,body,name) => {
        const { data } = this.props;
      
        if(name === "" || !this.isValidEmail(email) || body === ""  || data.replase === true) {
            return false;
        }
  
        const newdata = {
            ...data,
            email,
            body, 
            name,
            replase:true
        };

        this.props.method(newdata);
        this.handleToggleModal();
    }

    render() {

        const { name, email,body } = this.state;
        const { data } = this.props;

        return (
            <>
                <button onClick={ this.handleToggleModal } className={"button"} disabled={data.replase}> Rep </button>
                <Modal 
                    isOpen={this.state.showModal}
                    contentLabel="onRequestClose Example"
                    onRequestClose={this.handleToggleModal}
                    shouldCloseOnOverlayClick={true}
                    ariaHideApp={false}
                    >

                    <div className="add_comment">
                            <input type="email" 
                                className="input_text input_width" 
                                placeholder="Write your email"     
                                onChange={(e) =>  this.handleChange(e.target.value,"email") } 
                            />
                            <InputEmoji
                                    onChange={(e) => { this.handleChange(e,"body") } }
                                    cleanOnEnter
                                    placeholder="Type a message"
                            />
                        
                            <input type="text"   
                                className="input_text input_width input_margin_bottom"
                                placeholder="Write name"  
                                onChange={(e) =>  this.handleChange(e.target.value,"name") }
                              />

                            <Button 
                                variant="outlined" 
                                color="primary" 
                                onClick={()=>  this.replace(email, body, name) } >
                                    Add Comment
                            </Button> 
                    </div>
                    
                </Modal>
            </>
         )
    }
}

export default CommentReplaceModal;
