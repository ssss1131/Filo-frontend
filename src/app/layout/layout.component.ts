import {Component, ViewChild, ElementRef} from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {first, Observable} from 'rxjs';
import {User} from '../core/models/user';
import {AuthService} from '../core/services/auth.service';
import {FormsModule} from '@angular/forms';
import {ResourceService} from '../core/services/resource.service';
import {AsyncPipe, CommonModule, NgOptimizedImage} from '@angular/common';
import {ClickOutsideDirective} from '../core/directive/click-outside.directive';
import {DirectoryService} from '../core/services/directory.service';
import {ModalComponent} from '../shared/modal/modal.component';
import {NotificationService} from '../core/services/notification.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  imports: [FormsModule, RouterOutlet, AsyncPipe, CommonModule, ClickOutsideDirective, ModalComponent, NgOptimizedImage]
})
export class LayoutComponent {
  isNewMenuOpen = false;
  isCreateFolderOpen = false;
  usedStorage = 100;
  totalStorage = 500;
  searchQuery: string = '';
  user$: Observable<User | null>;
  path: string = '';

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('folderInput') folderInput!: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private resourceService: ResourceService,
    private directoryService: DirectoryService,
    private notifyService: NotificationService
  ) {
    this.user$ = this.authService.user$;
    this.route.queryParams.subscribe(params => {
      this.path = params['path'] || '';
    });
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  logout() {
    this.authService.logout().subscribe(() => this.router.navigate(['/auth/login']));
  }

  search() {
    if (this.searchQuery.trim()) {
      this.router.navigate(["/search"], {queryParams: {q: this.searchQuery}});
    }
  }

  clickCreateFolder() {
    this.isNewMenuOpen = false;
    this.isCreateFolderOpen = true;
  }

  clickUploadFile() {
    this.isNewMenuOpen = false;
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  clickUploadFolder() {
    this.isNewMenuOpen = false;
    if (this.folderInput) {
      this.folderInput.nativeElement.click();
    }
  }

  handleCreateFolder(name: string) {
    if (name.trim()) {
      this.directoryService.createFolder(this.path, name).subscribe({
        next: () => this.notifyService.success("Folder created successfully!"),
        error: (err: HttpErrorResponse) => {
          switch (err.status) {
            case 409:
              this.notifyService.error("Folder with name '" + name + "' already exists!");
              break;
            case 500:
              this.notifyService.error("Server error, please try again later");
              break;
            default:
              this.notifyService.error("Failed to upload files");
          }
        }
      });
      this.isCreateFolderOpen = false;
    }
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files) return;

    this.resourceService.uploadFilesToServer(Array.from(files), this.path)
      .subscribe({
        next: () => this.notifyService.success("Files uploaded successfully!"),
        error: (err: HttpErrorResponse) => {
          switch (err.status) {
            case 409:
              this.notifyService.error(err.message);
              break;
            case 500:
              this.notifyService.error("Server error, please try again later");
              break;
            default:
              this.notifyService.error("Failed to upload files");
          }
        }
      });
  }


  handleFolderUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.resourceService.uploadFilesToServer(Array.from(input.files), this.path).subscribe({
        next: () => this.notifyService.success("Folders uploaded successfully!"),
        error: (err: HttpErrorResponse) => {
          switch (err.status) {
            case 500:
              this.notifyService.error("Server error, please try again later");
              break;
            default:
              this.notifyService.error("Failed to upload files");
          }
        }
      });
      input.value = '';
    }
  }

  get storageUsedPercent(): number {
    return (this.usedStorage / this.totalStorage) * 100;
  }

  toggleNewMenu() {
    this.isNewMenuOpen = !this.isNewMenuOpen;
  }

  closeMenu() {
    this.isNewMenuOpen = false;
  }

  closeModal() {
    this.isCreateFolderOpen = false;
  }

}
