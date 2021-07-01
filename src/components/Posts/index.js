import { Component, Fragment } from 'react';

import ReactPaginate from 'react-paginate';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import Comment from '../Comment';
import List from "../List";
import Search from "../Search";

class Posts extends Component {
    
    constructor(props){
        super(props);

        this.state={
            postsPerPage:10,
            currentPage:0,
            showPosts: this.props.data.slice(0, 10),       
        };
    }

    
    isValidEmail = ( email ) => {
         
        // check is email is valid
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        console.log(re.test(String(email).toLowerCase()));
        return re.test(String(email).toLowerCase());
    
    }

    addComment = ( index, email = "", body = "", title = "" ) => {

        const { data, addPostsComment } = this.props;
        const newData = [...data];

        if(title === "" || !this.isValidEmail(email) || body === "") {
            return false;
        }

        const newComment = {
            body:body,
            email:email,
            name:title,
            postId:index,
            rating:0, 
            id: data[data.length-1].comments[data[data.length-1].comments.length-1].id+1 
        };
       
        newData[index-1].comments.push(newComment);     
        addPostsComment(newData);

    }

    handlePageClick = ({ selected }) => {
        const { postsPerPage } = this.state;
        
        const indexOfFirstPost = (selected) * postsPerPage;
        const indexOfLastPost = indexOfFirstPost + postsPerPage;

        const show =  this.props.data.slice(indexOfFirstPost, indexOfLastPost);
    
        this.setState({
          ...this.state,
          showPosts:show,
          currentPage:selected
        });
    
      }

    totalPageCount = () => {
        const { postsPerPage } = this.state;
        return Math.ceil(this.props.data.length / postsPerPage);
    }

    changePageShowCount = (e) => {

        const { currentPage } = this.state;

        this.setState({
            postsPerPage: +e.target.getAttribute("data-value")
        },()=>{
            this.handlePageClick({selected:currentPage})
        });
    }
    render() {

        const { showPosts,postsPerPage } = this.state;
        const { data,addPostsComment } = this.props
        const list = ["list1","list2"];

        return (
            <div className="main_block">
                <Search  data={data} />
                {
                   showPosts.map(( item,index ) => {
                    
                       return (
                            <div className={item.disable === false ? "posts_comments_block" : "posts_comments_block disable"} key={`main_${index}`}>
                                    <div className="posts_id_side_block_row">
                                            <div className="post_id_block">
                                                <p>{item.id}</p>
                                            </div>
                                            <div className="post_block">
                                                <h5 className="post_title">{item.title}</h5>
                                                <p className="post_body_title">Posts Body</p>
                                                <p className="post_body">{item.body}</p>
                                            </div>
                                    </div>
                                    <Comment 
                                        data={item.comments} 
                                        method={this.props.method} 
                                        addComment={this.addComment} 
                                        disableRating={item.disable} 
                                        index={item.id}
                                    />
                            </div>
                       )
                   }) 
                }
                 <ReactPaginate
                    previousLabel={" ← "}
                    nextLabel={" → "}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={this.totalPageCount}
                    onPageChange={this.handlePageClick}
                    containerClassName={"pagination"}
                    previousLinkClassName={"pagination__link"}
                    nextLinkClassName={"pagination__link"}
                    disabledClassName={"pagination__link--disabled"}
                    activeClassName={"pagination__link--active"}
                />
                <InputLabel id="label">Page</InputLabel>
                <Select labelId="label" id="select" value={postsPerPage} onChange={(e) =>  this.changePageShowCount(e) }>
                    <MenuItem value="10">10</MenuItem>
                    <MenuItem value="5">5</MenuItem>
                </Select>
                <div className="list_main_block">
                    { list.map( el => {
                            return <List title={el} data={data} addPostsComment={addPostsComment} key={`${ el }`} /> 
                        })
                     }
                </div>
     </div>
         )
    }
}

export default Posts;