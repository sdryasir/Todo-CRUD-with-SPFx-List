import * as React from "react";
import { useEffect, useState } from "react";
import { sp } from "@pnp/sp";
import { DetailsList, IColumn } from "@fluentui/react/lib/DetailsList";
import styles from "./TodoCrud.module.scss";
import { ITodoCrudProps } from "./ITodoCrudProps";
import TodoForm from "./TodoForm/TodoForm";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Link } from "office-ui-fabric-react";

export interface Todo {
  Id: number;
  Title: string;
  description: string;
  status?: boolean;
}

export interface FuncProp{
  setModal(arg:boolean):void;
}

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

export default function TodoCrud(props: ITodoCrudProps) {
  const [todos, setTodos] = useState([]);
  const [selectdTodo, setSelectedTodo] = useState<Todo>(null);
  const [modal, setModal] = useState<boolean>(false);

  const [column, setColumn] = useState<IColumn[]>([
    {
      key: "column1",
      name: "Title",
      fieldName: "Title",
      minWidth: 100,
      maxWidth: 200,
      isResizable: false,
    },
    {
      key: "column2",
      name: "Description",
      fieldName: "description",
      minWidth: 100,
      maxWidth: 200,
      isResizable: false,
    },
    {
      key: "column4",
      name: "Edit",
      fieldName: "edit",
      minWidth: 100,
      maxWidth: 100,
      isResizable: false,
      onRender: (item: Todo) => (
        <Link
          onClick={() => {
            setModal(true);
            setSelectedTodo(item);
            _getListItemsFromSP();
          }}
        >
          Edit
        </Link>
      ),
    },
    {
      key: "column5",
      name: "Delete",
      fieldName: "delete",
      minWidth: 100,
      maxWidth: 100,
      isResizable: false,
      onRender: (item) => (
        <Link
          onClick={async () => {
            await sp.web.lists.getByTitle("TodoList").items.getById(item.Id).delete();
            _getListItemsFromSP();
          }}
        >
          Delete
        </Link>
      ),
    },
  ]);

  useEffect(() => {
    _getListItemsFromSP();
  }, []);

  const _getListItemsFromSP = async () => {
    try {
      const items = await sp.web.lists.getByTitle("TodoList").items.getAll();
      setTodos(items);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className={styles.todoCrud}>
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.column}>
            <TodoForm _getListItemsFromSP={()=>_getListItemsFromSP()} />
            <DetailsList items={todos} columns={column} compact={true} />
            { modal?<Modal {...selectdTodo} setModal={()=>setModal(false)} _getListItemsFromSP={()=>_getListItemsFromSP()}/>:'' }
            {/* <p>Continent where I reside: {escape(props.myContinent)}</p>
            <p>Number of Continent where I Visited: {props.numContinentsVisited}</p> */}
          </div>
        </div>
      </div>
    </div>
  );
}
