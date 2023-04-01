import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, setDoc, Timestamp, updateDoc } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, uploadString } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export interface Task {
  id?: string;
  title: string;
  description: string;
  created?: Date;
  due_date: Date;
  owner: string;
  status: string;
  closed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage
  ) { }

  getTasks(): Observable<Task[]> {
    const tasks = collection(this.firestore, 'tasks');
    return collectionData(tasks, { idField: 'id' }) as
      Observable<Task[]>;
  }

  getTaskById(id: string): Observable<Task> {
    const task = doc(this.firestore, `tasks/${id}`);
    return docData(task, { idField: 'id' }) as Observable<Task>;
  }

  addTask(task: Task) {
    const taskref = collection(this.firestore, 'tasks');
    return addDoc(taskref, task);
  }

  deleteTask(task: Task) {
    const taskref = doc(this.firestore, `tasks/${task.id}`);
    return deleteDoc(taskref);
  }

  updateTask(task: Task) {
    const taskref = doc(this.firestore, `tasks/${task.id}`);
    return updateDoc(taskref, {
      title: task.title,
      description: task.description,
      due_date: task.due_date,
      status: task.status,
      closed: task.closed
    });
  }

  getUserProfile() {
    const user = this.auth.currentUser;
    const userref = doc(this.firestore, `users/${user?.uid}`);
    return docData(userref, { idField: 'uid' });
  }
}
