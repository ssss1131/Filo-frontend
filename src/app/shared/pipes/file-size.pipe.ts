import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filesize' })
export class FileSizePipe implements PipeTransform {
  transform(bytes: number): string {
    if (bytes == null || isNaN(bytes)) return '';
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${Math.round(kb)} KB`;
    }
    const mb = kb / 1024;
    if (mb < 1024) {
      return `${Math.round(mb)} MB`;
    }
    const gb = mb / 1024;
    return `${Math.round(gb)} GB`;
  }
}
