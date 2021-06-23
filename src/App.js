
import { Component } from 'react';

import Rating from '@material-ui/lab/Rating';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';

import { sortBy } from 'lodash';
import ReactPaginate from 'react-paginate';

import List from "./List";

import './App.css';


class App extends Component {

  constructor(props) {

      super(props);
      this.state = {
        
        posts:[],
        showPosts:[],
        comment:[],
        postsPerPage:10,
        totalPages:10,
        currentPage:1,
        listFirst:[],
        listFirstToggle:false,
        listSeconde:[],
        listSecondeToggle:false,
        email:[],
        name:[],
        commentText:[],
        error:false,
        
      }

  }
  componentDidMount() {

     fetch("https://jsonplaceholder.typicode.com/posts")
    .then(res => res.json() )
    .then(obj => { 
      const res = obj.map(el => {

        return {busy:false,finalRating:0,...el};

      })

      const show =  res.slice(0, 10);

      this.setState({

        ...this.state,
        posts: res,
        showPosts:show

      })
    
    });

    fetch("https://jsonplaceholder.typicode.com/comments")
    .then(res => res.json() )
    .then(obj => { 
      const res = obj.map(el => {

        return {rating:0,...el};

      })

      this.setState({

        ...this.state,
        comment: res,

      })
    });
  }
  onChangeRating( valueRating, id ) {

      const { comment, posts } = this.state;
  
      const item = comment.find(el => el.id == id);
    
      this.setState({

        ...this.state,
        comment: comment.map((el,index) => el.email === item.email ?  {...el, rating:valueRating} : el ),

      })
  }
  isValidEmail = ( email ) => {

    // check is email is valid
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());

  }
  addComment = ( e ) => {

    const { comment, name, email, commentText } = this.state;
    
      if( name.length !== 0 && email.length !== 0 && commentText.length !== 0 &&
        name[e.id] !== "" && commentText[e.id] !== "" && this.isValidEmail(email[e.id])){

        const newEmail = [...email];
        const newName = [...name];
        const newCommentText = [...commentText];

        newEmail[e.id] = "";
        newName[e.id] = "";
        newCommentText[e.id] = "";

        this.setState({

          ...this.state,
          comment: [   ...comment, 
                      {body:commentText[e.id],
                        email:email[e.id],name:name[e.id], 
                        id:comment.length,
                        postId:e.id,rating:0
                      }
                   ],

          name:newName,
          email:newEmail,
          commentText:newCommentText,
          error:false,

        })

      }else {

        this.setState({

          ...this.state,
          error:true

        })
      }
  }

  findComment = ( id ) => {

    const { comment, posts } = this.state;

    const comments = comment.filter(el => el.postId === id);

    return comments.map((el,index) => {

      return (

        <div className="comment_block">
           <div className="post_id_block">
               <p>{index+1}</p>
           </div>
           <div className="text_side">
               <p>{el.name}</p>
           </div>
           <div className="rating_side">
              <Rating
                  name={`hover-feedback ${el.id}`}
                  value={el.rating}
                  precision={0.5}
                  onChange={(event, newValue) => {

                    const [ name, elId ] = event.target.name.split(" ");
     
                    this.onChangeRating(newValue,elId);

                  }}
                  disabled = {posts[id-1].busy}
                />
              <p>{el.rating}</p>
           </div>
        </div>

      )

    })

  }

  handleChange( event, name, id ) {

    const test = [...this.state[name]];

    test[id] = event.target.value;

    this.setState({

      ...this.state,
      [name]: test,

    });

  }

  handlePageClick = ({ selected }) => {

    const {showPosts,postsPerPage} = this.state
    const indexOfLastPost = (selected+1) * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;

    const show =  this.state.posts.slice(indexOfFirstPost, indexOfLastPost);

    this.setState({

      ...this.state,
      showPosts:show,
      currentPage:selected

    })

  }

  sortList = ( listTitle, listToggle ) => {

   const toggleName = listTitle === "listFirst" ? "listFirstToggle" : "listSecondeToggle"
  
   this.setState({

      ...this.state,
      [listTitle]: listToggle === true ? sortBy([...this.state[listTitle]],['id']) : sortBy([...this.state[listTitle]],['id']).reverse(),
      [toggleName]: !listToggle,

    })

  }

  add = (e) => {

    const { posts,showPosts } = this.state;
  
      let lastIndex = posts.findIndex(item => {

        return item.busy === true;

      });

      const res = lastIndex === -1 ? posts[posts.length-1] : posts[lastIndex-1];
      const rating = this.finalRating(res);

      this.setState({

        ...this.state,
        posts:  posts.map(el => el.id === res.id ?  {...el, busy:!el.busy,finalRating:rating} : el ),
        showPosts: showPosts.map(el => el.id === res.id ?  {...el, busy:!el.busy,finalRating:rating} : el ),
        [e]: [...this.state[e], {...res, busy:!res.busy,finalRating:rating}].sort((a,b) => a.finalRating + b.finalRating),
      
      })

  }

  remove = ( item, listName, removeItemIndex ) => {

    const { posts,showPosts, listFirst, listSeconde } = this.state;
    const result = listName === "listFirst" ? [...listFirst] : [...listSeconde];
    result.splice(removeItemIndex, 1);

    this.setState({

      ...this.state,
      posts:  posts.map(el => el.id === item.id ?  {...el, busy:!el.busy} : el ),
      showPosts: showPosts.map(el => el.id === item.id ?  {...el, busy:!el.busy} : el ),
      [listName]: result,

    })

  }

  finalRating = ( postsItem ) => {

    const { comment } = this.state;

   const res = comment.filter(item =>  item.postId === postsItem.id ).map(el => el.rating);
    
   return res.reduce((a, b) => a + b, 0) === 0 ? 0 : res.reduce((a, b) => a + b, 0) / res.length;

  }

    render(){

      const { posts, comment,showPosts,
              listFirst,listSeconde,listSecondeToggle,
              listFirstToggle,name,commentText,email, error } = this.state;

        return (
            <div className="main_block">
              { error === true ?  <Alert severity="error">Please check your all fields something is wrong</Alert> : null}
                {
                  posts.length !== 0 || comment.length !== 0 ? showPosts.map(el => {
                   
                      return (
                        <div className={el.busy === false ? "posts_comments_block" : "posts_comments_block disable"}>
                            <div className="posts_id_side_block_row">
                                <div className="post_id_block">
                                    <p>{el.id}</p>
                                </div>
                                <div className="post_block">
                                  <h5 className="post_title">{el.title}</h5>
                                  <p className="post_body_title">Posts Body</p>
                                  <p className="post_body">{el.body}</p>
                                </div>
                            </div>
                            { this.findComment(el.id) }
                            <div className="add_comment">
                              <input type="email" className="input_text" placeholder="write your email" value={email[el.id] === undefined ? "" : email[el.id]} onChange={(e) => { this.handleChange(e,"email",el.id)}}/>
                              <input type="text"  className="input_text" placeholder="write comment" value={commentText[el.id] === undefined ? "" : commentText[el.id]}  onChange={(e) => { this.handleChange(e,"commentText",el.id)}}/>
                              <input type="text"   className="input_text" placeholder="write name" value={name[el.id] === undefined ? "" : name[el.id]}   onChange={(e) => { this.handleChange(e,"name",el.id)}}/>
                              <Button variant="outlined" color="primary" onClick={()=> {this.addComment(el)} } >
                                Add Comment
                              </Button>
                             
                            </div>
                        </div>  
                      )
                    }) : null
                }
             <ReactPaginate
                previousLabel={" ← "}
                nextLabel={" → "}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={this.state.totalPages}
                onPageChange={this.handlePageClick}
                containerClassName={"pagination"}
                previousLinkClassName={"pagination__link"}
                nextLinkClassName={"pagination__link"}
                disabledClassName={"pagination__link--disabled"}
                activeClassName={"pagination__link--active"}
              />
              <div className="list_main_block">
              <List add={this.add} remove={this.remove} sortList={this.sortList} listToggle={listFirstToggle} title={"listFirst"} data={listFirst} />
              <List add={this.add} remove={this.remove} sortList={this.sortList} listToggle={listSecondeToggle} title={"listSeconde"} data={listSeconde} />
              </div>
            </div>
        )
    }
} 

export default App;
