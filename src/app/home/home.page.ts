import { Component, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Task, DataService } from '../services/data.service';
import { DocumentData } from '@angular/fire/firestore';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tasks: Task[] = [];
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
      this.cd.detectChanges();
    });

  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  async openTask(task: Task){
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: { id: task.id }
    });
    return await modal.present();
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
              priority: 'low',
              status: 'open'
            }
            await this.dataService.addTask(task);
          }
        }
      ]
    });
    await alert.present();
  }




}
