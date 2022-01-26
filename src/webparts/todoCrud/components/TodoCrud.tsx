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
import Modal from "./Modal/Modal";

export interface Todo {
  Id: number;
  Title: string;
  description: string;
  status?: boolean;
}

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
