import * as React from 'react';
import {useState, useEffect} from 'react'
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import styles from '../TodoCrud.module.scss';

const Modal = (props): JSX.Element => {

    const [title, setTitle] = useState<string>(props.Title);
    const [description, setDescription] = useState<string>(props.description);
  
    const handleUpdate = async (e:React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault();
      const updatedTodo = {
        Title:title,
        description:description
      };
      let list = sp.web.lists.getByTitle("TodoList");
      const i = await list.items.getById(props.Id).update(updatedTodo);
      props._getListItemsFromSP();
      props.setModal();
    }
    
    return (
      <div className={styles.detailListModal}>
        <div className={styles.modalInner}>
          <form onSubmit={(e)=>handleUpdate(e)}>
            <div>
              <label htmlFor="formInputTitle"></label>
              <input 
              type="text" 
              value={title} 
              className="formInput" 
              id="formInputTitle"
              onChange={(e)=>setTitle(e.target.value)} 
              />
            </div>
            <div>
              <label htmlFor="formInputDescription"></label>
              <input
                type="text"
                className="formInput"
                id="formInputDescription"
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
              />
            </div>
            <div>
              <input type="submit" className="btn" value="Update Todo" />
            </div>
          </form>
          {/* <div className={styles.closeBtn} >x</div> */}
        </div>
      </div>
    );
  };

export default Modal;
