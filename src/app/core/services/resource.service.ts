import {Injectable} from '@angular/core';
import {finalize, Observable, Subject} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Resource} from '../models/resource';
import {map} from 'rxjs/operators';
import {API_URLS} from '../../shared/constants/api-constants';
import {saveAs} from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  private apiUrl = API_URLS.RESOURCE;
  private refreshNeeded$ = new Subject<void>();

  constructor(private http: HttpClient) {
  }

  get onRefreshNeeded(): Observable<void> {
    return this.refreshNeeded$.asObservable();
  }

  public notifyRefreshNeeded(): void {
    this.refreshNeeded$.next();
  }

  getResources(path: string): Observable<Resource[]> {
    const params = new HttpParams().set('path', path);
    return this.http.get<Resource[]>(this.apiUrl, {params}).pipe(
      map(files =>
        files.map(file => ({
          ...file,
          modifiedData: new Date(file.modifiedData)
        }))
      )
    );
  }

  uploadFilesToServer(files: File[], path: string): Observable<Resource[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    const params = new HttpParams().set('path', path);
    return this.http.post<Resource[]>(this.apiUrl, formData, {params: params}).pipe(
      finalize(() => this.notifyRefreshNeeded()));
  }

  downloadResource(path: string): void {
    const params = new HttpParams().set('path', path);
    this.http.get(this.apiUrl + '/download', {
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
              name = decodeURIComponent(matches[1]).replace(/\+/g, ' ');
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

  deleteResource(path: string): Observable<void> {
    let param = new HttpParams().set("path", path);
    return this.http.delete<void>(this.apiUrl, {params: param}).pipe(
      finalize(() => this.notifyRefreshNeeded()));
  }

  move(from: string, to: string): Observable<void> {
    let param = new HttpParams().set("from", from).set("to", to);
    return this.http.get<void>(this.apiUrl + "/move", {params: param}).pipe(
      finalize(() => this.notifyRefreshNeeded()));
  }
}
