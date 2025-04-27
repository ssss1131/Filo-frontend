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

@Component({
  selector: 'app-file-item',
  templateUrl: './file-item.component.html',
  imports: [
    CommonModule,
    ClickOutsideDirective,
    ModalComponent,
    FormsModule,
    ParentPathPipe
  ],
  styleUrls: ['./file-item.component.css']
})
export class FileItemComponent {

  @Input() file!: Resource;

  availableFolders: FolderInfo[] = [];
  selectedFolderPath: string = "";

  isFileActionsOpen: boolean = false;
  isRenameResourceOpen: boolean = false;
  isMoveResourceOpen: boolean = false;
  private isMobile: boolean;

  constructor(private router: Router,
              private resourceService: ResourceService,
              private directoryService: DirectoryService) {
    this.isMobile = /Mobi|Android/i.test(navigator.userAgent);
  }

  handleClick(file: Resource, event: MouseEvent): void {
    if (this.isMobile && file.type === 'FOLDER') {
      this.openFolder(file);
    }
  }

  handleDblClick(file: Resource): void {
    if (!this.isMobile && file.type === 'FOLDER') {
      this.openFolder(file);
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
    this.resourceService.deleteResource(this.file.path);
  }

  closeModal() {
    this.isRenameResourceOpen = false;
    this.isMoveResourceOpen = false;
  }

  handleRenameResource(to: string) {
    let dotIndex = this.file.name.lastIndexOf(".");
    let newNameWithExtension = dotIndex !== -1 ? to + this.file.name.substring(dotIndex) : to;
    let newPath = this.file.path.replace(this.file.name, newNameWithExtension);
    this.resourceService.move(this.file.path, newPath);
    this.closeModal();
  }

  selectFolder(folder: FolderInfo) {
    this.selectedFolderPath = folder.path;
    console.log(this.selectedFolderPath);
  }

  confirmMove() {
    this.closeModal();
    this.resourceService.move(this.file.path, this.selectedFolderPath + (this.file.type == "FOLDER" ? this.file.name + FOLDER_DELIMITER : this.file.name));
  }
}
