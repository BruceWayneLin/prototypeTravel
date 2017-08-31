import {
  Component, AfterViewInit, ComponentFactoryResolver, ViewContainerRef, OnInit, ViewChild,
  ElementRef } from '@angular/core';
import { ShareService } from '../../services/share.service';
import { DataServiceService } from '../../services/data-service.service';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-member-create',
  templateUrl: './member-create.component.html',
  styleUrls: ['./member-create.component.css']
})
export class MemberCreateComponent implements OnInit {
  insuredTotal: number = 500;
  originalInsured: number = 500;
  buttonOne: boolean = false;
  buttonTwo: boolean = false;
  buttonThree: boolean = false;
  owlAnanOne: boolean = true;
  owlAnanTwo: boolean = true;
  owlAnanThree: boolean = true;
  owlAnanFour: boolean = true;
  owlAnanFifth: boolean = true;

  numberOfInusred:number = 1;
  gender: string = '男';
  birthdayYears: any[] = [];
  birthdayMonths: any[] = [];
  birthdayDays: any[] = [];
  cityList: any[] = [];
  selectedCity: any = {};
  toGoWithYourFds: boolean = false;
  toGoWithYourFdsClick: boolean = false;
  email:any = 'abc@gmail.com';
  lastName:string = '林';
  firstName:string = '先生';
  pid:string = 'a123456789';
  pBirthYear:string = '2017';
  pBirthMonth:string = '1';
  pBirthDay:string = '12';
  Mobile:string = '0912341234';
  selectedDistrict:any = '';
  areaZipCode:any = '100';
  addr: string = '凱選路中正街一號';


  @ViewChild('emailElm') EmailEl:ElementRef;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private shareService: ShareService,
    private dataService: DataServiceService
  ) {
    $('html, body').animate({scrollTop: '0px'}, 0);
     this.buttonOne = this.shareService.buttonOne;
     this.buttonTwo = this.shareService.buttonTwo;
     this.buttonThree = this.shareService.buttonThree;
  }

  emailChange(email){
      console.log();
  }

  toLoadArea(city) {
    console.log(this.selectedCity);
  }

  GoingWithFds() {
    this.toGoWithYourFdsClick = true;
    this.toGoWithYourFds = true;
    this.insuredTotal += 500;
    if(($('#insuredInfoAppend').children('#insuredOneCard').length) == 0){
      this.owlAnanOne = false;
    }
  }
  noGoingWithFds() {
    this.toGoWithYourFdsClick = true;
    this.toGoWithYourFds = false;
  }

  ngOnInit() {
    this.birthdayYears = this.birthYears();
    this.birthdayMonths = this.birthMonths();
    this.birthdayDays = this.birthDays(new Date().getFullYear(), new Date().getMonth()+1);
    this.dataService.getIniData().subscribe((data) => {
      this.cityList = data.cityList;
      data.areaList.filter(value => value.cityId == 1).map(value =>
        value
      );
    });
    if(this.buttonOne){
      $('input').val('');
      $('select').val('');
      this.gender = '';
    }
  }

  ngAfterViewInit() {
  }

  ngAfterContentInit() {
  }

  countTotal() {
    this.insuredTotal += 500;
  }

  deleteThisOne() {
    if(this.insuredTotal == 500){

    }else {
      this.insuredTotal -= 500;
    }

    if(($('#insuredInfoAppend').children('#insuredOneCard').length - 1) == 1){
    } else {
      $('#insuredInfoAppend').find('#insuredOneCard').remove();
      $('.appendDollArea').find('.ananDiv').eq('1').remove();
      if($('.appendDollArea').find('.ananDiv').length == 1){
        $('.appendDollArea').find('.ananDiv').remove();
      }
    }
  }

  deleteThisMinus() {
    if(this.insuredTotal == 500){

    }else {
      this.insuredTotal -= 500;
    }
    var lengthOfOwls = $('#insuredInfoAppend').children('#insuredOneCard').length - 2;
    switch (lengthOfOwls) {
      case 0:
        this.owlAnanOne = true;
        break;
      case 1:
        this.owlAnanTwo = true;
        break;
      case 2:
        this.owlAnanThree = true;
        break;
      case 3:
        this.owlAnanFour = true;
        break;
      case 4:
        this.owlAnanFifth = true;
        break;
      default:
    }

    if(($('#insuredInfoAppend').children('#insuredOneCard').length - 1) == 0){
    } else {
      $('#insuredInfoAppend').last('#insuredOneCard').children().last().remove();
      $('.appendDollArea').find('.ananDiv').eq('1').remove();
      if($('.appendDollArea').find('.ananDiv').length == 1){
        $('.appendDollArea').find('.ananDiv').remove();
      }
    }
  }

  birthYears() {
    var date = new Date();
    var limitAge = 0;
    limitAge = date.getFullYear();
    var returnVal = [];
    returnVal.push(limitAge);
    for (var i = limitAge; i > 1; i--) {
      if(limitAge >= 1910){
        limitAge--;
        returnVal.push(limitAge);
      } else {
        return returnVal;
      }
    }
  }

  birthMonths() {
    var months = [];
    for (var i = 1; i <= 12; i++) {
      months.push(i);
    }
    return months;
  }

  birthDays(year, month) {
    var m = parseInt(month.toString().slice(0, 2));
    var y = parseInt(year.toString().slice(2, 6));
    var returnArr = [];
    switch (m) {
      case 1: case 3: case 5: case 7: case 8:case 10: case 12:
        for(let i = 1; i <= 31; i++){
          returnArr.push(i);
        }
      return returnArr;
      case 2:
        if ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) {
          for(let i = 1; i <= 29; i++){
            returnArr.push(i);
          }
          return returnArr;
        } else {
          for(let i = 1; i <= 28; i++){
            returnArr.push(i);
          }
          return returnArr;
        }
      default:
        for(let i = 1; i <= 30; i++){
          returnArr.push(i);
        }
        return returnArr;
    }
  }

  createInsuredCard() {
    console.log(($('#insuredInfoAppend').children('#insuredOneCard').length));
    var lengthOfOwls = $('#insuredInfoAppend').children('#insuredOneCard').length - 1;
    switch (lengthOfOwls) {
      case 0:
        this.owlAnanOne = false;
      break;
      case 1:
        this.owlAnanTwo = false;
      break;
      case 2:
        this.owlAnanThree = false;
      break;
      case 3:
        this.owlAnanFour = false;
      break;
      case 4:
        this.owlAnanFifth = false;
      break;
      default:
    }
    // if(($('#insuredInfoAppend').children('#insuredOneCard').length) == 1){
    //   this.numberOfInusred = 1;
    //   this.numberOfInusred++;
    //
    // } else {
    //   this.numberOfInusred++;
    // }
    this.numberOfInusred = $('#insuredInfoAppend').children('#insuredOneCard').length + 1;
    if(($('#insuredInfoAppend').children('#insuredOneCard').length) <= 5){
      this.insuredTotal += 500;

      var html = '';
      html += '<div id="insuredOneCard" class="col-lg-6">';
      html += '<div class="insuredTit col-lg-12 text-left">';
      html += '<div class="col-xs-2">';
      html += '<div class="circleDiv">';
      html += '<p>' + this.numberOfInusred + '</p>';
      html += '</div>';
      html += '</div>';
      html += '<div class="col-xs-10">';
      html += '<button id="xBtn" (click)="deleteThisOne()" class="deleteBtn pull-right"><i class="fa fa-close"></i></button>';
      html += '<h2 class="formTitTxt">個人資料</h2>';
      html += '</div>';
      html += '</div>';
      html += '<div class="col-xs-6">';
      html += '<select name="" id="" class="form-control btn-sm">';
      html += '<option value="">請選擇</option>';
      html += '<option value="">本人</option>';
      html += '<option value="">配偶</option>';
      html += '<option value="">子女</option>';
      html += '</select>';
      html += '</div>';
      html += '<div class="col-xs-6"></div>';
      html += '<div class="col-lg-12 text-center">';
      html += '<div class="col-xs-6" style="padding-left:0px;">';
      html += '<input class="memberFormInput form-control" type="text" placeholder="姓">';
      html += '</div>';
      html += '<div class="col-xs-6" style="padding-right:0px;">';
      html += '<input class="pull-left memberFormInput form-control" type="text" placeholder="名">';
      html += '</div>';
      html += '</div>';
      html += '<div class="col-lg-12 text-center">';
      html += '<input class="insuredPid memberFormInput form-control input-lg" type="text" placeholder="身分證字號*">';
      html += '</div>';
      html += '<div class="insuredBirthEx col-lg-12 text-center">';
      html += '<div>';
      html += '<div class="col-xs-1">';
      html += '<span class="txtBirth" style="padding-top:15px;">生日：</span>';
      html += '</div>';
      html += '<div class="col-xs-5">';
      html += '<select name="" id="" class="form-control">';
      html += '<option value="">年</option>';
      html += '</select>';
      html += '</div>';
      html += '<div class="col-xs-3">';
      html += '<select name="" id="" class="form-control">';
      html += '<option value="">月</option>';
      html += '</select>';
      html += '</div>';
      html += '<div class="col-xs-3">';
      html += '<select name="" id="" class="form-control">';
      html += '<option value="">日</option>';
      html += '</select>';
      html += '</div>';
      html += '</div>';
      html += '</div>';
      html += '<div class="col-xs-12 text-right insuredPriceDivH4">';
      html += '<h4 class="text-right"><span>保費:</span> NT$' +  this.originalInsured + '</h4>';
      html += '</div>';
      html += '</div>';

      // $('.appendDollArea').append(dollHtml);
      $('#insuredInfoAppend').append(html);
    } else {
      alert('您最多只能五位加保人');
    }
  }

}
