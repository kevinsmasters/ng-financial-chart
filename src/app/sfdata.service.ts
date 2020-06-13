import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SfdataService {

    constructor(private _http: HttpClient) { }

    weeklyData() {
        return this._http.get("../assets/sf_booking_cancellation_report.json")
        .pipe(map(result => result));
    }
}
