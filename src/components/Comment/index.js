import { Component, Fragment } from 'react';

import ReactPaginate from 'react-paginate';
import Rating from '@material-ui/lab/Rating';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import InputEmoji from 'react-input-emoji'

import CommentReplaceModal from './CommentReplaceModal';

import './Comment.css';


class Comment extends Component {
    constructor(props){
        super(props)

        this.state = {

            names:[],
            emails:[],
            bodies:[],

        }
    }

    onChangeRating = (item,newValue) => {
        const comment = {...item};
        comment.rating = newValue;
        console.log(newValue)
        
        this.props.method(comment);
    }

    colorForReating = (rating) => {

        switch(true){
            case (rating < 3 && rating > 0):
            
                return "comment_block badRating";
                
            case (rating <= 4 && rating >= 3):
            
                return "comment_block NormalRating";
            
            case (rating > 4):

                return "comment_block GoodRating";

            default:
                return "comment_block";
            
        }

    }

    handleChange = ( value ,witchInput,postId) => {
        const test = [...this.state[witchInput]];
        test[postId] = value;
    
        this.setState({
    
          ...this.state,
          [witchInput]: test,

        });
    }

    sendComment = (index,emails, bodies, names) => {
        const { addComment } = this.props;  
        addComment(index,emails, bodies, names)
        this.setState({
            emails:[],
            bodies:[],
            names:[],
        })
    }
    render() {

        const { emails, bodies, names } = this.state;
        const { data, disableRating,index } = this.props;
        console.log(data)
        return (
            <div className="main_block">
                {
                    data.map(( el,index ) => {
                        
                        return (
                            <div className={this.colorForReating(el.rating)} key={`comment_${index}`}>
                                 <div className="post_id_block">
                                    <p>{index+1}</p>
                                </div>
                                <div className="text_side">
                                    <p>{ el.name }</p>
                                </div>
                                <div className="rating_side">
                                <Rating
                                        name={`hover-feedback ${el.id}`}
                                        value={el.rating}
                                        precision={0.5}
                                        onChange={(event, newValue) => {
                                    
                                                this.onChangeRating(el, newValue);
                                        }}
                                        disabled={disableRating}
                                />
                                <p>{el.rating}</p>
                                <CommentReplaceModal replase={this.replase} method={this.props.method} data={el}/>
                                 </div>
                            </div>
                        )
                    })
                  
                }
                <div className="add_comment">
                    <input type="email" className="input_text" placeholder="Write your email" value={ emails[index] === undefined ? "" : emails[index] }   onChange={(e) => {  this.handleChange(e.target.value,"emails",index) } } disabled={disableRating} />
                    <InputEmoji
                            value={bodies[index] === undefined ? "" : bodies[index]}
                            onChange={(e) => { this.handleChange(e,"bodies",index) } }
                            cleanOnEnter
                            placeholder="Type a message"
                            disabled={disableRating}
                    />
                
                    <input type="text"   className="input_text" placeholder="Write name"    value={names[index] === undefined ? "" : names[index]}  onChange={(e) => { this.handleChange(e.target.value,"names",index) } } disabled={disableRating}/>
                    <Button variant="outlined" color="primary" onClick={()=> { this.sendComment(index,emails[index], bodies[index], names[index])} } >
                        Add Comment
                    </Button>
                 
                </div>
            </div>
                    
         )
    }
}

export default Comment;

/*

 <input type="text"  className="input_text" placeholder="write comment" value={bodies[index] === undefined ? "" : bodies[index]}   onChange={(e) => { this.handleChange(e,"bodies",index) } }/>
*/