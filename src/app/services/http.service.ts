import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  apiURL = 'http://192.168.10.18:2000';

  constructor(
    private http: HttpClient
  ) { }

  async postEvent(event: string) {
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    const options = { headers };

    try {
      await this.http.post(`${this.apiURL}/event`, { event }, options).toPromise();
    } catch (e) {
      console.log('error with http POST');
    }
  }
}
