import {Injectable} from '@angular/core';
import {API_URLS, FOLDER_DELIMITER} from '../../shared/constants/api-constants';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DirectoryService {

  private apiUrl = API_URLS.DIRECTORY;
  private folderDelimiter = FOLDER_DELIMITER;

  constructor(private http: HttpClient) {
  }

  createFolder(path: string, name: string): void {
    const params = new HttpParams().set('path', path + name + this.folderDelimiter);
    this.http.post<void>(this.apiUrl, {}, {params: params}).subscribe();
  }

}
