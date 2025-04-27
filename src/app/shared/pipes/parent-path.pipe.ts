import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parentPath'
})
export class ParentPathPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';
    let trimmed = value.endsWith('/') ? value.slice(0, -1) : value;
    let lastSlash = trimmed.lastIndexOf('/');
    if (lastSlash === -1) {
      return '';
    }
    return trimmed.substring(0, lastSlash + 1);
  }
}
