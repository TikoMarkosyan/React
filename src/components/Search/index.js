import { Component } from 'react';
import { escapeRegExp } from "lodash"
import './Search.css'

class Search extends Component {
    constructor(props){
        super(props);

        this.state = {
            search:"",
            dataSearch:[],
            showResult: false,
        };

    }

    search = () => {
      const { data }  = this.props;
      const filterResult =  this.filterByNames(data,this.state.search);

      this.setState({
          dataSearch: filterResult,
          showResult: true,
      })
   
    }

    filterByNames = ( data, inputValue ) => {

        const results = data.filter((object) => {
          if (object.title.includes(inputValue)) {
              return true;
          } else {
              return object.comments.some((item) => {
                  if (item.name.includes(inputValue)) {
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

        const { dataSearch, showResult  } = this.state;
        const classNameShowResult = showResult === false  ? "box_result"  : "box_result display";
        return (
            <>
                <div className="searchBox">
                        <input className="searchInput" 
                            type="text" name="" 
                            placeholder="Search"
                            value={this.state.search}
                            onChange={(e) => this.setState({ search:e.target.value }) } 
                        />
                        <button className="searchButton" href="#" onClick={this.search}>
                            <i className="material-icons">
                                S
                            </i>
                        </button>
                </div>
                <div className={`${classNameShowResult}`}>
                      {
                           dataSearch.length === 0 ?  <h2>Sorry not Found</h2>  :  dataSearch.map((el, index) => {
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