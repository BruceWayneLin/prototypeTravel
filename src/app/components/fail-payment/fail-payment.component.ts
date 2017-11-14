import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../../services/data-service.service';

@Component({
  selector: 'app-fail-payment',
  templateUrl: './fail-payment.component.html',
  styleUrls: ['./fail-payment.component.css']
})
export class FailPaymentComponent implements OnInit {

  constructor(
      private dataServiceService:DataServiceService
  ) { }

  wrongMsg: string = '';

  ngOnInit() {
      var Url = window.location.href;
      var idArray = this.toGetId(Url);
      var turnBakUrl = this.toGetDataFromUrl(Url);
      idArray['orderNumber'].forEach((item) => {
          this.dataServiceService.orderNumberForSave = item;
      });
      this.dataServiceService.failPaymentInfo(turnBakUrl).subscribe((item)=>{
        this.wrongMsg = item['msg'];
      })
  }

    toGetId(url) {
        var queryStart = url.indexOf('?') + 1;
        var queryEnd = url.length + 1;
        var query = url.slice(queryStart, queryEnd - 1);
        var pairs = query.replace(/\+/g, '').split('&');
        var parms = {};
        var i;
        var n;
        var v;
        var nv;
        if (query === url || query === '') return;
        for (i = 0; i < pairs.length; i++) {
            nv = pairs[i].split('=', 2);
            n = decodeURIComponent(nv[0]);
            v = decodeURIComponent(nv[1]);
            if (!parms.hasOwnProperty(n)) parms[n] = [];
            parms[n].push(nv.length === 2 ? v : null);
        }
        return parms;
    };

  toGetDataFromUrl(url) {
    var queryStart = url.indexOf('?') + 1;
    var queryEnd = url.length + 1;
    var query = url.slice(queryStart, queryEnd - 1);
    return query;
  };

}
