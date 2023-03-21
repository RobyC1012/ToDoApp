import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, uploadString } from '@angular/fire/storage';
import { Observable } from 'rxjs';

export interface Task{
  id?: string;
  title: string;
  description: string;
  priority: string;
  status: string;
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

  getTasks(): Observable<Task[]>{
    const tasks = collection(this.firestore, 'tasks');
    return collectionData(tasks, {idField: 'id'}) as
      Observable<Task[]>;
  }

  getTaskById(id: string): Observable<Task>{
    const task = doc(this.firestore, 'tasks/${id}');
    return docData(task, { idField: 'id'}) as Observable<Task>;
  }

  addTask(task: Task){
    const taskref = collection(this.firestore, 'tasks');
    return addDoc(taskref, task);
  }

  deleteTask(task: Task){
    const taskref = doc(this.firestore, 'tasks/${task.id}');
    return deleteDoc(taskref);
  }

  updateTask(task: Task){
    const taskref = doc(this.firestore, 'tasks/${task.id}');
    return updateDoc(taskref, {
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status
    })
  }

  getUserProfile(){
    const user = this.auth.currentUser;
    const profile = doc(this.firestore, `users/${user!.uid}`);
    return docData(profile, {idField: 'id'});
  }




}
