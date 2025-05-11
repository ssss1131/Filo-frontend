import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {ResourceService} from '../core/services/resource.service';
import {Resource} from '../core/models/resource';
import {FileItemComponent} from '../file-item/file-item.component';
import {HttpErrorResponse} from '@angular/common/http';
import {NotificationService} from '../core/services/notification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    FileItemComponent,
    CommonModule
  ],
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  files: Resource[] = [];
  currentPath: string = '';

  constructor(
    private resourceService: ResourceService,
    private notifyService: NotificationService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentPath = params['path'] || '';
      this.loadFiles();
    });
    this.resourceService.onRefreshNeeded
      .subscribe(() => this.loadFiles());
  }

  loadFiles(): void {
    this.resourceService.getResources(this.currentPath).subscribe({
        next: (files: Resource[]) => {
          this.files = files;
        },
      error: (err: HttpErrorResponse) =>{
          switch (err.status){
            case 400:
              this.notifyService.error("Please write valid path that exist!");
              break;
            default:
              this.notifyService.error("Something went wrong, please try again later!");
              break;
          }
      }
      }
    );
  }
}
