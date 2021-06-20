import { Component } from 'react';

import './List.css';

class List extends Component {

    render() {

        const { add,remove,sortList ,title,data,listToggle } = this.props;
        
        return(

            <div className="main_list_div">
                <div className="button_toggle_add">
                        <button onClick={() => { add(title) }} className="add_sort_button">+</button>
                        <button onClick={() => { sortList(title,listToggle) }}  className="add_sort_button">{listToggle === true ? <span>&#8593;</span> : <span>&#8595;</span> }</button>
                </div>
                <div className="list_main_div_for_item">
                        {
                            data.map((el,index) => {
                                return (
                                <div className="posts_list_block">
                                    <div className="post_id_block">
                                        <p>{el.id}</p>
                                    </div>
                                    <div className="post_block_list">
                                        <p>{el.title}</p>
                                        <p>{el.finalRating}</p>
                                    </div>
                                    <div className={"remove_button"}>
                                        <button onClick={()=> { remove(el,title,index) }} className={"button"}> <span>&#215;</span> </button>
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