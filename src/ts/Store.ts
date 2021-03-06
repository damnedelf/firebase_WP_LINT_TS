import { QueryDocumentSnapshot } from '@firebase/firestore-types';

import { db } from './firestoreConfig';
const todosRef = db.collection('todos');

class StoreTodos {
  async post(todo: ItodoObj) {
    try {
      const newTodo = await todosRef.add({
        name: `${todo.data.name}`,

        isCompleted: todo.data.isCompleted,
        order: todo.data.order,
      });
      return newTodo.id;
    } catch (error) {
      console.log(error);
    }
  }
  //get todoArray
  async getAll() {
    const todoArray: ItodoObj[] = [];

    try {
      const todos = await todosRef.orderBy('order').get();
      await todos.forEach((doc: QueryDocumentSnapshot<any>) => {
        todoArray.push({ data: doc.data(), id: doc.id });
      });
    } catch (error) {
      console.log(`get all error ${error}`);
    }

    return todoArray;
  }
  //for delete
  async delete(id: string) {
    try {
      await todosRef.doc(id).delete();
    } catch (error) {
      console.log(`delete: ===>>> ${error}`);
    }
  }

  // mark isCompleted
  async update(id: string, reqBody: IorderBody) {
    try {
      if (!reqBody) {
        const todoForUpdate = await todosRef.doc(id).get();

        const condition = todoForUpdate.data().isCompleted;

        todosRef.doc(id).update({ isCompleted: !condition });
      } else {
        await todosRef.doc(reqBody.id).update({ order: reqBody.order });
      }
    } catch (error) {
      console.log(`update===>>>${error}`);
    }
  }
  ///for mark/unmark all isCompleted
  async updateAll(status: boolean) {
    try {
      const allTodos = await db.collection('todos').get();
      await allTodos.forEach((todo: QueryDocumentSnapshot) => {
        todo.ref.update({
          isCompleted: status,
        });
      });
    } catch (error) {
      console.log(error);
    }
  }
}
//local storage for filter condition
class StoreFilterStatus {
  setFilterStatus(status: string): void {
    localStorage.setItem('status', status);
  }
  getFilterStatus(): string | undefined | null {
    if (localStorage.getItem('status')) {
      return localStorage.getItem('status');
    } else {
      return 'noFilter';
    }
  }
}
const storeTodos = new StoreTodos();
const storeFilterStatus = new StoreFilterStatus();

export { storeTodos };
export { storeFilterStatus };
