import { Injectable, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Headers, Http, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';
import {routes} from "../app.module";
declare var jquery:any;
declare var $ :any;

@Injectable()
export class DataServiceService {
  public  SaveInsuredData: any = {};
  private headers = new Headers({'Content-Type': 'application/json'});
  private mockApi = 'api/mockPosts';
  public orderNumber = '';
  // public  finalPrice: number;
  public orderNumberForSave = '';
  public clearData: boolean = false;
  public purposeImageUrl: string;
  public readyToSaveData: boolean = false;
  public noGoWithYourFds: boolean = false;
  public AlertTXT: any;
  public BackFromMemberPageInfo: any;

  insuredTotal: any;
  owlAnanOne: boolean = true;
  owlAnanTwo: boolean = true;
  owlAnanThree: boolean = true;
  owlAnanFour: boolean = true;
  owlAnanFifth: boolean = true;
  backFromConfirm: boolean;
  loading: boolean =  false;
  noGoWithYourFdsFlag: boolean;
  backFromNextPage:boolean = false;

    constructor(
        public http:Http,
        public route:Router
    ) {

    }
  getIniData(val) {
      this.loading = false;
      return this.http.get('/CareLineTravel/travel-mbr/journey/initData?product='+val['product']+'&pack='+val['pack']
    ).map(res => {
        return res.json();
    });
  }

  getPkPrice(value) {
    this.loading = true;
    // let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    // let options = new RequestOptions({headers});
    // let  body = new URLSearchParams();
    // body.append('packageId', value['packageId']);
    // body.append('days', value['days']);

    return this.http.post('/CareLineTravel/travel-mbr/journey/calRateByPackage', value)
      .map((result) => {
          if(result.json().isEx == true){
              this.loading = false;
              result.json().msgs.forEach((msg) => {
                  if(msg == '[天數] 請輸入正整數') {
                      document.querySelector('#flagFour').scrollIntoView();
                  }
                  var modal = document.getElementById('myModal');
                  modal.style.display = "block";
                  this.AlertTXT = [];
                  this.AlertTXT.push(msg);
              });
              return 0;
          } else {
              this.loading = false;
              console.log('PkPrice', result.json());
              return result.json();
          }
      });
  }

  getCusPkPrice(value) {
    this.loading = true;
    // let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    // let options = new RequestOptions({headers});
    // let  body = new URLSearchParams();
    // body.append('packageId', value['packageId']);
    // body.append('days', value['days']);
    // body.append('cusItemJson', value['cusItemJson']);
    // console.log(JSON.stringify(value));

    return this.http.post('/CareLineTravel/travel-mbr/journey/calRateByCusPackage', value)
      .map((result) => {
        if(result.json().isEx == true){
         result.json().msgs.forEach((msg) => {
           this.loading = false;
           if(msg == '[天數] 請輸入正整數') {
               document.querySelector('#flagFour').scrollIntoView();
               var modal = document.getElementById('myModal');
               modal.style.display = "block";
               this.AlertTXT = [];
               this.AlertTXT.push(msg);
           }
         });
         return 0;
        } else {
          this.loading = false;
          console.log('cusPkPrice', result.json());
          return result.json();
        }
      });
  }

  toSendInsuredDataToBakHomePage(value){
      this.loading = true;
      // let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
      // let options = new RequestOptions({headers});
      // let  body = new URLSearchParams();
      // console.log(JSON.stringify(value));
      // body.append('data', JSON.stringify(value));
      var i = this.http.post('/CareLineTravel/travel-mbr/journey/savePackage', value).map(res => {
          if (res.json().isEx) {
              this.loading = false;
              var msgs = res.json().msgs;
              var modal = document.getElementById('myModal');
              modal.style.display = "block";
              this.AlertTXT = msgs;
              // for (let i = 0; i < msgs.length; i++) {
              //     var modal = document.getElementById('myModal');
              //     modal.style.display = "block";
              //     this.AlertTXT = [];
              //     this.AlertTXT.push(msgs[i]);
              // }
              return false;
          } else {
              return res.json()['orderNumber'];
          }
      });
      i.subscribe((item)=>{
          var timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
          if(!item){
          } else {
              this.orderNumber = item;
              window.location.href = '/CareLineTravel/travel-mbr/journey/loginMember?orderNumber=' + encodeURIComponent(this.orderNumber)+ '?' + timeStampInMs;
          }
      });
  }

  toGetInsuredInfo(value) {
      this.loading = true;
      if(this.backFromConfirm){
          let objSendBak = {};
          objSendBak['orderNumber'] = this.orderNumberForSave;
          return this.http.post('/CareLineTravel/travel-mbr/journey/getDataAfterLogin', objSendBak).map(res => {
              if(res.json().isEx){
                  if(res.json().kickout){
                      this.route.navigate(['/']);
                  }else{
                      this.loading = false;
                      var msgs = res.json().msgs;
                      var modal = document.getElementById('myModal');
                      modal.style.display = "block";
                      this.AlertTXT = msgs;
                  }
              } else {
                  this.loading = false;
                  return res.json();
              }
          });
      }else{
          let objSendBak = {};
          objSendBak['orderNumber'] = this.orderNumberForSave;
          return this.http.post('/CareLineTravel/travel-mbr/journey/getDataAfterLogin', objSendBak).map(res => {
              if(res.json().isEx){
                  if(res.json().kickout){
                      this.route.navigate(['/']);
                  }else{
                      this.loading = false;
                      var msgs = res.json().msgs;
                      var modal = document.getElementById('myModal');
                      modal.style.display = "block";
                      this.AlertTXT = msgs;
                  }
              } else {
                  this.loading = false;
                  return res.json();
              }
          });
      }
    }

    toGetBakInfo() {
        this.loading = true;
        if(this.backFromConfirm) {
            let objSendBak = {};
            objSendBak['orderNumber'] = this.orderNumberForSave;
            return this.http.post('/CareLineTravel/travel-mbr/journey/getDataWhenBackFromConfirmPage', objSendBak).map(res => {
                if(res.json().isEx){
                    if(res.json().kickout){
                        this.route.navigate(['/']);
                    }else{
                        this.loading = false;
                        var msgs = res.json().msgs;
                        var modal = document.getElementById('myModal');
                        modal.style.display = "block";
                        this.AlertTXT = msgs;
                    }
                } else {
                    this.loading = false;
                    return res.json();
                }
            });
        }
    }

    failPaymentInfo(value){
        this.loading = true;
        let objSendBak = {};
        objSendBak['orderNumber'] = this.orderNumberForSave;
        return this.http.post('/CareLineTravel/travel-mbr/journey/getData4FailPayment', objSendBak).map(res => {
            if(res.json().isEx){
                if(res.json().kickout){
                    this.route.navigate(['/']);
                }else{
                    this.loading = false;
                    var msgs = res.json().msgs;
                    var modal = document.getElementById('myModal');
                    modal.style.display = "block";
                    this.AlertTXT = msgs;
                }
            } else {
                this.loading = false;
                return res.json();
            }
        });
    }

    ifOnlyStartDayOnly(value){
        this.loading = true;
        return this.http.post('/CareLineTravel/travel-mbr/journey/filterPackage', value).map(res => {
            if(res.json().isEx){
                if(res.json().kickout){
                    this.route.navigate(['/']);
                }else{
                    this.loading = false;
                    var msgs = res.json().msgs;
                    var modal = document.getElementById('myModal');
                    modal.style.display = "block";
                    this.AlertTXT = msgs;
                }
            } else {
                this.loading = false;
                return res.json();
            }
        });
    }

  toSaveInsuredData(){
      this.loading = true;
      this.SaveInsuredData['orderNumber'] = this.orderNumberForSave;
      // let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
      // let options = new RequestOptions({headers});
      // let  body = new URLSearchParams();
      setTimeout(() => {
          var i = this.http.post('/CareLineTravel/travel-mbr/journey/saveInsuredData', this.SaveInsuredData).map(res => {
              return res.text();
          });
          i.subscribe((item)=>{
             if(item == 'ok'){
                 this.route.navigate(['/confirmPage']);
                 this.loading = false;
             } else {
                 this.loading = false;
                 let replyObj = JSON.parse(item);
                 if(replyObj.isEx){
                     if(replyObj.kickout){
                         this.route.navigate(['/']);
                     }else{
                         this.loading = false;
                         var msgs = replyObj.msgs;
                         var modal = document.getElementById('myModal');
                         modal.style.display = "block";
                         this.AlertTXT = msgs;
                     }
                 }
             }
          });
      }, 400);
  }

  getConfirmInfo() {
      this.loading = true;
      if(this.orderNumberForSave) {
          let objSendBak = {};
          objSendBak['orderNumber'] = this.orderNumberForSave;
          return this.http.post('/CareLineTravel/travel-mbr/journey/getData4ConfirmPage', objSendBak).map(res => {
              this.loading = false;
              console.log(res.json());
              return res.json();
          });
      }else{
          this.route.navigate(['/index']);
      }
  }

  confirmPaying(){
      console.log(this.orderNumberForSave);
      this.loading = true;
      let objSendBak = {};
      objSendBak['orderNumber'] = this.orderNumberForSave;
      this.http.post('/CareLineTravel/travel-mbr/journey/validateBeforePayment', objSendBak).map(res => {
          return res.text();
      }).subscribe((item) => {
          if(item == 'ok'){
              this.loading = false;
              window.location.href = '/CareLineTravel/travel-mbr/journey/goToPayment?orderNumber=' +  encodeURIComponent(this.orderNumberForSave);
          } else {
              let replyObj = JSON.parse(item);
              if(replyObj.isEx){
                  if(replyObj.kickout){
                      this.route.navigate(['/']);
                  }else{
                      this.loading = false;
                      var msgs = replyObj.msgs;
                      var modal = document.getElementById('myModal');
                      modal.style.display = "block";
                      this.AlertTXT = msgs;
                  }
              }
          }
      });
  }

    getCustomerHomePage() {
        this.loading = true;
        let objSendBak = {};
        objSendBak['orderNumber'] = this.orderNumberForSave;
        return this.http.post('/CareLineTravel/travel-mbr/journey/getData4BackFromSaveInsuredData', objSendBak).map(res => {
            this.loading = false;
            console.log(res.json());
            return res.json();
        })
    }

  getActImgUrl(value) {
      let objSendBak = {};
      objSendBak['orderNumber'] = this.orderNumberForSave;
      return this.http.post('/CareLineTravel/travel-mbr/journey/getData4ThanksPage', objSendBak).map(res => res.text());
  }
}

