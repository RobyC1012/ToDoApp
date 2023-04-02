import { Component, OnInit } from '@angular/core';
import { Task, DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { DocumentData } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-addtodo',
  templateUrl: './addtodo.page.html',
  styleUrls: ['./addtodo.page.scss'],
})
export class AddtodoPage {
  profile!: DocumentData;
  
  myText!: string;
  charCount: number = 0;

  countChars(event: any) {
    this.charCount = event.target.value.length;
  }

  constructor(
    private dataService: DataService,
    private router: Router
  ) { 

    this.dataService.getUserProfile().subscribe(res => {
      this.profile = res;
    })
  
  }

  getTodayDateTime() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const hour = String(today.getHours()).padStart(2, '0');
    const minute = String(today.getMinutes()).padStart(2, '0');
    const current_date = year + '-' + month + '-' + day + 'T' + hour + ':' + minute;
    return current_date;
  }

  onSubmit(form: NgForm){
    console.log(form.value);
    const task: Task = {
      title: form.value.title,
      description: form.value.description,
      owner: this.profile.uid,
      created: new Date(),
      due_date: form.value.due_date,
      status: 'open',
      closed: false
    }

    this.dataService.addTask(task).then(res => {
      this.router.navigateByUrl('/home');
    });
  }


}
