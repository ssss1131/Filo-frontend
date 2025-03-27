import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {ResourceService} from '../core/services/resource.service';
import {StoredFile} from '../core/models/stored-file';
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
  files: StoredFile[] = [];
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
    this.resourceService.getAllObjects(this.currentPath).subscribe(files => {
      this.files = files;
    });
    // this.files = [
    //   {
    //     path: "report.pdf",
    //     name: "report.pdf",
    //     size: 1048576,
    //     type: "FILE",
    //     date: new Date("2024-03-13T14:30:00.000Z")
    //   },
    //   {
    //     path: "report.pdf",
    //     name: "report.pdf",
    //     size: 1048576,
    //     type: "FILE",
    //     date: new Date("2024-03-13T14:30:00.000Z")
    //   },{
    //     path: "report.pdf",
    //     name: "report.pdf",
    //     size: 1048576,
    //     type: "FILE",
    //     date: new Date("2024-03-13T14:30:00.000Z")
    //   },{
    //     path: "report.pdf",
    //     name: "report.pdf",
    //     size: 1048576,
    //     type: "FILE",
    //     date: new Date("2024-03-13T14:30:00.000Z")
    //   },{
    //     path: "report.pdf",
    //     name: "report.pdf",
    //     size: 1048576,
    //     type: "FILE",
    //     date: new Date("2024-03-13T14:30:00.000Z")
    //   },
    //   {
    //     path: "report.pdf",
    //     name: "report.pdf",
    //     size: 1048576,
    //     type: "FILE",
    //     date: new Date("2024-03-13T14:30:00.000Z")
    //   },{
    //     path: "report.pdf",
    //     name: "report.pdf",
    //     size: 1048576,
    //     type: "FILE",
    //     date: new Date("2024-03-13T14:30:00.000Z")
    //   },
    //   {
    //     path: "report.pdf",
    //     name: "report.pdf",
    //     size: 1048576,
    //     type: "FILE",
    //     date: new Date("2024-03-13T14:30:00.000Z")
    //   },
    //   {
    //     path: "report.pdf",
    //     name: "report.pdf",
    //     size: 1048576,
    //     type: "FILE",
    //     date: new Date("2024-03-13T14:30:00.000Z")
    //   },
    // ];
  }
}
