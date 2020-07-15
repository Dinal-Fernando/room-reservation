import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, Response, ResponseContentType, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs';
import {Router} from "@angular/router"
import {environment} from '../../environments/environment';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class CommonServicesService {

  constructor(public httpClient: HttpClient, public http: Http, private router:Router) { }
  fetchData(url) {
    let headers = this.getHeaders()
    const promise = this.httpClient.get(environment.apiBaseUrl+url).toPromise();
    return promise;
  }

  postData(url,body) {
    let headers = this.getHeaders() //
    console.log("body"+JSON.stringify(body));
    return this.http.post(environment.apiBaseUrl+url,JSON.stringify(body),{ headers: headers})
    .toPromise()
    .then((response: Response) => {
      return response.json();
      })
    .catch(
      (error: Response) => {
        console.log("Error!!"+error.status);
          if (error.status == 401) {
            this.refreshToken(localStorage.getItem('refresh_token')).then(res=>{
              try{
                localStorage.setItem('token', res['access'])
                this.getData(url)
              } catch {
                this.router.navigate(['/login'])
              }
            })
          }
          else {
            return error
            this.router.navigate(['/login'])
          }
      })
  }

  getData(url): any {
    let self = this;
    let headers = this.getHeaders()
    return this.http.get(environment.apiBaseUrl+url, { headers: headers})
    .toPromise()
    .then((response: Response) => {
      console.log("HEYYY"+response.json());
      return response.json();
      })
    .catch(
      (error: Response) => {
          if (error.status == 401) {
            return self.refreshToken(localStorage.getItem('refresh_token')).then(res=>{
              try{
                localStorage.setItem('token', res['access'])
                // expose second request
                let headers = this.getHeaders()
                return self.http.get(environment.apiBaseUrl+url, { headers: headers})
                .toPromise()
                .then((response: Response) => {
                  return response.json();
                  })
              } catch {
                self.router.navigate(['/login'])
              }
            })
          }
          else {
            this.router.navigate(['/login'])
            console.error('[ONEPAY] - Unauthrized assess')
            return error
          }
      })
  }
  putData(url,body) {
    let headers = this.getHeaders()
    console.log(body)
    return this.http.put(environment.apiBaseUrl+url,body,{ headers: headers})
    .toPromise()
    .then((response: Response) => {
      console.log("Respose"+response.json() );
      return response.json();
      })
      .catch(
        (error: Response) => {
            if (error.status == 401) {
              this.refreshToken(localStorage.getItem('refresh_token')).then(res=>{
                try{
                  localStorage.setItem('token', res['access'])
                  this.getData(url)
                } catch {
                  this.router.navigate(['/login'])
                }
              })
            }
            else {
              this.router.navigate(['/login'])
              console.log(error)
              return error
            }
        })
  }
  deleteData(url) {
    let headers = this.getHeaders()
    return this.http.delete(environment.apiBaseUrl+url,{ headers: headers})
    .toPromise()
    .then((response: Response) => {
      
      return response.json();
      })
      .catch(
        (error: Response) => {
            if (error.status == 401) {
              this.refreshToken(localStorage.getItem('refresh_token')).then(res=>{
                try{
                  localStorage.setItem('token', res['access'])
                  this.getData(url)
                } catch {
                  this.router.navigate(['/login'])
                }
              })
            }
            else {
              return error
              this.router.navigate(['/login'])
            }
        })
  }

  private getHeaders(){
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Accept', 'application/json')
    if (localStorage.getItem('token')) {
      headers.append('Authorization', 'Bearer '+ localStorage.getItem('token'));
    }
    return headers
  }

  postFormData(url,body) {
    console.log(body)
    let headers = this.getHeaders()
    return this.http.post(environment.apiBaseUrl+url, body,{ headers: headers})
    .toPromise()
    .then((response: Response) => {
      return response.json();
      })
      .catch(
        (error: Response) => {
            if (error.status == 401) {
              this.refreshToken(localStorage.getItem('refresh_token')).then(res=>{
                try{
                  localStorage.setItem('token', res['access'])
                  this.getData(url)
                } catch {
                  this.router.navigate(['/login'])
                }
              })
            }
            else {
              return error
              this.router.navigate(['/login'])
            }
        })
  }
  putFormData(url,body) {
    let headers = this.getHeaders()
    return this.http.put(environment.apiBaseUrl+url,body,{ headers: headers})
    .toPromise()
    .then((response: Response) => {
      return response.json();
      })
      .catch(
        (error: Response) => {
            if (error.status == 401) {
              this.refreshToken(localStorage.getItem('refresh_token')).then(res=>{
                try{
                  localStorage.setItem('token', res['access'])
                  this.getData(url)
                } catch {
                  this.router.navigate(['/login'])
                }
              })
            }
            else {
              return error
              this.router.navigate(['/login'])
            }
        })
  }
  refreshToken(token) {
    let body = {
      'refresh': token
    }
    return this.httpClient.post(environment.apiBaseUrl + 'token/refresh/',body).toPromise()
  }
  setToken(token: string) {
    localStorage.setItem('token', token);
  }
  getToken() {
    return localStorage.getItem('token');
  }
  deleteToken() {
    localStorage.removeItem('token');
  }
  getUserPayload() {
    const token = this.getToken();
    if (token) {
      const userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    } else {
      return null;
    }
  }
  isLoggedIn() {
    const userPayload = this.getUserPayload();
    if (userPayload) {
      return userPayload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }
}