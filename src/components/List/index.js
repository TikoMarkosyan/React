import { Component, Fragment } from 'react';

import ReactPaginate from 'react-paginate';
import Rating from '@material-ui/lab/Rating';
import Button from '@material-ui/core/Button';
import { sortBy } from "lodash"

import './List.css';

class List extends Component {
    constructor(props){
        super(props)

        this.state = {
            list:[],
            listToggle:true,
        }

    }
    sortList = ( ) => {
        const { list,listToggle } = this.state;
       
        this.setState({
           ...this.state,
           list: listToggle === true ? sortBy([...list],['id']) : sortBy([...list],['id']).reverse(),
           listToggle: !listToggle,
     
         })
     
       }
     

    add = () => {
        const { data,addPostsComment} = this.props;
        const { list } = this.state;

        const newData = [...data];

        let lastPosts = newData.findIndex(item => {

            return item.disable === true;
    
          });

        const item = lastPosts === -1 ? newData[data.length-1] : newData[lastPosts-1]; 
        const averageRating = this.findAverageRating(item); 
        item.averageRating = averageRating;
        newData[item.id-1].disable = true;
        
        this.setState({
            list:[...list,item]  
        })

        addPostsComment(newData);
    }

    remove = ( item, removeItemIndex ) => {
        const { data,addPostsComment } = this.props;
        const { list } = this.state;
        const newData = [...data];
        const newList = [...list];

        newData[item.id-1].disable = false;

        newList.splice(removeItemIndex, 1);
        this.setState({
            list:newList 
        })

        addPostsComment(newData);
      }

    findAverageRating = ( postsItem ) => {

        const sumRating = postsItem.comments.map(item => {return item.rating}).reduce((a,b) => { return a + b }, 0);

        return  sumRating === 0 ? 0 : sumRating / postsItem.comments.length
    }
    render() {
        const { list,listToggle } = this.state;
        const { title } = this.props;
        return(

            <div className="main_list_div">
                <div className="button_toggle_add">
                        <button onClick={() => { this.add() }} className="add_sort_button">+</button>
                        <button onClick={() => { this.sortList() }}  className="add_sort_button">{ listToggle === true ? <span>&#8593;</span> : <span>&#8595;</span> }</button>
                </div>
                <div className="list_main_div_for_item">
                        {
                            list.map(( item, index ) => {
                                return (
                                <div className="posts_list_block" key={`list_${ title }_${ index }`}>
                                    <div className="post_id_block">
                                        <p>{ item.id }</p>
                                    </div>
                                    <div className="post_block_list">
                                        <p>{ item.title }</p>
                                        <p>{ item.averageRating }</p>
                                    </div>
                                    <div className={"remove_button"}>
                                        <button onClick={()=> { this.remove(item,index) }} className={"button"}> <span>&#215;</span> </button>
                                    </div>
                                </div>
                                )
                            })
                        }
                </div>
            </div>

        )
    }
}

export default List;