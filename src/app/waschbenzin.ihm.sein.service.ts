import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { IColor, IName } from './data.service';

export type Id = {
  id: number;
};
export type Name = {
  name: string;
};

export type Color = {
  color: string;
};

@Injectable({ providedIn: 'root' })
export class WaschbenzinDataService {
  constructor(private http: HttpClient) {}
  getData(): Observable<(Id & Name & Color)[]> {
    return this.getIds().pipe(
      switchMap((ids) => this.getManyNamesAndColors(ids)),
      tap((it) => console.log({ it }))
    );
  }

  getManyNamesAndColors(ids: Id[]): Observable<(Id & Name & Color)[]> {
    return forkJoin(ids.map((id) => this.getNameAndColor(id)));
  }

  getNameAndColor(id: Id): Observable<Id & Name & Color> {
    return forkJoin({
      id: of(id.id),
      name: this.getName(id),
      color: this.getColor(id),
    });
  }

  getIds(): Observable<Id[]> {
    return this.http.get<Id[]>('http://localhost:3000/ids');
  }

  getName(id: Id): Observable<string> {
    return this.http
      .get<IName>('http://localhost:3000/names/' + id.id)
      .pipe(map((data) => data.name));
  }

  getColor(id: Id): Observable<string> {
    return this.http
      .get<IColor>('http://localhost:3000/colors/' + id.id)
      .pipe(map((data) => data.color));
  }
}
