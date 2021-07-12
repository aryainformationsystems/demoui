import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../classes/api-response';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  baseUrl = 'http://localhost:8080/api/v1/vehicle';

  constructor(private httpClient: HttpClient) { }

  public getVehiclePage(page: number, size: number, sort: string): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(`${this.baseUrl}?page=${page}&size=${size}&sort=${sort}`, {
      headers: {
        'authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }

  public saveVehicle(vehicleDetails: any): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(`${this.baseUrl}`, vehicleDetails, {
      headers: {
        'authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }

  public searchVehicle(registration: string): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(`${this.baseUrl}/${registration}`, {
      headers: {
        'authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }

  public updateVehicle(registration: string, vehicleDetails: any): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>(`${this.baseUrl}/${registration}`, vehicleDetails, {
      headers: {
        'authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }

  public deleteVehicle(registration: string): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(`${this.baseUrl}/${registration}`, {
      headers: {
        'authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }

}
