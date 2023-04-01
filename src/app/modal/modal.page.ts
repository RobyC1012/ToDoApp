import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataService, Task } from '../services/data.service';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @Input() id!: string;
  task!: Task;

  constructor(
    private modalController: ModalController,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.getTaskById(this.id).subscribe(res => {
      this.task = res;
      console.log("success");
    });
    console.log("passed");
  }

  async dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
