import * as React from 'react';
import styles from './TodoForm.module.scss';
import { useState } from 'react';
import { sp } from "@pnp/sp";



function TodoForm(props): JSX.Element {


  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const _addListItemsToSP = async (todo) => {
    try {
      const item = await sp.web.lists.getByTitle("TodoList").items.add(todo);
      props._getListItemsFromSP();
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newTodo = {
      Title: title,
      description: description,
      status: false,
    };
    _addListItemsToSP(newTodo);
  };

  return (
    <div className={styles.formWrapper}>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className={styles.formInputWrapper}>
          <label htmlFor="formInputTitle"></label>
          <input type="text" onChange={(e) => setTitle(e.target.value)} className="formInput" id='formInputTitle' />
        </div>
        <div className={styles.formInputWrapper}>
          <label htmlFor="formInputDescription"></label>
          <input type="text" onChange={(e) => setDescription(e.target.value)} className="formInput" id='formInputDescription' />
        </div>
        <div className={styles.formInputWrapper}>
          <input type="submit" className="btn" value="Add Todo" />
        </div>
      </form>
    </div>
  );
}

export default TodoForm;
