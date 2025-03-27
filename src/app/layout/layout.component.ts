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
    private directoryService: DirectoryService
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
      this.directoryService.createFolder(this.path, name);
      this.isCreateFolderOpen = false;
    }
  }
  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files) {
      this.resourceService.uploadFilesToServer(Array.from(files), this.path);
    }
  }


  handleFolderUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.resourceService.uploadFilesToServer(Array.from(input.files), this.path);
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
