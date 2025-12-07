import {Component, ViewChild, ElementRef} from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {Observable} from 'rxjs';
import {User} from '../core/models/user';
import {FormsModule} from '@angular/forms';
import {ResourceService} from '../core/services/resource.service';
import {AsyncPipe, CommonModule, NgOptimizedImage} from '@angular/common';
import {ClickOutsideDirective} from '../core/directive/click-outside.directive';
import {DirectoryService} from '../core/services/directory.service';
import {ModalComponent} from '../shared/modal/modal.component';
import {NotificationService} from '../core/services/notification.service';
import {HttpErrorResponse} from '@angular/common/http';
import {UserService} from '../core/services/user.service';
import {UserQuota} from '../core/models/user-quota';
import {map} from 'rxjs/operators';
import {FileSizePipe} from '../shared/pipes/file-size.pipe';
import {TranslateModule} from '@ngx-translate/core';
import {LanguageService} from '../core/services/language.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  imports: [FormsModule, RouterOutlet, AsyncPipe, CommonModule, ClickOutsideDirective, ModalComponent, NgOptimizedImage, FileSizePipe, TranslateModule]
})
export class LayoutComponent {

  isNewMenuOpen = false;
  isCreateFolderOpen = false;
  searchQuery: string = '';
  user$: Observable<User | null>;
  quota$: Observable<UserQuota | null>;
  storageUsedPercent$: Observable<number>;
  path: string = '';

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('folderInput') folderInput!: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private resourceService: ResourceService,
    private directoryService: DirectoryService,
    private notifyService: NotificationService,
    public languageService: LanguageService
  ) {
    this.userService.loadQuota();
    this.user$ = this.userService.user$;
    this.quota$ = this.userService.quota$;

    this.storageUsedPercent$ = this.quota$.pipe(
      map(quota => {
        if (!quota || quota.quotaBytes === 0) {
          return 0;
        }
        return (Number(quota.usedBytes) / Number(quota.quotaBytes)) * 100;
      })
    );

    this.route.queryParams.subscribe(params => {
      this.path = params['path'] || '';
    });
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  logout() {
    this.userService.logout().subscribe(() => this.router.navigate(['/auth/login']));
  }

  search() {
    if (this.searchQuery.trim()) {
      this.router.navigate(["/search"], {queryParams: {query: this.searchQuery}});
    }else {
      this.notifyService.info("Please enter something");
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
        next: () => this.notifyService.success("Folder '" + name + "' created successfully!"),
        error: (err: HttpErrorResponse) => {
          switch (err.status) {
            case 400:
              this.notifyService.error("Please name folder in valid format");
              break;
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
              this.notifyService.error("File with such name already exists");
              break;
            case 413:
              this.notifyService.error("Upload failed: you have exceeded your 500 MB storage quota.");
              break;
            case 500:
              this.notifyService.error("Server error, please try again later");
              break;
            default:
              this.notifyService.error("" +
                "Failed to upload files " +
                "This usually happens when a file exceeds the maximum allowed size (500 MB)."
              );
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
            case 409:
              this.notifyService.error("Folder with such name already exists");
              break;
            case 413:
              this.notifyService.info("Upload failed: you have exceeded your 500 MB storage quota.");
              break;
            case 500:
              this.notifyService.error("Server error, please try again later");
              break;
            default:
              this.notifyService.error("" +
                "Failed to upload folder " +
                "This usually happens when a folder exceeds the maximum allowed size (500 MB)."
              );
          }
        }
      });
      input.value = '';
    }
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

  switchLanguage(lang: string) {
    this.languageService.setLanguage(lang);
  }

}
