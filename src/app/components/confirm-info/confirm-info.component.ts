import {Component, OnInit, ViewChild} from '@angular/core';
import {Accordion} from "ngx-accordion";
import { DataServiceService } from '../../services/data-service.service'
declare var jquery:any;
declare var $ :any;
@Component({
  selector: 'app-confirm-info',
  templateUrl: './confirm-info.component.html',
  styleUrls: ['./confirm-info.component.css']
})

export class ConfirmInfoComponent implements OnInit {
  isExpandAll: boolean = false;

  applicantName: string;
  applicantMobile: string;
  applicantPid: string;
  applicantAddr: string;
  applicantBth: string;
  applicantEmail: string;

  insuredDateStart: string;
  insuredDateEnd: string;
  insuredLocation: string;
  insuredPurpose: string;

  text4Activity: string;
  odPeriodDays: number;
  odRate: number;

  insuredList: any[];

  @ViewChild(Accordion) MyAccordion: Accordion;

  constructor(
      public dataService:DataServiceService
  ) {
    // $('html, body').animate({scrollTop: '0px'}, 0);
  }

  ngOnInit() {
    $(document).on('click', '.panel-heading', function(){
      document.querySelector('#flagInsuredPPlFlag').scrollIntoView();

      // var body = $("html, body");
      // body.stop().animate({scrollTop: 290}, 200, 'swing', function () {
      // });
    })

    this.dataService.getConfirmInfo().subscribe((item) => {
      let info = item;
      this.applicantName = info['apLastName'] + info['apFirstName'];
      this.applicantMobile = info['apMobile'];
      this.applicantPid = info['apPid'];
      this.applicantAddr = info['apAddressFull'];
      this.applicantBth = info['apBirthday']['year'] + '-' + info['apBirthday']['month'] + '-' + info['apBirthday']['day'];
      this.applicantEmail = info['apEmail'];
      this.insuredDateStart = info['odStartDate']['year'] + '-' + info['odStartDate']['month'] + '-' + info['odStartDate']['day'];
      this.insuredDateEnd = info['odEndDate']['year'] + '-' + info['odEndDate']['month'] + '-' + info['odEndDate']['day'];
      this.insuredLocation = info['odLocation'];
      this.insuredPurpose = info['odPurpose'];
      this.insuredList = info['insuredList'];
      this.text4Activity = info['text4Activity'];
      this.odPeriodDays = info['odPeriodDays'];
      this.odRate = info['odRate'];
      this.dataService.purposeImageUrl = info['purposeImageUrl'];
      document.querySelector('#flagTop').scrollIntoView();
    });
  }

  toTriggerCloseA(){
    $(this).closet('a').trigger('click');
  }

  animateStart(value){
    document.querySelector('#flagInsuredPPlFlag').scrollIntoView();
    console.log(value);
    // $(document).on('click', '#clickAccordion', function(){
    //
    //   //
    //   // var body = $("html, body");
    //   // body.stop().animate({scrollTop: 290}, 200, 'swing', function () {
    //   // });
    // })
  }

  confirmPaying(){
    this.dataService.confirmPaying();
  }

  doSomethingOnClose() {
    this.MyAccordion.closeAll();
    document.querySelector('#flagInsuredPPlFlag').scrollIntoView();
  }

  getBakInfo(){
    this.dataService.backFromConfirm = true;
  }

}
