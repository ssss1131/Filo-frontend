import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private defaultConfig: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'bottom',
  };

  constructor(private snackBar: MatSnackBar) {}

  success(message: string) {
    this.snackBar.open(message, '×', {
      ...this.defaultConfig,
      panelClass: ['snackbar-success']
    });
  }

  error(message: string) {
    this.snackBar.open(message, '×', {
      ...this.defaultConfig,
      panelClass: ['snackbar-error']
    });
  }

  info(message: string) {
    this.snackBar.open(message, '×', {
      ...this.defaultConfig,
      panelClass: ['snackbar-info']
    });
  }
}
