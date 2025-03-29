import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {StoredFile} from '../models/stored-file';
import {map} from 'rxjs/operators';
import {API_URLS, FOLDER_DELIMITER} from '../../shared/constants/api-constants';
import {saveAs} from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  private apiUrl = API_URLS.RESOURCE;
  private folderDelimiter = FOLDER_DELIMITER;

  constructor(private http: HttpClient) {
  }

  getResources(path: string): Observable<StoredFile[]> {
    const params = new HttpParams().set('path', path);
    return this.http.get<StoredFile[]>(this.apiUrl, {params}).pipe(
      map(files =>
        files.map(file => ({
          ...file,
          modifiedData: new Date(file.modifiedData)
        }))
      )
    );
  }

  uploadFilesToServer(files: File[], path: string): void {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    const params = new HttpParams().set('path', path);
    this.http.post<StoredFile[]>(this.apiUrl, formData, {params: params}).subscribe();
  }

  downloadResource(path: string): void {
    const params = new HttpParams().set('path', path);
    this.http.get(this.apiUrl + FOLDER_DELIMITER + 'download', {
      params: params,
      responseType: 'blob',
      observe: 'response'
    }).subscribe({
      next: (response) => {
        let name = 'downloaded_object';
        const disposition = response.headers.get('Content-Disposition');
        if (disposition) {
          let matches = /filename\*=UTF-8''(.+)/.exec(disposition);
          if (matches && matches[1]) {
            try {
              name = decodeURIComponent(matches[1]);
            } catch (e) {
              name = matches[1];
            }
          } else {
            matches = /filename="(.+?)"/.exec(disposition);
            if (matches && matches[1]) {
              name = matches[1];
            }
          }
        }
        const blob = response.body;
        if (blob) {
          saveAs(blob, name);
        }
      },
      error: (error) => {
        console.error('Error downloading object:', error);
      }
    });
  }

  deleteResource(path: string) : void{
    let param = new HttpParams().set("path", path);
    this.http.delete(this.apiUrl, {params: param}).subscribe();
  }

}
