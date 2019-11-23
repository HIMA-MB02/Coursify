import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Admin } from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  authToken: any;
  admin: any;

  baseURL: string = "http://localhost:3000/login/";

  constructor(private http: HttpClient) { }
  //For Logout to disappear in case you did not login
  isAdminLoggedIn = false;
  loggedIn() {
    return this.isAdminLoggedIn;
  }

  sendEmail(credentials) {
    console.log(credentials);
    return this.http.post(this.baseURL  + 'approveAdmin', credentials);
  }

  //Get All Admins
  getAdministrators() {
    return this.http.get<Admin[]>(this.baseURL);
  }

  deleteAdministrator(id:string) {
    console.log(id);
    return this.http.delete(this.baseURL + id);
  }
  setKeys(keys) {
    console.log(keys);
    return this.http.post(this.baseURL+ 'setKeys', keys);
  }
  getKey()  {
    return this.http.get(this.baseURL + 'getKeys');
  }
  //Register admin
  registerAdmin(admin) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.baseURL + '/register', admin, { headers: headers });
  }

  //Authenticate admin
  login(admin) {
    console.log('Recieved: ' + admin);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.baseURL, admin, { headers: headers }).pipe(map((admin:any) => {
      console.log(admin);
      if (admin && admin.token) {//Compile time error
        this.isAdminLoggedIn = true;
        this.storeAdminData(admin.token, admin)
      }
      return admin;
    }));
  }
  storeAdminData(token, admin) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('admin', JSON.stringify(admin));
    localStorage.setItem('adminRole', admin.admin.role)
    this.authToken = token;
    this.admin = admin;
  }

  //Log Out
  logOut() {
    this.admin = null;
    this.authToken = null;
    this.isAdminLoggedIn = false;
    localStorage.clear();
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    console.log('Token Received: ' + token);
    this.authToken = token;
  }

  sortAdministrators(attribute: string) {
    console.log(this.baseURL +'sort');
    return this.http.post(this.baseURL +'sort', {attribute: attribute});
  }
}
