import {Component, OnInit, AfterViewInit, ElementRef, ViewChild, ViewChildren}  from '@angular/core';
import { ActivatedRoute, RouterModule, Routes } from "@angular/router";
import { DataServiceService } from '../../services/data-service.service';
// import { OwlCarousel } from 'ngx-owl-carousel';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  selectedCountriesForWritten = '';
  countries: Array<any> = [];
  getDayFromBkend: number;
  selectedCountriesId: any = 1;
  selectedCountry: any = '';
  selectedCountryStr: string = '';
  selectedCountries: any = this.countries[0];
  countriesOfCounties: Array<any> = [];
  purposeList: Array<any> = [];
  selectedPackage: {};
  selectedPackageName: string = '';
  firstMon: any;
  data: any;
  packageList: Array<any> = [];
  disabledDays: string[];
  doneSelPurpose: boolean = false;
  textOfOverDays: any;
  startTravelDay: string;
  endTravelDay: string;
  selectTravelDayIsDone: boolean = false;
  travelPeriodLimit: number;
  cusPackageList: any;
  CusDetailContent: boolean = false;
  toShowMoreDays: boolean = false;
  pkgCustomGo: boolean = false;
  pkgPrimary: any;
  secondaryItems: any;
  pkgCustomTxt: string = ' 自訂投保方案';
  selPkgH2: string = '選擇方案';
  longDesc: Array<any> = [];
  pkgDetailLongArr: Array<any> = [];
  selectedCustomePkg: any;
  cusSecondItemNa: Array<any> = [];
  cusPrimaryItem: any;
  customBtn: Array<any> = [];
  customBtnAmt: Array<any> = [];
  paddingBottonZero: boolean = false;
  logoImgSrc: string = '';
  featureDesc: string = '';
  tableShowHidden: boolean = false;
  startDayLimit:number = 0;
  diffDays:number = 0;
  purposeGo: any = '觀光';
  isDoneSelectedPlaces: boolean = false;
  textOfSelectingDays: string = '請點選旅程出發日與返回日';
  images: string[] = [
                      // 'assets/images/nature/1.jpg',
                      'assets/images/nature/2.jpg',
                      'assets/images/nature/3.jpg',
                      'assets/images/nature/4.jpg',
                      ];

  showPkgDestail: boolean = false;

  favCountry: Array<any> = [];

  @ViewChild('eleTest')  el:ElementRef;
  @ViewChild('noNeedArea') nNA:ElementRef;
  @ViewChild('arrowUp') arrowUp:ElementRef;
  @ViewChild('getUpClz') getUpClz:ElementRef;

  constructor(
    private dataService:DataServiceService,
  ){
    $('html, body').animate({scrollTop: '0px'}, 0);
  }

  ngOnInit() {
    this.firstMon = this.getMonday(new Date());
    this.dataService.getIniData().subscribe((posts) => {
      this.countries = posts.countryList;
      this.data = posts;
      this.packageList = posts.packageList;

      posts.packageList.filter(val => val && val.isDefaultPackage).map(value =>
        this.selectedPackage = value
      );
      this.selectedPackageName = this.selectedPackage['packageName'];
      this.secondaryItems = this.selectedPackage['secondaryItems'];
      this.pkgPrimary = this.selectedPackage['primaryItems'];
      console.log('96', this.pkgPrimary);
      this.featureDesc = this.selectedPackage['featureDesc'];
      this.toGetLogo(this.selectedPackage['companyCode']);
      this.fireInTheHole(this.selectedPackage['packageId'] - 1);
      // this.toGetDetailOfPkg();

      this.purposeList = posts.purposeList;
      this.cusPackageList = posts.cusPackageList;
      this.selectedCustomePkg = this.cusPackageList[0];
      console.log(this.selectedCustomePkg);
      this.getDayFromBkend = posts.productSetting['startDateLimit'];
      this.startDayLimit = posts.productSetting['startDateLimit'];
      this.textOfOverDays = '超過' + this.getDayFromBkend + '天後才出發？';
      this.disabledDays = posts.disabledDateList;
      this.disabledDays.push('2017-08-29');
      this.disabledDays.push('2017-08-30');

      this.favCountry = posts['favCountry'];
      this.travelPeriodLimit = posts.productSetting['travelPeriodLimit'];
      this.toGetCountryList(this.countries);
      // this.selectedCountriesId = this.countries[0];
      // this.toGetCustomPackageContent(this.selectedCustomePkg, 'remove0');

    });

    // this.dataService.getMockData().subscribe((mockPosts) => {
    //   console.log(mockPosts);
    // });
  }

  toClearRadio(radioBtn){
    $('input[name="'+ radioBtn +'"]').prop('checked', false);
  }

  tryGetFavor(favorCon:any){
    this.selectedCountriesId = favorCon['traceGroupId'];
    this.selectedCountry = favorCon['code'];
    this.selectedCountryStr = favorCon['name'];
    this.selectedCountries = '';
    var nameStr;
    this.countries.forEach((el) => {
      if(el['groupId'] == favorCon['traceGroupId']){
        nameStr = el;
      }
    });
    this.selectedCountries = nameStr;
    this.isDoneSelectedPlaces = true;
  }

  changePurpose() {
    this.doneSelPurpose = false;
  }

  doNotNeed(number) {
    $('.noNeedClassForWord'+number).slideDown('fast');
    $('.needClassForWord'+number).slideUp('fast');
  }

  amountBtnClick(val) {
    $('.needClassForWord'+val).slideDown('fast');
    $('.noNeedClassForWord'+val).slideUp('fast');

  }

  toTogglePurposeBtn(clz, value) {
    this.purposeGo = value.name;
    this.doneSelPurpose = true;
    $('.' + clz).children('.checkBtn').addClass('hidden');
    $('.' + clz).children('.checkBtn').removeClass('hidden');
  }

  createRange(number){
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
      items.push(i);
    }
    return items;
  }

  pkgCustomToggle() {
    this.pkgCustomGo = !this.pkgCustomGo;
    if(this.pkgCustomGo){
      this.selPkgH2 = '自訂方案';
      this.pkgCustomTxt = '回建議方案挑選';
    } else {
      this.selPkgH2 = '選擇方案';
      this.pkgCustomTxt = '自訂投保方案';
    }
    setTimeout(function(){
      $('.packageButton0').click();
    }, 300);
  }

  getDayArr(lastDay, firstDay){
    var oneDay = 24*60*60*1000;
    var firstDate = new Date(this.getMonday(lastDay));
    var seconDate = new Date(firstDay);
    var diffDays = Math.round(Math.abs((firstDate.getTime() - seconDate.getTime())/(oneDay)));
    let returnArr = [];
    for(let i = 1; i <= diffDays; i++){
      returnArr.push(i);
    }
    return returnArr;
  }

  toShowMoreDaysFun() {
    if(this.getDayFromBkend == this.travelPeriodLimit){
      this.selectTravelDayIsDone = false;
      this.toShowMoreDays = false;
      this.textOfOverDays = '出國超過' + this.getDayFromBkend + '天？';
    } else {
      this.getDayFromBkend = this.getDayFromBkend + (this.travelPeriodLimit/5);
    }
  }

  toModifiedDays() {
    this.tableShowHidden = false;
    this.getDayFromBkend = this.startDayLimit;
    this.textOfOverDays = '出國超過' + this.getDayFromBkend + '天？';
    this.selectTravelDayIsDone = false;
    this.firstMon = this.getMonday(new Date());
    this.startTravelDay = '';
    this.endTravelDay = '';
  }

  onClickMe($event, classValueBtn, numberBtn) {
    if(this.selectTravelDayIsDone === false && !this.startTravelDay){
      this.textOfSelectingDays = '請點選旅程出發日與返回日';
      this.startTravelDay = $event.target.value;
      this.firstMon = this.getMonday(new Date(this.startTravelDay));
      this.getDayFromBkend = this.travelPeriodLimit/5;
      this.selectTravelDayIsDone = true;
      this.toShowMoreDays = true;
      var STD = this.startTravelDay;
      $('html, body').animate({
        scrollTop: $("#backToPoint").offset().top - 120
      }, 300);
      setTimeout(function(){
        $('.table button').each(function() {
          if($(this).val() == STD){
            $(this).find('.checkBtn').removeClass('hidden');
            $(this).find('.checkBtnTxt').removeClass('hidden');
          }
        });
      }, 300);
    } else {
      this.textOfSelectingDays = '您的旅遊期間';
      this.tableShowHidden = true;
      this.endTravelDay = $event.target.value;
      let oneDay = 24*60*60*1000;
      let firstDate = new Date(this.startTravelDay);
      let secondDate = new Date(this.endTravelDay);
      let diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
      this.diffDays = diffDays+1;
      this.getPriceServiceData();
    }
  }

  fireInTheHole(val) {
    $('#remove'+ val).removeClass('hidden');
  }

  toShowCusDetailContent() {
    for(let i = 0; i <= $('#paddingSpe i').length; i ++) {
      if($('#paddingSpe i')[i]){
        if($('#paddingSpe i')[i]['className'] == 'fa fa-angle-down'){
          $('#paddingSpe i')[i]['className'] =  'fa fa-angle-up';
        }
      }
    }

    if(this.getUpClz.nativeElement.children[2]['className'] == 'fa fa-angle-up'){
      this.getUpClz.nativeElement.children[2]['className'] = 'fa fa-angle-down';
    } else if (this.getUpClz.nativeElement.children[2]['className'] == 'fa fa-angle-down') {
      this.getUpClz.nativeElement.children[2]['className'] = 'fa fa-angle-up';
    }

    var idNum = this.el.nativeElement.lastElementChild.id.slice(3,4);
    for(let x = 0; x <= idNum; x++) {
      $('#ele'+x).slideUp('fast');
    }
    $('#mainLongDetailDiv').slideToggle('fast');
  }

  toGetCustomPackageContent(val) {
    this.selectedCustomePkg = val;
    this.cusSecondItemNa = this.selectedCustomePkg['secondaryItems'];
    this.cusPrimaryItem = this.selectedCustomePkg['primaryItems'];
    if(this.pkgCustomGo){
      this.selectedPackageName = this.selectedCustomePkg['packageName'];
    } else {
      this.selectedPackageName = this.selectedPackage['packageName'];
    }
    this.pkgPrimary = this.selectedCustomePkg['primaryItems'];

    // this.toGetDetailOfPkg();
    this.toGetLogo(this.selectedCustomePkg['companyCode']);
    // if(this.selectedCustomePkg['featureDesc']) {
    //   this.featureDesc = this.selectedCustomePkg['featureDesc'];
    // }
    //
    // let number = 0;
    // this.customBtn = [];
    // this.customBtnAmt = [];
    // for(var i = 0; i <= this.cusSecondItemNa.length; i++) {
    //   this.customBtn.push(this.cusSecondItemNa[i]['insItemName']);
    //   this.customBtnAmt.push(this.cusSecondItemNa[i]['amountList']);
    // }
  }

  returnIfNoNeedIsNeed(obj) {
    if(obj.length == 0) {
      return true;
    } else {
      return false;
    }
  }

  toGetLogo(val) {
    switch(val){
      case 'TaiAn':
        this.logoImgSrc = 'assets/images/logos/taian.jpg';
        break;
      case 'MingTai':
        this.logoImgSrc = 'assets/images/logos/mitai.jpg';
        break;
    }
  }

  clickWannaInsuredBtn() {
    $('html body').animate({'scrollTop': $('#animateFlag').offset().top - 80});
  }

  toCloseAll() {
    for(let i = 0; i <= $('#paddingSpe i').length; i ++) {
      if($('#paddingSpe i')[i]){
        if($('#paddingSpe i')[i]['className'] == 'fa fa-angle-down'){
          $('#paddingSpe i')[i]['className'] =  'fa fa-angle-up';
        }
      }
    }

    var idNum = this.el.nativeElement.lastElementChild.id.slice(3,4);
    for(let x = 0; x <= idNum; x++) {
      $('#ele'+x).slideUp('fast');
    }
    $('#mainLongDetailDiv').slideUp('fast');
  }

  toGetShowContentOfPkg(id, number, objClick){
    for(let i = 0; i <= $('#paddingSpe i').length; i ++) {
      if($('#paddingSpe i')[i]){
        if($('#paddingSpe i')[i]['className'] == 'fa fa-angle-down'){
          $('#paddingSpe i')[i]['className'] =  'fa fa-angle-up';
          objClick.children[1]['className'] = 'fa fa-angle-down';
        }
      }
    }

    if ($('#'+id).is(':visible')) {
      objClick.children[1]['className'] = 'fa fa-angle-up';
    } else {
      objClick.children[1]['className'] = 'fa fa-angle-down';
    }

    this.paddingBottonZero = false;
    var idNum = this.el.nativeElement.lastElementChild.id.slice(3,4);
      for(let x = 0; x <= idNum; x++) {
        $('#ele'+x).slideUp('fast');
      }
    $('#mainLongDetailDiv').slideUp('fast');
    if(id == this.el.nativeElement.lastElementChild.id) {
      this.paddingBottonZero = true;
    }
    // for(let i = 0; i <= $('#paddingSpe i').length; i++){
    //   if($('#paddingSpe i')[i]['className'] == 'fa fa-angle-down'){
    //     console.log($('#paddingSpe i')[i]['className']);
    //   };
    // }
    // var numberOfChild = this.el.nativeElement.children;
    // var idNum = this.el.nativeElement.lastElementChild.id.slice(3,4);
    //
    // switch(number){
    //   case 0:
    //     var idNum = this.el.nativeElement.lastElementChild.id.slice(3,4);
    //     for(let x = 0; x <= idNum; x++) {
    //       $('.rowOfBtn'+x)[0]['hidden'] = !$('.rowOfBtn'+x)[0]['hidden'];
    //     }
    //     $('.rowOfBtn0')[0]['hidden'] = false;
    //     break;
    //   case 1:
    //     var idNum = this.el.nativeElement.lastElementChild.id.slice(3,4);
    //     for(let x = 1; x <= idNum; x++) {
    //       $('.rowOfBtn'+x)[0]['hidden'] = !$('.rowOfBtn'+x)[0]['hidden'];
    //     }
    //     $('.rowOfBtn1')[0]['hidden'] = false;
    //     break;
    //   case 2:
    //     var idNum = this.el.nativeElement.lastElementChild.id.slice(3,4);
    //     for(let x = 2; x <= idNum; x++) {
    //       $('.rowOfBtn'+x)[0]['hidden'] = !$('.rowOfBtn'+x)[0]['hidden'];
    //     }
    //     $('.rowOfBtn2')[0]['hidden'] = false;
    //     break;
    //   case 3:
    //     var idNum = this.el.nativeElement.lastElementChild.id.slice(3,4);
    //     for(let x = 3; x <= idNum; x++) {
    //       $('.rowOfBtn'+x)[0]['hidden'] = !$('.rowOfBtn'+x)[0]['hidden'];
    //     }
    //     $('.rowOfBtn3')[0]['hidden'] = false;
    //     break;
    //   case 4:
    //     var idNum = this.el.nativeElement.lastElementChild.id.slice(3,4);
    //     for(let x = 4; x <= idNum; x++) {
    //       $('.rowOfBtn'+x)[0]['hidden'] = !$('.rowOfBtn'+x)[0]['hidden'];
    //     }
    //     $('.rowOfBtn4')[0]['hidden'] = false;
    //     break;
    //   case 5:
    //     var idNum = this.el.nativeElement.lastElementChild.id.slice(3,4);
    //     for(let x = 5; x <= idNum; x++) {
    //       $('.rowOfBtn'+x)[0]['hidden'] = !$('.rowOfBtn'+x)[0]['hidden'];
    //     }
    //     $('.rowOfBtn5')[0]['hidden'] = false;
    //     break;
    //   case 6:
    //     var idNum = this.el.nativeElement.lastElementChild.id.slice(3,4);
    //     for(let x = 6; x <= idNum; x++) {
    //       $('.rowOfBtn'+x)[0]['hidden'] = !$('.rowOfBtn'+x)[0]['hidden'];
    //     }
    //     $('.rowOfBtn6')[0]['hidden'] = false;
    //     break;
    //   case 7:
    //     var idNum = this.el.nativeElement.lastElementChild.id.slice(3,4);
    //     for(let x = 7; x <= idNum; x++) {
    //       $('.rowOfBtn'+x)[0]['hidden'] = !$('.rowOfBtn'+x)[0]['hidden'];
    //     }
    //     $('.rowOfBtn7')[0]['hidden'] = false;
    //     break;
    //   default:
    // }
    if ($('#'+id).is(':visible')) {
      $('#'+id).slideUp('fast');
    } else {
      $('#'+id).slideDown('fast');
    }
  }

  buttonToDisabled(calVal, daysNeedToDisable) {
    let today = new Date();
    let startDaysDisabled = new Date(this.startTravelDay);
    let buttonDate = new Date(calVal);

    daysNeedToDisable.forEach((days) => {
      if(buttonDate.getTime() == new Date(days).getTime()) {
      }
    })

    if(buttonDate < today || buttonDate < startDaysDisabled){
      return true;
    }else {
      return false;
    }
  }

  getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:0); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  toGetCountryList(val) {
    this.selectedCountries = val[0];
    this.selectedCountriesId;
  }

  toGetPackageContent(val, classValueIs) {
    $('.longTri').addClass('hidden');
    $('#' + classValueIs).removeClass('hidden');
    if(val){
      this.selectedPackage = val;
      this.selectedPackageName = val.packageName;
      this.secondaryItems = this.selectedPackage['secondaryItems'];
      this.toGetLogo(this.selectedPackage['companyCode']);
      this.pkgPrimary = this.selectedPackage['primaryItems'];
      console.log(this.pkgPrimary);

      this.featureDesc = this.selectedPackage['featureDesc'];
      // this.toGetDetailOfPkg();
      for (var i = 0; i <= this.pkgPrimary.length; i++){
        // console.log(this.pkgPrimary[i]['frontendDetailInfos']);
      }
    }
    console.log(val);
  }

  /* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  }

  /* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.body.style.backgroundColor = "white";
  }

  // togglePkgTitle(val) {
  //   console.log(val);
  //   this.showPkgTitleInfo = !this.showPkgTitleInfo;
  // <i (click)="togglePkgTitle()" class="fa " [ngClass]="{'fa-search-plus': !showPkgTitleInfo, 'fa-search-minus': showPkgTitleInfo}"></i>
  // }

  toggleDoneSelect() {
    this.isDoneSelectedPlaces = true;
    console.log(this.selectedCountries);
    var b = this.selectedCountry;
    var a;
    this.selectedCountries.countryList.forEach(function(el){
      if(el.code ==  b) {
       a = el.name;
      }
    })
    this.selectedCountryStr = a;
  }

  modifiedPlaces() {
    this.isDoneSelectedPlaces = false;
  }

  changeCountries(item) {
    this.selectedCountries = '';
    for(let i = 0; i <= this.countries.length; i ++){
      if (this.countries[i]['groupId'] == this.selectedCountriesId) {
        this.selectedCountries = this.countries[i];
      }
    }
  }

  chosenCountries:string = '';
  settleDownTheCountries($event) {
    console.log($event);
    this.chosenCountries = this.selectedCountriesId['name'];
  }

  // toGetClas(i){
  //   switch(i){
  //     case 0:
  //       return this.showPkgDestail0;
  //     case 1:
  //       return this.showPkgDestail1;
  //     case 2:
  //       return this.showPkgDestail2;
  //     case 3:
  //       return this.showPkgDestail3;
  //   }
// <i (click)="togglePkg(i)" class="fa " [ngClass]="{'fa-search-plus': !toGetClas(i), 'fa-search-minus': toGetClas(i)}"></i><div id="triangle-up" *ngIf="showPkgDestail" [ngClass]="{'hidden': !toGetClasPic(i), '': toGetClasPic(i)}"></div>
//   // }
//
//   showImgGrey0: boolean = true;
//   showImgGrey1: boolean = true;
//   showImgGrey2: boolean = true;
//   showImgGrey3: boolean = true;

  // toGetClasPic(i){
  //   switch(i){
  //     case 0:
  //       return this.showImgGrey0;
  //     case 1:
  //       return this.showImgGrey1;
  //     case 2:
  //       return this.showImgGrey2;
  //     case 3:
  //       return this.showImgGrey3;
  //   }
  // }


  // initImgPic(){
  //   if(
  //     !this.showPkgDestail0 &&
  //     !this.showPkgDestail1 &&
  //     !this.showPkgDestail2 &&
  //     !this.showPkgDestail3
  //   ){
  //     this.showImgGrey0 = true;
  //     this.showImgGrey1 = true;
  //     this.showImgGrey2 = true;
  //     this.showImgGrey3 = true;
  //   }
  // }



  getPriceServiceData() {
    var dataBak = {};
    dataBak['cusItemJson'] = [];
    dataBak['packageId'] = 1;
    dataBak['days'] = this.diffDays;
    var cusObj = {};
    cusObj['companyCode'] =  'MingTai';
    cusObj['itemCode'] = 'TAK009';
    cusObj['amountCode'] = '50萬';

    dataBak['cusItemJson'].push(cusObj);

    this.dataService.getPkPrice(dataBak);
  }

  toShowPkgDetail() {
    this.showPkgDestail = !this.showPkgDestail;
  }

  // togglePkg(val) {
  //   for(var i = 0; i <= this.secondaryItems.length; i++) {
  //     if(i == val){
  //       this.longDesc = this.secondaryItems[i]['longDetailList'];
  //     }
  //   }
  //   this.showPkgDestail = !this.showPkgDestail;
  //   switch(val){
  //     case 0:
  //     this.showPkgDestail0 = !this.showPkgDestail0;
  //     if(this.showPkgDestail0){
  //       this.showPkgDestail = true;
  //     }
  //     if(this.showPkgDestail1){
  //       this.showPkgDestail1 = false;
  //     }
  //     if(this.showPkgDestail2){
  //       this.showPkgDestail2 = false;
  //     }
  //     if(this.showPkgDestail3){
  //       this.showPkgDestail3 = false;
  //     }
  //
  //     this.showImgGrey0 = false;
  //     this.showImgGrey0 = !this.showImgGrey0;
  //     this.showImgGrey1 = false;
  //     this.showImgGrey2 = false;
  //     this.showImgGrey3 = false;
  //     this.initImgPic();
  //       break;
  //   case 1:
  //     this.showPkgDestail1 = !this.showPkgDestail1;
  //     if(this.showPkgDestail1){
  //       this.showPkgDestail = true;
  //     }
  //     if(this.showPkgDestail0){
  //       this.showPkgDestail0 = false;
  //     }
  //     if(this.showPkgDestail2){
  //       this.showPkgDestail2 = false;
  //     }
  //     if(this.showPkgDestail3){
  //       this.showPkgDestail3 = false;
  //     }
  //
  //     this.showImgGrey0 = false;
  //     this.showImgGrey1 = false;
  //     this.showImgGrey1 = !this.showImgGrey1;
  //     this.showImgGrey2 = false;
  //     this.showImgGrey3 = false;
  //     this.initImgPic();
  //     break;
  //   case 2:
  //     this.showPkgDestail2 = !this.showPkgDestail2;
  //     if(this.showPkgDestail2){
  //       this.showPkgDestail = true;
  //     }
  //     if(this.showPkgDestail0){
  //       this.showPkgDestail0 = false;
  //     }
  //     if(this.showPkgDestail1){
  //       this.showPkgDestail1 = false;
  //     }
  //     if(this.showPkgDestail3){
  //       this.showPkgDestail3 = false;
  //     }
  //
  //     this.showImgGrey0 = false;
  //     this.showImgGrey1 = false;
  //     this.showImgGrey2 = false;
  //     this.showImgGrey2 = !this.showImgGrey2;
  //     this.showImgGrey3 = false;
  //     this.initImgPic();
  //     break;
  //   case 3:
  //     if(this.showPkgDestail0){
  //       this.showPkgDestail0 = false;
  //     }
  //     if(this.showPkgDestail1){
  //       this.showPkgDestail1 = false;
  //     }
  //     if(this.showPkgDestail2){
  //       this.showPkgDestail2 = false;
  //     }
  //     this.showPkgDestail3 = !this.showPkgDestail3;
  //     if(this.showPkgDestail3){
  //       this.showPkgDestail = true;
  //     }
  //
  //     this.showImgGrey0 = false;
  //     this.showImgGrey1 = false;
  //     this.showImgGrey2 = false;
  //     this.showImgGrey3 = false;
  //     this.showImgGrey3 = !this.showImgGrey3;
  //     this.initImgPic();
  //     break;
  //   }
  // }
}
