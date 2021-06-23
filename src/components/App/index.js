
import { Component } from 'react';


import Posts from "../Posts"
import './App.css';


class App extends Component {

  constructor(props) {

      super(props);
      this.state = {
        posts:[],
      }

  }

  componentDidMount() {

    Promise.all([ fetch("https://jsonplaceholder.typicode.com/posts"), fetch("https://jsonplaceholder.typicode.com/comments")])
    .then( ( responses ) => {
          return Promise.all(responses.map(function (response) {
            return response.json();
          }));
    })
    .then(( [ posts, allComments ] ) => {

          const propertiesPropsThatNeeded = {

            averageRating:0,
            disable:false,
            
          }

          const propertiesListThatNeeded = {
            
            rating:0,
            replase:false,

          }

          const finalPostView = posts.map((el,index) => {

            const Comments = allComments.filter(item => item.postId === el.id);
            const postComments = Comments.map(item => { return {
              ...item,
              ...propertiesListThatNeeded
            } 
            });

          return ({
              ...el,
              ...propertiesPropsThatNeeded,
              comments: postComments
            })
          })
          
          this.setState({
            posts: finalPostView
          })
      })

  }

  addPostsComment = (data) => {

      this.setState({
        posts: [...data]
      });
      
  }

  changePostsComment = (data) => {
    const { posts } = this.state;
    const newPosts = [...posts];

    newPosts[data.postId-1].comments.forEach((element, index) => {

        if(element.id === data.id) {
        
          newPosts[data.postId-1].comments[index] = data;

        }
       
    })

    this.setState({
      posts:newPosts
    }) 
  }
  
  render() {
      const { posts } = this.state

    return (
      <>
       { posts.length !== 0 ? <Posts data={posts} addPostsComment={this.addPostsComment}  method={this.changePostsComment}/> : null
       }
      </>

    )
  }

} 

export default App;
