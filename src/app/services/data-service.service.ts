import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class DataServiceService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private mockApi = 'api/mockPosts';

  constructor(public http:Http) {
    console.log('the server is running');
  }

  getIniData() {
    return this.http.get('http://210.242.7.164/CareLineTravel/travel-mbr/journey/initData?product=Travel').map(res => res.json());
  }

  getPkPrice(value) {
    console.log(JSON.stringify(value));
    this.http.post('http://210.242.7.164/CareLineTravel/travel-mbr/journey/calRateByCusPackage', JSON.stringify(value)).subscribe(
      response => console.log(response.json())
    )
  }

  // getMockData() {
  //   return this.http.get('api/mockPosts').map(res => res.json());
  // }

}
