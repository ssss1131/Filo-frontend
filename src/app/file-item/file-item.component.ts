import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { StoredFile } from '../core/models/stored-file';
import {DatePipe, NgIf} from '@angular/common';
import {ClickOutsideDirective} from '../core/directive/click-outside.directive';
import {ResourceService} from '../core/services/resource.service';

@Component({
  selector: 'app-file-item',
  templateUrl: './file-item.component.html',
  imports: [
    DatePipe,
    ClickOutsideDirective,
    NgIf
  ],
  styleUrls: ['./file-item.component.css']
})
export class FileItemComponent {
  @Input() file!: StoredFile;
  isFileActionsOpen: boolean = false;
  private isMobile: boolean;

  constructor(private router: Router,
              private resourceService: ResourceService) {
    this.isMobile = /Mobi|Android/i.test(navigator.userAgent);
  }

  handleClick(file: StoredFile, event: MouseEvent): void {
    if (this.isMobile && file.type === 'FOLDER') {
      this.openFolder(file);
    }
  }

  handleDblClick(file: StoredFile): void {
    // На ПК открываем папку по двойному клику
    if (!this.isMobile && file.type === 'FOLDER') {
      this.openFolder(file);
    }
  }

  openFolder(file: StoredFile): void {
    const newPath = `/home?path=${encodeURIComponent(file.path)}`;
    this.router.navigateByUrl(newPath);
  }

  toggleFileActions(event: MouseEvent): void {
    event.stopPropagation();
    this.isFileActionsOpen = !this.isFileActionsOpen;
  }

  closeFileActions(): void {
    this.isFileActionsOpen = false;
  }

  download(): void {
    console.log('Download object:', this.file);
    this.closeFileActions();
    this.resourceService.downloadObject(this.file.path);

  }

  move(): void {
    console.log('Move file:', this.file);
    this.closeFileActions();
  }

  rename(): void {
    console.log('Rename file:', this.file);
    this.closeFileActions();
  }

  delete(): void {
    console.log('Delete file:', this.file);
    this.closeFileActions();
  }
}
