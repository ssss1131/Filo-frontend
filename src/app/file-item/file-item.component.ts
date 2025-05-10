import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {Resource} from '../core/models/resource';
import {CommonModule} from '@angular/common';
import {ClickOutsideDirective} from '../core/directive/click-outside.directive';
import {ResourceService} from '../core/services/resource.service';
import {ModalComponent} from '../shared/modal/modal.component';
import {FormsModule} from '@angular/forms';
import {DirectoryService} from '../core/services/directory.service';
import {FolderInfo} from '../core/models/folderInfo';
import {ParentPathPipe} from '../shared/pipes/parent-path.pipe';
import {FOLDER_DELIMITER} from '../shared/constants/api-constants';
import {FileSizePipe} from '../shared/pipes/file-size.pipe';
import {HttpErrorResponse} from '@angular/common/http';
import {NotificationService} from '../core/services/notification.service';

@Component({
  selector: 'app-file-item',
  templateUrl: './file-item.component.html',
  imports: [
    CommonModule,
    ClickOutsideDirective,
    ModalComponent,
    FormsModule,
    ParentPathPipe,
    FileSizePipe
  ],
  styleUrls: ['./file-item.component.css']
})
export class FileItemComponent {

  @Input() file!: Resource;

  availableFolders: FolderInfo[] = [];
  selectedFolderPath: string | null = null;

  isFileActionsOpen: boolean = false;
  isRenameResourceOpen: boolean = false;
  isMoveResourceOpen: boolean = false;
  private isMobile: boolean;

  constructor(private router: Router,
              private resourceService: ResourceService,
              private directoryService: DirectoryService,
              private notifyService: NotificationService) {
    this.isMobile = /Mobi|Android/i.test(navigator.userAgent);
  }

  handleClick(file: Resource, event: MouseEvent): void {
    if (this.isMobile && file.type === 'FOLDER') {
      this.openFolder(file);
    } else if(this.isMobile) {
      this.isFileActionsOpen = !this.isFileActionsOpen;
    }
  }

  handleDblClick(file: Resource): void {
    if (!this.isMobile && file.type === 'FOLDER') {
      this.openFolder(file);
    }else if(!this.isMobile) {
      this.isFileActionsOpen = !this.isFileActionsOpen;
    }
  }

  openFolder(file: Resource): void {
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
    this.resourceService.downloadResource(this.file.path);

  }

  move(): void {
    console.log('Move file:', this.file);
    this.closeFileActions();
    this.directoryService.getAvailableFolders(this.file.path).subscribe(
      folders => this.availableFolders = folders
    );
    this.isMoveResourceOpen = true;
  }

  rename(): void {
    console.log('Rename file:', this.file);
    this.closeFileActions();
    this.isRenameResourceOpen = true;
  }

  delete(): void {
    console.log('Delete file:', this.file);
    this.closeFileActions();
    this.resourceService.deleteResource(this.file.path).subscribe({
      next: () => this.notifyService.success("Successfully deleted '" + this.file.name + "'!"),
      error: (err: HttpErrorResponse) => {
      switch (err.status) {
        case 500:
          this.notifyService.error("Server error, please try again later");
          break;
        default:
          this.notifyService.error("Failed to delete '" + this.file.name + "':(");
      }
    }}
    );
  }

  closeModal() {
    this.isRenameResourceOpen = false;
    this.isMoveResourceOpen = false;
  }

  handleRenameResource(to: string) {
    let dotIndex = this.file.name.lastIndexOf(".");
    let newNameWithExtension = dotIndex !== -1 ? to + this.file.name.substring(dotIndex) : to;
    let newPath = this.file.path.replace(this.file.name, newNameWithExtension);
    this.resourceService.move(this.file.path, newPath).subscribe({
      next: () => this.notifyService.info("Successfully renamed from '/" + this.file.name + "' to '/" + to +"'"),
      error: (err: HttpErrorResponse) => {
        switch (err.status) {
          case 500:
            this.notifyService.error("Server error, please try again later");
            break;
          default:
            this.notifyService.error("Failed to rename '" + this.file.name + "':(");
        }
    }});
    this.closeModal();
  }

  selectFolder(folder: FolderInfo) {
    this.selectedFolderPath = folder.path;
    console.log(this.selectedFolderPath);
  }

  confirmMove() {
    this.closeModal();
    this.resourceService.move(this.file.path, this.selectedFolderPath + (this.file.type == "FOLDER" ? this.file.name + FOLDER_DELIMITER : this.file.name))
      .subscribe({
        next: () => this.notifyService.info("Successfully moved from '/" + this.file.path + "' to '/" + this.selectedFolderPath + "'"),
        error: (err: HttpErrorResponse) => {
          switch (err.status) {
            case 500:
              this.notifyService.error("Server error, please try again later");
              break;
            default:
              this.notifyService.error("Failed to move '" + this.file.name + "':(");
          }
      }
        });
  }
}
