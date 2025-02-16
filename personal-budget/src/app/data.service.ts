import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
// Lauren Simineau 2/16/2025
// had to implement tap in order to get the backend to load in the correct order
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  private URL: string = 'http://localhost:3000/budget'; 
  private Subject = new BehaviorSubject<any[]>([]);
  myBudget$ = this.Subject.asObservable();

  constructor(private http: HttpClient) {}

  getBudget(): Observable<any[]> {
    return this.http.get<{ myBudget: any[] }>(this.URL).pipe(
      map(response => {
        return response.myBudget ?? []; 
      }),
      tap(budgetArray => {
        this.Subject.next(budgetArray);
      })
    );
  }
}
