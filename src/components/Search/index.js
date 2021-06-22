import { Component, Fragment } from 'react';
import { escapeRegExp } from "lodash"
import './Search.css'

class Search extends Component {
    constructor(props){
        super(props)
        this.state = {
            search:"",
            dataSearch:[],
            classNameShowResult: "box_result"
        }
    }

    search = () => {
      const { data }  = this.props
      const filterResult = this.filterByNames(data,this.state.search).length === 0 ? "The Post not exest": this.filterByNames(data,this.state.search);

      this.setState({
          ...this.state,
          dataSearch: filterResult,
          classNameShowResult: "box_result display"
      })
   
    }


    filterByNames = (data, inputValue) => {
        // Create a dynamic regex expression object with ignore case sensitivity
        const re = new RegExp( escapeRegExp(inputValue), "i");
        const results = data.filter((object) => {
          if (object.title.match(re)) {

            return true;

          } else {
            return object.comments.some((item) => {

              if (item.name.match(re)) {
                return true;
              } else {
                return false;
              }
            });

          }
        });
        return results;
      };

    render() {
        const { dataSearch, classNameShowResult  } = this.state
        return (
            <>
            <div className="searchBox">
                    <input className="searchInput" type="text" name="" placeholder="Search" value={this.state.search} onChange={(e) => { this.setState({ search:e.target.value })}}/>
                    <button className="searchButton" href="#" onClick={this.search}>
                        <i className="material-icons">
                            S
                        </i>
                    </button>
            </div>
            <div className={`${classNameShowResult}`}>
            {
            typeof dataSearch === "string" ?  <h2>{dataSearch}</h2>  :  dataSearch.map((el, index) => {
                    return (
                        <div className="item_box" key={`posts_${index}`}>
                          <div>
                            <p className="heder_p">title</p> 
                            <p>{index+1 +") "+ el.title}</p>   
                            <p className="heder_p">comments</p>   
                        </div>    
                    { 
                        el.comments.map((el,index) => {
                            return (
                                <div className="comment_side"  key={`comment_${index}`}>
                                <p className="comment_padding">{index+1 + ")"}</p>
                                <p> { el.name } </p>
                                </div>
                            )
                        })

                    }
                   </div>
                    )
                })
            }
            </div>
        </>
         )
    }
}

export default Search;