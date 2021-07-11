import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../classes/api-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = "http://localhost:8080/api/v1/user";

  constructor(private httpClient: HttpClient) { }

  public authenticate(loginDetails: any): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(`${this.baseUrl}/authenticate`, loginDetails);
  }

  public register(userDetails: any): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(`${this.baseUrl}/register`, userDetails);
  }
}
