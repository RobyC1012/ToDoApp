import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { AuthData } from '../model/auth-data';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: Auth,
    private firestore: Firestore,
  ) { }

  async register({ email, password }: AuthData) {
    try {
      const { user } = await createUserWithEmailAndPassword(this.auth, email, password);
      const userRef = doc(this.firestore, 'users', user.uid);
      const userData = { email: user.email };
      await setDoc(userRef, userData);
      return user;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async login({ email, password }: AuthData) {
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      return user;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
    } catch (e) {
      console.log(e);
    }
  }
}
