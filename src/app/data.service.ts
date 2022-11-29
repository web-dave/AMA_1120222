import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, merge } from 'rxjs';
import { concatMap, map, scan, tap, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  ids$$ = new BehaviorSubject<number>(0);

  data$$ = merge(this.getColor(), this.getName()).pipe(
    scan((acc: { [id: number]: Partial<IData> }, value: IColor | IName) => {
      acc[value.id] = { ...acc[value.id], ...value };
      return acc;
    }, {})
  );

  constructor(private http: HttpClient) {
    this.getIds().subscribe();
  }

  getIds() {
    return this.http.get<ID[]>('http://localhost:3000/ids').pipe(
      map((data) => data.map((ob) => ob.id)),
      tap((ids) => ids.forEach((id) => this.ids$$.next(id)))
    );
  }
  getName() {
    return this.ids$$.pipe(
      filter((id) => id !== 0),
      concatMap((id) =>
        this.http.get<IName>('http://localhost:3000/names/' + id)
      )
    );
  }
  getColor() {
    return this.ids$$.pipe(
      filter((id) => id !== 0),
      concatMap((id) =>
        this.http.get<IColor>('http://localhost:3000/colors/' + id)
      )
    );
  }
}

export interface ID {
  id: number;
}
export interface IName {
  id: number;
  name: string;
}
export interface IColor {
  id: number;
  color: string;
}
export interface IData {
  id: number;
  color: string;
  name: string;
}
