import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehicleService } from 'src/app/services/vehicle.service';
import jwt_decode from 'jwt-decode';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {
  vehicleForm: FormGroup;
  isUser = false;
  id: string | undefined;

  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private vehicleService: VehicleService, private router: Router, private route: ActivatedRoute) {
    this.vehicleForm = this.formBuilder.group({
      registration: ['', [Validators.required]],
      owner: ['', [Validators.required]],
      engineNumber: ['', [Validators.required]],
      chassisNumber: ['', [Validators.required]],
      dateOfRegistration: ['', [Validators.required]],
      dateOfExpiry: ['', [Validators.required]],
      address: ['', [Validators.required]]
    });
    if (this.route.snapshot.params.id) {
      this.id = this.route.snapshot.params.id;
      this.vehicleService.searchVehicle(this.route.snapshot.params.id).subscribe(result => {
        this.vehicleForm.patchValue(result.data);
      })
    }
  }

  ngOnInit(): void {
    const parsed: any = jwt_decode(localStorage.getItem('authToken')!);
    if (parsed.authorities.includes('User')) {
      this.isUser = true;
    }
  }

  saveVehicle(): void {
    if (this.vehicleForm.valid) {
      if (this.id) {
        this.vehicleService.updateVehicle(this.id, this.vehicleForm.value).subscribe(result => {
          this.snackBar.open('Vehicle details saved successfully.', 'Close', {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 3000
          });
        }, err => {
          this.snackBar.open('Vehicle details could not be saved. Please contact support.', 'Close', {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 3000
          })
        });
        return;
      }
      this.vehicleService.saveVehicle(this.vehicleForm.value).subscribe(result => {
        this.snackBar.open('Vehicle details saved successfully.', 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 3000
        });
      }, err => {
        this.snackBar.open('Vehicle details could not be saved. Please contact support.', 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 3000
        })
      });
    }
  }

  logout(): void {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  showVehicles() {
    this.router.navigateByUrl('/home');
  }
}
