import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  isUser = false;
  dataSource = new MatTableDataSource();
  displayedColumns = ['registration', 'owner', 'engine', 'chassis', 'date', 'expiry', 'address', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  count = 0;

  searchForm!: FormGroup;
  searchResult: any = null;

  constructor(private vehicleService: VehicleService, private snackBar: MatSnackBar, private router: Router, private formBuilder: FormBuilder) {
    this.dataSource.paginator = this.paginator;
    this.searchForm = this.formBuilder.group({
      registration: ['', [Validators.required]]
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.paginator.page.subscribe(pageEvent => {
      this.fetchAndUpdate();
    });
    const parsed: any = jwt_decode(localStorage.getItem('authToken')!);
    if (parsed.authorities.includes('User')) {
      this.isUser = true;
    }
    if (!this.isUser) {
      this.fetchAndUpdate();
    }
  }

  logout(): void {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  fetchAndUpdate(): void {
    this.vehicleService.getVehiclePage(this.paginator.pageIndex, this.paginator.pageSize, 'createdDate').subscribe(result => {
      this.dataSource = new MatTableDataSource(result.data);
      // this.dataSource.paginator = this.paginator;
      this.count = result.count;
    }, err => {
      this.snackBar.open('Could not fetch vehicle data.', 'Close', {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 3000
      });
    });
  }

  newVehicle(): void {
    this.router.navigateByUrl('/new-vehicle');
  }

  searchVehicle(): void {
    if (!this.searchForm.valid) {
      this.snackBar.open('Please enter a vehicle registration to search', 'Close', {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 3000
      });
    }
    else {
      this.vehicleService.searchVehicle(this.searchForm.controls.registration.value).subscribe(result => {
        this.searchResult = result.data;
      }, err => {
        console.log(err);
        this.snackBar.open(err.error.message, 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 3000
        });
      });
    }
  }

  openForEditing(registration: string): void {
    this.router.navigateByUrl(`/edit-vehicle/${registration}`);
  }

  deleteVehicle(registration: string): void {
    this.vehicleService.deleteVehicle(registration).subscribe(result => {
      this.snackBar.open('Vehicle deleted successfully.', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'end'
      });
      this.fetchAndUpdate();
    }, err => {
      this.snackBar.open('Could not delete vehicle. Please contact support.', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'end'
      });
    });
  }

}
