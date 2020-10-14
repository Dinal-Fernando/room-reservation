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

  token = ''
  constructor(private httpClient: HttpClient, private router: Router) {
    this.token = this.getToken()
  }

  postLoginData(url, body) {
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
    });

    if (localStorage.getItem('onepay_t')) {
      httpHeaders.append('Authorization' , 'Bearer '+ localStorage.getItem('onepay_t'));
    }

    return this.httpClient.post(environment.apiBaseUrl + url, JSON.stringify(body), { headers: httpHeaders })
      .toPromise()
      .then((response: Response) => {
        console.log(JSON.stringify(body))
        return response
      })
      .catch(
        (error: Response) => {
          if (error.status == 401) {
            this.refreshToken(localStorage.getItem('onepay_t')).then(res => {
              try {
                localStorage.setItem('onepay_t', res['access'])
                httpHeaders.set('Authorization', 'Bearer ' + res['onepay_t']);

                return this.httpClient.post(environment.apiBaseUrl + url, JSON.stringify(body), { headers: httpHeaders })
                  .toPromise()
                  .then((response: Response) => {
                    return response;
                  })
              } catch {
                this.router.navigate(['/login'])
              }
            })
          }
          else {
            return error
          }
        })
  }

  postData(url, body) {
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Bearer '+ localStorage.getItem('onepay_t')
    });

    // if (localStorage.getItem('onepay_t')) {
    //   httpHeaders.append('Authorization' , 'Bearer '+ localStorage.getItem('onepay_t'));
    // }

    return this.httpClient.post(environment.apiBaseUrl + url, JSON.stringify(body), { headers: httpHeaders })
      .toPromise()
      .then((response: Response) => {
        console.log(JSON.stringify(body))
        return response
      })
      .catch(
        (error: Response) => {
          if (error.status == 401) {
            this.refreshToken(localStorage.getItem('onepay_t')).then(res => {
              try {
                localStorage.setItem('onepay_t', res['access'])
                httpHeaders.set('Authorization', 'Bearer ' + res['onepay_t']);

                return this.httpClient.post(environment.apiBaseUrl + url, JSON.stringify(body), { headers: httpHeaders })
                  .toPromise()
                  .then((response: Response) => {
                    return response;
                  })
              } catch {
                this.router.navigate(['/login'])
              }
            })
          }
          else {
            return error
          }
        })
  }

  getData(url): any {
    let self = this;
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ localStorage.getItem('onepay_t')     
    });
    // console.log(localStorage.getItem('onepay_t'))
    // if (localStorage.getItem('onepay_t')) {
    //   httpHeaders.append('Authorization', 'Bearer '+ localStorage.getItem('onepay_t'));
    // }
    console.log(httpHeaders)
    return this.httpClient.get(environment.apiBaseUrl + url, { headers: httpHeaders }).toPromise()
    .then(res=>{
      console.log(res)
      return res
    })
    .catch(error=>{
      if (error.status == 401) {
        this.refreshToken(localStorage.getItem('onepay_t')).then(res => {
          try {
            localStorage.setItem('onepay_t', res['access'])

            return this.httpClient.get(environment.apiBaseUrl + url, { headers: httpHeaders })
              .toPromise()
              .then((response: Response) => {
                return response;
              })
          } catch {
            this.router.navigate(['/login'])
          }
        })
      } else {
        self.router.navigate(['/login'])
      }
      console.log(error)
    })
  }

  putData(url, body) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ localStorage.getItem('onepay_t')     
    });
    return this.httpClient.put(environment.apiBaseUrl + url, body, { headers: headers })
      .toPromise()
      .then((response: Response) => {
        return response
      })
      .catch(
        (error: Response) => {
          if (error.status == 401) {
            this.refreshToken(localStorage.getItem('onepay_rt')).then(res => {
              try {
                localStorage.setItem('onepay_t', res['access'])
                this.putData(url, body)
              } catch {
                this.router.navigate(['/login'])
              }
            })
          }
          else {
            this.router.navigate(['/login'])
            return error
          }
        })
  }
  
  deleteData(url) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ localStorage.getItem('onepay_t')     
    });
    return this.httpClient.delete(environment.apiBaseUrl + url, { headers: headers })
      .toPromise()
      .then((response: Response) => {
        return response
      })
      .catch(
        (error: Response) => {
          if (error.status == 401) {
            this.refreshToken(localStorage.getItem('onepay_rt')).then(res => {
              try {
                localStorage.setItem('onepay_t', res['access'])
                this.getData(url)
              } catch {
                this.router.navigate(['/login'])
              }
            })
          }
          else {
            return error
          }
        })
  }

  private getHeaders() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    if (localStorage.getItem('onepay_t')) {
      headers.append('Authorization', 'Bearer '+ localStorage.getItem('onepay_t'));
    }
    console.log(headers)
    return headers
  }

  postFormData(url, body) {
    console.log(body)
    let headers = this.getHeaders()
    return this.httpClient.post(environment.apiBaseUrl + url, body, { headers: headers })
      .toPromise()
      .then((response: Response) => {
        return response.json();
      })
      .catch(
        (error: Response) => {
          if (error.status == 401) {
            this.refreshToken(localStorage.getItem('opm_refresh_token')).then(res => {
              try {
                localStorage.setItem('opm_token', res['access'])
                this.getData(url)
              } catch {
                this.router.navigate(['/login'])
              }
            })
          }
          else {
            return error
          }
        })
  }

  putFormData(url, body) {
    let headers = this.getHeaders()
    return this.httpClient.put(environment.apiBaseUrl + url, body, { headers: headers })
      .toPromise()
      .then((response: Response) => {
        return response.json();
      })
      .catch(
        (error: Response) => {
          if (error.status == 401) {
            this.refreshToken(localStorage.getItem('opm_refresh_token')).then(res => {
              try {
                localStorage.setItem('opm_token', res['access'])
                this.getData(url)
              } catch {
                this.router.navigate(['/login'])
              }
            })
          }
          else {
            return error
          }
        })
  }

  unauthorizedPostData(url, body) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.httpClient.post(environment.apiBaseUrl + url, JSON.stringify(body), { headers: headers })
      .toPromise()
      .then((response: Response) => {
        console.log(response)
        return response
      })
      .catch(
        (error: Response) => {
          // error message "server went vacation"
        })
  }

  refreshToken(token) {
    // let body = {
    //   'refresh': token
    // }
    return this.httpClient.get(environment.apiBaseUrl + 'token/refresh/').toPromise()
    .then(res=>{
      return res
    })
    .catch(error=>{
      console.warn('session expired', error)
      this.router.navigate(['/login'])
    })
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
  getToken() {
    return localStorage.getItem('onepay_t');
  }
  deleteToken() {
    localStorage.removeItem('onepay_t');
  }
}