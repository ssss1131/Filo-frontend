import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {ResourceService} from '../core/services/resource.service';
import {Resource} from '../core/models/resource';
import {FileItemComponent} from '../file-item/file-item.component';

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
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentPath = params['path'] || '';
      this.loadFiles();
    });
  }

  loadFiles(): void {
    this.resourceService.getResources(this.currentPath).subscribe(files => {
      this.files = files;
    });
  }
}
