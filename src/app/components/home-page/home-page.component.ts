import {Component, OnInit, AfterViewInit, ElementRef, ViewChild, ViewChildren}  from '@angular/core';
import { ActivatedRoute, RouterModule, Routes } from "@angular/router";
import { DataServiceService } from '../../services/data-service.service';
import { OwlCarousel } from 'ngx-owl-carousel';

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
  transportation: string = '飛機';
  defaultCustomerPkg: any;
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
  amountLongList: Array<any> = [];
  purposeGo: any = '觀光';
  isDoneSelectedPlaces: boolean = false;
  finalPrice: any = 0;
  cusItemJson: Array<any> = [];
  textOfSelectingDays: string = '請點選旅程出發日與返回日';
  showPkgDestail: boolean = false;
  amtBtnClickToShow: boolean = true;
  time: number = 0;
  disabledReason: Array<any> = [];
  favCountry: Array<any> = [];

  @ViewChild('eleTest')  el:ElementRef;
  @ViewChild('noNeedArea') nNA:ElementRef;
  @ViewChild('arrowUp') arrowUp:ElementRef;
  @ViewChild('getUpClz') getUpClz:ElementRef;
  @ViewChild('aGotClick') aGotClick:ElementRef;
  @ViewChild('selectedItem') selectedItem:ElementRef;
  @ViewChild(OwlCarousel) owl:OwlCarousel;

  constructor(
    private dataService:DataServiceService,

  ){
    $('html, body').animate({scrollTop: '0px'}, 0);
  }

  images: Array<any> = [];

  ngOnInit() {
    this.firstMon = this.getMonday(new Date());
    this.dataService.getIniData().subscribe((posts) => {
      var array = [];
      posts.bannerList.forEach((item) => {
        let objImage = {};
        objImage['imageUrl'] = 'http://210.242.7.164' + item.imageUrl;
        objImage['hoverText'] = item.hoverText;
        objImage['linkUrl'] = item.linkUrl;
        array.push(objImage);
      });
      this.images = array;
      this.owl.refresh();

      this.countries = posts.countryList;
      console.log(this.countries);
      this.data = posts;
      this.packageList = posts.packageList;
      posts.cusPackageList.filter(val => val.isDefaultPackage == true).map(
          value => this.defaultCustomerPkg = value
      );
      posts.packageList.filter(val => val && val.isDefaultPackage).map(value =>
        this.selectedPackage = value
      );
      this.selectedPackageName = this.selectedPackage['packageName'];
      this.secondaryItems = this.selectedPackage['secondaryItems'];
      this.pkgPrimary = this.selectedPackage['primaryItems'];
      this.featureDesc = this.selectedPackage['featureDesc'];
      this.toGetLogo(this.selectedPackage['companyCode']);
      this.fireInTheHole(this.selectedPackage['packageId'] - 1);

      this.purposeList = posts.purposeList;
      this.cusPackageList = posts.cusPackageList;
      this.defaultCustomerPkg['secondaryItems'].forEach((item) => {
        var objBack = {};
        item['amountList'].forEach((unit) => {
          if(unit['isDefaultOption'] == true) {
            objBack['companyCode'] = item['companyCode'];
            objBack['itemCode'] = item['insItemCode'];
            objBack['amountCode'] = unit['amountCode'];
            this.cusItemJson.push(objBack);
          }
        });
      });

      this.getDayFromBkend = posts.productSetting['startDateLimit'];
      this.startDayLimit = posts.productSetting['startDateLimit'];
      this.textOfOverDays = '超過' + this.getDayFromBkend + '天後才出發？';
      this.disabledDays = posts.disabledDateList;
      posts.disabledDateList.forEach((item) => {
        this.disabledDays.push(item.date);
      });
      posts.disabledDateList.forEach((item) => {
        this.disabledReason.push(item.reason);
      });

      console.log(posts);
      this.favCountry = posts['favCountry'];
      this.travelPeriodLimit = posts.productSetting['travelPeriodLimit'];
      this.toGetCountryList(this.countries);
      // $(".js-example-basic-single").select2();
    });
    this.changeCountries('');
    // this.dataService.getMockData().subscribe((mockPosts) => {
    //   console.log(mockPosts);
    // });
  }

  toGetCusPkgPrice() {
    let cusData = {};
    cusData['packageId'] = this.defaultCustomerPkg['packageId'];
    cusData['days'] = this.diffDays;
    cusData['cusItemJson'] = this.cusItemJson;
    this.finalPrice = this.dataService.getCusPkPrice(cusData).subscribe((item)=>{
      this.finalPrice = item
    });
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
    $('html body').animate({'scrollTop': $('#animateFlag').offset().top + 400});
    this.isDoneSelectedPlaces = true;
  }

  changePurpose() {
    this.doneSelPurpose = false;
  }

  doNotNeedToShow: boolean = false;
  doNotNeed(number, val) {
    console.log(val)
    console.log('1', this.cusItemJson);
    var returnArr = [];
    this.cusItemJson.forEach((item) => {
      if(item['itemCode'] == val){

      }else {
        returnArr.push(item);
      }
    })
    $('#ele'+number+' .divAmtLong p').remove();
    $('.amtBtnClickToShow'+number).remove();
    this.cusItemJson = returnArr;
    this.toGetCusPkgPrice();
    this.doNotNeedToShow = true
    $('.noNeedClassForWord'+number).slideDown('fast');
    $('.needClassForWord'+number).slideUp('fast');
  }

  determineHideOrShow(lists, number) {
    var reArray = [];
    lists.forEach((item) => {
      reArray.push(item['isDefaultOption'])
    })
    if(reArray.indexOf(true) >= 0){
      return false;
    } else {
      return true;
    }
  }

  amountBtnClick(number, val, itemCode) {
    // this.toCloseAll();
    this.amtBtnClickToShow = false;
    this.doNotNeedToShow = false;
    let cusData = {};
    cusData['packageId'] = this.selectedCustomePkg.packageId;
    cusData['days'] = this.diffDays;

    var cusPkObj = {};
    cusPkObj['companyCode'] = this.selectedCustomePkg['companyCode'];
    cusPkObj['itemCode'] = itemCode;
    cusPkObj['amountCode'] = val['amountCode'];

    this.cusItemJson.filter(item => item['itemCode'] == itemCode).map(
      (value) => {
        let index = this.cusItemJson.indexOf(value);
        var arry = this.cusItemJson;
        arry.splice(index, 1);
        this.cusItemJson = arry;
        this.cusItemJson.push(cusPkObj);
        console.log('1', this.cusItemJson);
      }
    );

    this.toGetCusPkgPrice();

    var html = '';
    for(let i = 0; i < val['longDetailList'].length; i++){
      html += '<p>';
      html += val['longDetailList'][i].desc;
      html += '</p>';
    }
    $('#ele'+number+' .divAmtLong p').remove();
    $('.amtBtnClickToShow'+number).remove();
    $('#ele'+number+' .divAmtLong').append(html);

    // this.amountLongList = val['longDetailList'];
    $('.needClassForWord'+number).slideDown('fast');
    $('.noNeedClassForWord'+number).slideUp('fast');
  }

  toTogglePurposeBtn(clz, value) {
    $('html body').animate({'scrollTop': $('#animateFlag').offset().top + 740});
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
      this.toGetCustomPackageContent(this.defaultCustomerPkg);
    } else {
      this.selPkgH2 = '選擇方案';
      this.pkgCustomTxt = '自訂投保方案';
      this.getPriceServiceData();
    }
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
      $('html body').animate({'scrollTop': $('#animateFlag').offset().top + 1100});
      if(this.pkgCustomGo == false){
        this.getPriceServiceData();
      } else {
        this.toGetCusPkgPrice();
      }
    }
  }

  fireInTheHole(val) {
    $('#remove'+ val).removeClass('hidden');
  }

  toShowCusDetailContent() {
    if(this.getUpClz.nativeElement.children[2]['className'] == 'fa fa-angle-down'){
      for(let i = 0; i <= $('#paddingSpe i').length; i ++) {
        if($('#paddingSpe i')[i]){
          if($('#paddingSpe i')[i]['className'] == 'fa fa-angle-up'){
            $('#paddingSpe i')[i]['className'] =  'fa fa-angle-down';
          }
        }
      }
      this.getUpClz.nativeElement.children[2]['className'] = 'fa fa-angle-up';
    } else if (this.getUpClz.nativeElement.children[2]['className'] == 'fa fa-angle-up') {
      for(let i = 0; i <= $('#paddingSpe i').length; i ++) {
        if($('#paddingSpe i')[i]){
          if($('#paddingSpe i')[i]['className'] == 'fa fa-angle-up'){
            $('#paddingSpe i')[i]['className'] =  'fa fa-angle-down';
          }
        }
      }
      this.getUpClz.nativeElement.children[2]['className'] = 'fa fa-angle-down';
    }

    var idNum = this.el.nativeElement.lastElementChild.id.slice(3,4);
    for(let x = 0; x <= idNum; x++) {
      $('#ele'+x).slideUp('fast');
    }
    $('#mainLongDetailDiv').slideToggle('fast');
  }

  toGetCustomPackageContent(val) {
    this.defaultCustomerPkg = val;
    this.cusItemJson = [];
    this.defaultCustomerPkg['secondaryItems'].forEach((item) => {
      var objBack = {};
      item['amountList'].forEach((unit) => {
        if(unit['isDefaultOption'] == true) {
          objBack['companyCode'] = item['companyCode'];
          objBack['itemCode'] = item['insItemCode'];
          objBack['amountCode'] = unit['amountCode'];
          this.cusItemJson.push(objBack);
        }
      });
    });
    this.toGetCusPkgPrice();

    this.selectedCustomePkg = val;
    this.cusSecondItemNa = this.selectedCustomePkg['secondaryItems'];
    this.cusPrimaryItem = this.selectedCustomePkg['primaryItems'];
    if(this.pkgCustomGo){
      this.selectedPackageName = this.selectedCustomePkg['packageName'];
    } else {
      this.selectedPackageName = this.selectedPackage['packageName'];
    }
    this.pkgPrimary = this.selectedCustomePkg['primaryItems'];
    this.toGetLogo(this.selectedCustomePkg['companyCode']);
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
        if($('#paddingSpe i')[i]['className'] == 'fa fa-angle-up'){
          $('#paddingSpe i')[i]['className'] =  'fa fa-angle-down';
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
        if($('#paddingSpe i')[i]['className'] == 'fa fa-angle-up'){
          $('#paddingSpe i')[i]['className'] =  'fa fa-angle-down';
          objClick.children[1]['className'] = 'fa fa-angle-up';
        }
      }
    }

    if ($('#'+id).is(':visible')) {
      objClick.children[1]['className'] = 'fa fa-angle-down';
    } else {
      objClick.children[1]['className'] = 'fa fa-angle-up';
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

    if ($('#'+id).is(':visible')) {
      $('#'+id).slideUp('fast');
    } else {
      $('#'+id).slideDown('fast');
    }
  }

  buttonToDisabled(calVal) {
    let today = new Date();
    let startDaysDisabled = new Date(this.startTravelDay);
    var buttonDate = new Date(calVal);

    if(buttonDate < today || buttonDate < startDaysDisabled){
      return true;
    } else {
      return false;
    }
  }

  buttonToDisabledTwo(btnVal){
    let buttonDate = new Date(btnVal);
    for(var i = 0; i <= this.disabledDays.length; i++) {
      if (buttonDate.getTime() == new Date(this.disabledDays[i]).getTime()) {
        return true;
      }
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
      let dataBak = {};
      dataBak['packageId'] = this.selectedPackage['packageId'];
      dataBak['days'] = this.diffDays;

      this.dataService.getPkPrice(dataBak).subscribe((item) => {
        this.finalPrice = item;
      });
      this.featureDesc = this.selectedPackage['featureDesc'];
      for (var i = 0; i <= this.pkgPrimary.length; i++){
        // console.log(this.pkgPrimary[i]['frontendDetailInfos']);
      }
    }
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
    $('html body').animate({'scrollTop': $('#animateFlag').offset().top + 400});
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

  // chosenCountries:string = '';
  // settleDownTheCountries($event) {
  //   console.log($event);
  //   this.chosenCountries = this.selectedCountriesId['name'];
  // }

  getPriceServiceData() {
    let dataBak = {};
    dataBak['packageId'] = this.selectedPackage['packageId'];
    dataBak['days'] = this.diffDays;

     this.dataService.getPkPrice(dataBak).subscribe((item) => {
       this.finalPrice = item;
     });
  }

  toShowPkgDetail() {
    this.showPkgDestail = !this.showPkgDestail;
  }

  iDLikeToGoInsuredBtn(){
    let dataToSendBack = {};
    dataToSendBack['orderNumber'] = '';
    dataToSendBack['countryCode'] = this.selectedCountry;
    dataToSendBack['cityId'] = 0;
    dataToSendBack['purpose'] = this.purposeGo;
    dataToSendBack['transport'] = this.transportation;
    dataToSendBack['startDate'] = this.startTravelDay;
    dataToSendBack['endDate'] = this.endTravelDay;
    dataToSendBack['packageId'] = this.selectedPackage['packageId'];
    if(this.selectedCustomePkg == undefined){
      dataToSendBack['cusPackageId'] = this.defaultCustomerPkg['packageId'];
    } else {
      dataToSendBack['cusPackageId'] = this.selectedPackage['packageId'];
    }
    dataToSendBack['trackingId'] = '';
    dataToSendBack['cusItemList'] = this.cusItemJson;
    this.dataService.toSendInsuredDataToBakHomePage(dataToSendBack);
  }
}
