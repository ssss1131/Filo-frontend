import {Injectable} from '@angular/core';
import {API_URLS, FOLDER_DELIMITER} from '../../shared/constants/api-constants';
import {HttpClient, HttpParams} from '@angular/common/http';
import {finalize, Observable} from 'rxjs';
import {Resource} from '../models/resource';
import {FolderInfo} from '../models/folderInfo';
import {ResourceService} from './resource.service';

@Injectable({
  providedIn: 'root'
})
export class DirectoryService {

  private apiUrl = API_URLS.DIRECTORY;
  private folderDelimiter = FOLDER_DELIMITER;

  constructor(private http: HttpClient,
              private resourceService:ResourceService) {
  }

  createFolder(path: string, name: string): Observable<void> {
    const params = new HttpParams().set('path', path + name + this.folderDelimiter);
    return this.http.post<void>(this.apiUrl, {}, {params: params}).pipe(finalize(() => this.resourceService.notifyRefreshNeeded()));
  }

  getAvailableFolders(path: string): Observable<FolderInfo[]> {
    const params = new HttpParams().set('path', path);
    return this.http.get<FolderInfo[]>(this.apiUrl + '/available', { params });
  }


}
