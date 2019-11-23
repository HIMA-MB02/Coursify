import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ResolveStart } from '@angular/router';
import { Observable } from 'rxjs';
import {AdminService} from '../services/admin.service';
import Swal from 'sweetalert2'
@Injectable({
  providedIn: 'root'
})
export class AppGuard implements CanActivate {
  constructor(private router:Router, private adminService: AdminService) { }
  canActivate(route: ActivatedRouteSnapshot){
    if(this.adminService.loggedIn() || localStorage.getItem('admin')){
      let role = localStorage.getItem('adminRole');
      let roles = route.data.roles;
      for(var eachRole of roles) {
        if(eachRole == role) {
          return true;
        }
      }  
    }
    Swal.fire({
      type: 'error',
      title: 'Oops...',
      text: 'Incorrect Credentials!',
      backdrop: "rgba( 97,137,47, 0.45)",
      background: "rgb(34, 38, 41)",
    })
    this.router.navigate(['/site/login'])
  }
  
}