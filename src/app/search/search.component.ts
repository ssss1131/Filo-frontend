import { Component, OnInit } from '@angular/core';
import { ActivatedRoute }       from '@angular/router';
import { switchMap, map, filter } from 'rxjs/operators';
import { ResourceService }      from '../core/services/resource.service';
import { Observable }           from 'rxjs';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {FileItemComponent} from '../file-item/file-item.component';
import {Resource} from '../core/models/resource';

@Component({
  selector: 'app-search',
  imports: [
    AsyncPipe,
    FileItemComponent,
    NgIf,
    NgForOf
  ],
  template: `
    <h2>Search results for “{{ query }}”</h2>
    <div *ngIf="results$ | async as results; else loading">
      <div *ngIf="results.length; else noResults">
        <app-file-item *ngFor="let f of results" [file]="f"></app-file-item>
      </div>
    </div>
    <ng-template #loading>Loading…</ng-template>
    <ng-template #noResults>No results found.</ng-template>
  `
})
export class SearchComponent implements OnInit {
  query!: string;
  results$!: Observable<Resource[]>;

  constructor(
    private route: ActivatedRoute,
    private resourceService: ResourceService
  ) {}

  ngOnInit() {
    this.results$ = this.route.queryParams.pipe(
      map(params => params['query']?.trim() || ''),
      filter(q => q.length > 0),
      map(q => this.query = q),
      switchMap(q => this.resourceService.search(q))
    );
  }
}
