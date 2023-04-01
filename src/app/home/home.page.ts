import { Component, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Task, DataService } from '../services/data.service';
import { DocumentData } from '@angular/fire/firestore';
import { AlertController, ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedFilter: string = "open";

  profile!: DocumentData;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dataService: DataService,
    private cd: ChangeDetectorRef,
    private alertController: AlertController,
    private modalController: ModalController

  ) {
    this.dataService.getUserProfile().subscribe(res => {
      this.profile = res;
    });
    this.dataService.getTasks().subscribe(res => {
      this.tasks = res;
      this.filteredTasks = res;
      this.applyFilter();
    });
  }

  filterOpenTasks() {
    this.filteredTasks = this.tasks;
    this.filteredTasks.sort((a, b) =>{
      if(a.closed && !b.closed) return 1;
      else if(!a.closed && b.closed) return -1;
      else return 0;
    })
  }

  filterDueTasks() {
    const fiveDaysFromNow = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    this.filteredTasks = this.tasks.filter(task => !task.closed && new Date(task.due_date) <= fiveDaysFromNow);
  }

  applyFilter() {
    if (this.selectedFilter === "open") {
      this.filterOpenTasks();
    } else if (this.selectedFilter === "due") {
      this.filterDueTasks();
    }
  }


  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }


  getTodayDateTime() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const hour = String(today.getHours()).padStart(2, '0');
    const minute = String(today.getMinutes()).padStart(2, '0');
    const current_date = year + '-' + month + '-' + day + 'T' + hour + ':' + minute;
    console.log(current_date);
    return current_date;
  }

  getStatus(task: Task)
  {
    if( task.status === "open" )
      return "dot blue";
    else if( task.status === "closed" )
      return "dot green";
    else if( task.status === "working" )
      return "dot orange";
    return "";
  }

  changeStatus(task: Task){
    if( task.status === "open" )
      task.status = "working";
    else if( task.status === "working" )
      task.status = "open";
    this.dataService.updateTask(task);
  }

  async openTask(task: Task) {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: { id: task.id }
    });
    return await modal.present();
  }

  async deleteTask(task: Task) {
    await this.dataService.deleteTask(task);
  }

  async markTask(task: Task){
    if( task.closed ){
      task.status = "open";
      task.closed = false;
    }
    else{
      task.status = "closed";
      task.closed = true;
    }
    await this.dataService.updateTask(task);
  }

  async addTask() {
    const alert = await this.alertController.create({
      header: 'Add Task',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Title'
        },
        {
          name: 'description',
          type: 'text',
          placeholder: 'Description'
        },
        {
          name: 'due_date',
          type: 'datetime-local',
          placeholder: 'Due Date',
          min: this.getTodayDateTime()
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          }
        }, {
          text: 'Ok',
          handler: async (data) => {
            const task: Task = {
              title: data.title,
              description: data.description,
              owner: this.profile.uid,
              created: new Date(),
              due_date: data.due_date,
              status: 'open',
              closed: false
            }
            await this.dataService.addTask(task);
          }
        }
      ]
    });
    await alert.present();
  }




}
function moment(due_date: Date) {
  throw new Error('Function not implemented.');
}

