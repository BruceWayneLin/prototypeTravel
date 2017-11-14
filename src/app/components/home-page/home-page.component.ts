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

  selectedCountyName: string;
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
  pkgCustomTxt: string = '挑不到想要的?點我自己選';
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
  startTravelDayOn: boolean = false;
  tableList: any;
  modifiedClicked: boolean = false;
  ifTheStartIsPlusOneMoreDay: any;
  testDay:any = new Date();
  resetBackCountry: any;

  @ViewChild('eleTest')  el:ElementRef;
  @ViewChild('noNeedArea') nNA:ElementRef;
  @ViewChild('arrowUp') arrowUp:ElementRef;
  @ViewChild('getUpClz') getUpClz:ElementRef;
  @ViewChild('aGotClick') aGotClick:ElementRef;
  @ViewChild('selectedItem') selectedItem:ElementRef;
  @ViewChild('thisSelect') thisSelect:ElementRef;

  @ViewChild(OwlCarousel) owl:OwlCarousel;

  constructor(
    private dataService:DataServiceService,
  ){
    $('body,html').animate({scrollTop: '0px'}, 0);
  }

  images: Array<any> = [];

  ngOnInit() {
    if(new Date(this.testDay).getDay() == 0 && !this.modifiedClicked){
      var tmr = new Date(this.testDay).setDate(new Date(this.testDay).getDate() + 1);
      this.firstMon = this.getMonday(new Date(tmr));
    }else{
      if(this.modifiedClicked){
        this.testDay = new Date();
        this.firstMon = this.getMonday(new Date(this.testDay));
      }else{
        this.firstMon = this.getMonday(new Date(this.testDay));
      }
    }
    if(this.dataService.orderNumberForSave){
      this.dataService.getCustomerHomePage().subscribe((item)=>{
        this.startTravelDay = item['dateFrom'];
        this.diffDays = item['datePeriod'];
        this.endTravelDay = item['dateTo'];
        this.pkgCustomGo = item['isCusPackage'];
        this.purposeGo = item['purpose'];
        this.resetBackCountry = item['country'];
        this.selectedCountries = item['country'];
        this.tryGetFavor(item['country']);
        if(this.diffDays && this.startTravelDay && this.endTravelDay){
          this.tableShowHidden = true;
        }
        this.dataService.getIniData().subscribe((posts) => {
          this.countries = posts.countryList;
          this.toGetCountryList(this.countries);
          this.changeCountries('');

        });
      })
    }

    this.dataService.getIniData().subscribe((posts) => {
      var array = [];
      posts.bannerList.forEach((item) => {
        let objImage = {};
        objImage['imageUrl'] =  item.imageUrl;
        objImage['hoverText'] = item.hoverText;
        objImage['linkUrl'] = item.linkUrl;
        objImage['clickAndGoToAncher'] = item.clickAndGoToAncher;
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
      this.tableList = this.selectedPackage['table'];
      console.log('table', this.tableList);

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

      var d = new Date(this.testDay);
      var n = d.getDay()+1;

      this.getDayFromBkend = (posts.productSetting['startDateLimit'] + n);
      this.startDayLimit = posts.productSetting['startDateLimit'];
      this.ifTheStartIsPlusOneMoreDay = posts.productSetting['start'];

      this.textOfOverDays = '超過' + (this.getDayFromBkend - n) + '天後才出發？';
      this.disabledDays = posts.disabledDateList;

      posts.disabledDateList.forEach((item) => {
        this.disabledDays.push(item.date);
      });
      posts.disabledDateList.forEach((item) => {
        this.disabledReason.push(item.reason);
      });
      // console.log(posts.disabledDateList);

      console.log(posts);
      this.favCountry = posts['favCountry'];
      this.travelPeriodLimit = posts.productSetting['travelPeriodLimit'];
      this.toGetCountryList(this.countries);
    });
    this.changeCountries('');
  }

  toGetCusPkgPrice() {
    let cusData = {};
    cusData['packageId'] = this.defaultCustomerPkg['packageId'];
    cusData['days'] = this.diffDays;
    cusData['cusItemJson'] = this.cusItemJson;
    this.finalPrice = this.dataService.getCusPkPrice(cusData).subscribe((item)=>{
      this.finalPrice = item
    });
    console.log('toGetCusPkgPrice', this.cusItemJson);

  }

  tryGetFavor(favorCon:any){
    this.selectedCountriesId = favorCon['traceGroupId'];
    this.selectedCountry = favorCon['code'];
    this.selectedCountryStr = favorCon['name'];
    // if(this.resetBackCountry){
    // }else{
      this.selectedCountries = '';
      var nameStr;
      this.countries.forEach((el) => {
        if(el['groupId'] == favorCon['traceGroupId']){
          nameStr = el;
          this.selectedCountries = nameStr;
        }
      });
    // }


    this.isDoneSelectedPlaces = true;
    document.querySelector('#flagTwo').scrollIntoView();
  }

  changePurpose() {
    this.doneSelPurpose = false;
  }

  doNotNeedToShow: boolean = false;
  doNotNeed(number, val) {
    var returnArr = [];
    this.cusItemJson.forEach((item) => {
      if(item['itemCode'] == val){

      }else {
        returnArr.push(item);
      }
    })
    // $('#ele'+number+' .divAmtLong p').remove();
    // $('.amtBtnClickToShow'+number).remove();
    this.cusItemJson = returnArr;
    this.toGetCusPkgPrice();
    var idNum = $('#titlePkg .toShowContentAccordion').length;
    // console.log(idNum);
    // $('#specialWordDivDetail p').remove();
    // for(let i = 0; i <= idNum; i++){
    //   $('.amtBtnClickToShow'+i).slideUp();
    // }

    // this.selectedPackage['secondaryItems'].forEach((item)=>{
    //   console.log(item);
    // });

    // $('.amtBtnClickToShow'+number).slideUp('fast');
    // $('.needClassForWord'+number).slideUp('fast');
    // for(let i = 0; i <= idNum; i++){
    //   if ($('.amtBtnClickToShow'+i).is(':visible')) {
    //     console.log('true', i);
    //   } else {
    //     console.log('false', i);
    //   }
    // }
    if(!this.doNotNeedToShow){
      this.doNotNeedToShow = true;
      $('.noNeedClassForWord'+number).slideDown('fast');
      $('.amtBtnClickToShow'+number).slideUp('fast');
    }else{
      $('.amtBtnClickToShow'+number).slideUp('fast');
      $('.needClassForWord'+number).slideUp('fast');
      $('.noNeedClassForWord'+number).slideDown('fast');
    }
  }

  objectLength(obj) {
    var result = 0;
    for(var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        // or Object.prototype.hasOwnProperty.call(obj, prop)
        result++;
      }
    }
    return result;
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

  amountBtnClick(number, val, itemCode, dunNeedValue, valueItem) {
    console.log('number', number);
    console.log('val', val);
    console.log('itemCode', itemCode);
    console.log('dunNeedValue', dunNeedValue);
    console.log('valueItem', valueItem);
    console.log('select', this.thisSelect.nativeElement.value);
    if(dunNeedValue == 'dunNeed'){
     this.doNotNeed(number, itemCode);

    }else{
      this.amtBtnClickToShow = false;
      let cusAmtCode = dunNeedValue;
      // this.doNotNeedToShow = false;
      let cusData = {};
      cusData['packageId'] = this.selectedCustomePkg.packageId;
      cusData['days'] = this.diffDays;

      var cusPkObj = {};
      cusPkObj['companyCode'] = this.selectedCustomePkg['companyCode'];
      cusPkObj['itemCode'] = itemCode;
      if(window.innerWidth <= 480){
        cusPkObj['amountCode'] = dunNeedValue;
      }else{
        cusPkObj['amountCode'] = val['amountCode'];
      }

      this.cusItemJson.push(cusPkObj);
      this.cusItemJson.filter(item => item['itemCode'] == itemCode).map(
          (value) => {
            let index = this.cusItemJson.indexOf(value);
            var arry = this.cusItemJson;
            arry.splice(index, 1);
            console.log('array', arry);
            this.cusItemJson = arry;
            this.cusItemJson.push(cusPkObj);
          }
      );
      var uniqueItemJson = [];
      $.each(this.cusItemJson, function(i, el){
        if($.inArray(el, uniqueItemJson) === -1) uniqueItemJson.push(el);
      });
      this.cusItemJson = uniqueItemJson;
      if(dunNeedValue || window.innerWidth <= 480){
        this.selectedCustomePkg['secondaryItems'].filter(item => item['insItemCode'] == itemCode).map((value)=>{
          value['amountList'].forEach((item)=>{
            if(item['amountCode'] == dunNeedValue){
              val = item;
              if(val){
                var html = '';
                for(let i = 0; i < val['longDetailList'].length; i++){
                  html += '<p>';
                  html += val['longDetailList'][i].desc;
                  html += '</p>';
                }
                $('#ele'+number+' .divAmtLong p').remove();
                $('.amtBtnClickToShow'+number).remove();
                $('#ele'+number+' .divAmtLong').append(html);
              }
            }
          })
        })
      }

      this.toGetCusPkgPrice();
      if(val){
        var html = '';
        for(let i = 0; i < val['longDetailList'].length; i++){
          html += '<p>';
          html += val['longDetailList'][i].desc;
          html += '</p>';
        }
        $('#ele'+number+' .divAmtLong p').remove();
        $('.amtBtnClickToShow'+number).remove();
        $('#ele'+number+' .divAmtLong').append(html);
      }

      // if(!this.doNotNeedToShow){
      //   this.doNotNeedToShow = true;
      //   $('.noNeedClassForWord'+number).slideUp('fast');
      //   $('.amtBtnClickToShow'+number).slideDown('fast');
      // }else{
      //   $('.amtBtnClickToShow'+number).slideDown('fast');
      //
      // }
      if(!this.doNotNeedToShow){
        this.doNotNeedToShow = true;
        $('.noNeedClassForWord'+number).slideUp('fast');
        $('.amtBtnClickToShow'+number).slideDown('fast');
      }else{
        $('.amtBtnClickToShow'+number).slideDown('fast');
        $('.needClassForWord'+number).slideDown('fast');
        $('.noNeedClassForWord'+number).slideUp('fast');
      }
    }
  }

  toTogglePurposeBtn(clz, value) {
    // var body = $("html, body");
    // if(window.innerWidth <= 500){
    //   body.stop().animate({scrollTop:1105}, 200, 'swing', function() {
    //   });
    // }else{
    //   body.stop().animate({scrollTop:1265}, 200, 'swing', function() {
    //   });
    // }
    document.querySelector('#flagThree').scrollIntoView();
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
    if(window.innerWidth <= 500){
      setTimeout(function(){
        $('.toShowContentAccordion').slideUp('fast');
      }, 200);
    }
    // var body = $("html, body");
    // if(window.innerWidth <= 500){
    //   body.stop().animate({scrollTop:1450}, 200, 'swing', function() {
    //   });
    // }else{
    //   body.stop().animate({scrollTop:1620}, 200, 'swing', function() {
    //   });
    // }
    document.querySelector('#flagSix').scrollIntoView();

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
    // console.log(new Date(firstDay).getDay());
    // var oneDay = 24*60*60*1000;
    // var firstDate = new Date(this.getMonday(lastDay));
    // var seconDate = new Date(firstDay);
    // var diffDays = Math.round(Math.abs((firstDate.getTime() - seconDate.getTime())/(oneDay)));
    // if(diffDays == 6){
    //   diffDays++
    // }
    var diffDays = new Date(firstDay).getDay();
    let returnArr = [];
    for(let i = 1; i <= diffDays; i++){
      returnArr.push(i);
    }
    return returnArr;
  }

  theDaysMissed: number;
  theTimeClicked: number = 2;
  toShowMoreDaysFun() {
    this.theTimeClicked++;
    if(this.theTimeClicked == this.totalTimesTimes){
      this.getDayFromBkend = this.travelPeriodLimit;
      this.selectTravelDayIsDone = false;
      this.toShowMoreDays = false;
      this.textOfOverDays = '出國超過' + this.travelPeriodLimit + '天？';
    }else{
      let testDayAddOneMonth = new Date(new Date(this.testDay).getFullYear(), new Date(this.testDay).getMonth()+this.theTimeClicked, 0);
      let day = 1000*60*60*24;
      var diffDays2 = Math.round(Math.abs((new Date(this.testDay).getTime() - new Date(testDayAddOneMonth).getTime())/(day)));
      if(this.theTimeClicked == 5){
          this.getDayFromBkend = this.travelPeriodLimit;
      }else{
        this.getDayFromBkend = diffDays2;
      }
    }
    // if(this.getDayFromBkend == this.travelPeriodLimit){

    // } else {
    //   this.getDayFromBkend = this.getDayFromBkend + (this.travelPeriodLimit/5);
    // }
  }

  toModifiedDays() {
    this.tableShowHidden = false;
    this.selectTravelDayIsDone = false;
    this.modifiedClicked = true;
    this.testDay = new Date();
    this.firstMon = this.getMonday(new Date(this.testDay));
    this.startTravelDay = '';
    this.endTravelDay = '';
    this.theTimeClicked = 2;
    // this.toShowMoreDays = !this.toShowMoreDays;
    this.getDayFromBkend = this.startDayLimit;
    this.textOfOverDays = '出國超過' + this.getDayFromBkend + '天？';

    // let countWeek = function(){
    //   var date = new Date(),
    //       prefixes = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];
    //   return prefixes[0 | date.getDate() / 8];
    // }
    // if(countWeek() == 'First') {
    //   this.startTravelDayOn = true;
    // }
    // var body = $("html, body");
    // if(window.innerWidth <= 500){
    //   body.stop().animate({scrollTop:1105}, 200, 'swing', function() {
    //   });
    // }else{
    //   body.stop().animate({scrollTop:1265}, 200, 'swing', function() {
    //   });
    // }
    document.querySelector('#flagFour').scrollIntoView();
  }

  totalTimesTimes:number;
  onClickMe($event, classValueBtn, numberBtn) {
    if(this.selectTravelDayIsDone === false && !this.startTravelDay){
        this.textOfSelectingDays = '請點選旅程出發日與返回日';
        this.startTravelDay = $event.target.value;
        // this.testDay = this.startTravelDay;
        let testDayAddOneMonth = new Date(new Date(this.testDay).getFullYear(), new Date(this.testDay).getMonth()+2, 0);
        let day = 1000*60*60*24;
        // if(this.modifiedClicked){
        //   var diffDays = Math.round(Math.abs((new Date(this.testDay).getTime() - new Date(testDayAddOneMonth).getTime())/(day)));
        //   this.getDayFromBkend = diffDays;
        // }

        // this.firstMon = this.getMonday(new Date(this.startTravelDay));
        this.totalTimesTimes = Math.round(this.travelPeriodLimit/30);
        // this.getDayFromBkend = diffDays;
        this.selectTravelDayIsDone = true;
        this.toShowMoreDays = true;
        var STD = this.startTravelDay;
        setTimeout(function(){
          $('.table button').each(function() {
            if($(this).val() == STD){
              $(this).find('.checkBtn').removeClass('hidden');
              $(this).find('.checkBtnTxt').removeClass('hidden');
            }
          });
        }, 300);
          let sendDataBak = {};
          sendDataBak['product'] = 'Travel';
          sendDataBak['startDate'] = this.startTravelDay;
          this.dataService.ifOnlyStartDayOnly(sendDataBak).subscribe((item) => {
            console.log(item);
            this.cusPackageList = item['cusPackageList'];
            this.packageList = item['packageList'];
            item.cusPackageList.filter(val => val.isDefaultPackage == true).map(
                value => this.defaultCustomerPkg = value
            );

            item.packageList.filter(val => val && val.isDefaultPackage).map(value =>
                this.selectedPackage = value
            );

            this.selectedPackageName = this.selectedPackage['packageName'];
            this.secondaryItems = this.selectedPackage['secondaryItems'];
            this.pkgPrimary = this.selectedPackage['primaryItems'];
            this.featureDesc = this.selectedPackage['featureDesc'];
            this.toGetLogo(this.selectedPackage['companyCode']);
            this.fireInTheHole(this.selectedPackage['packageId'] - 1);
            this.tableList = this.selectedPackage['table'];
            console.log('table', this.tableList);

            this.cusPackageList = item.cusPackageList;
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
          });
        document.querySelector('#flagFour').scrollIntoView();
      } else {
        if(this.startTravelDay){
          if(this.startTravelDay == $event.target.value){
            var modal = document.getElementById('myModal');
            modal.style.display = "block";
            this.dataService.AlertTXT = [];
            this.dataService.AlertTXT.push('返回日不可與出發日同一天');
            document.querySelector('#flagFour').scrollIntoView();
            return false;
          } else {

            document.querySelector('#flagFive').scrollIntoView();
            this.textOfSelectingDays = '您的旅遊期間';
            this.tableShowHidden = true;
            this.endTravelDay = $event.target.value;
            let oneDay = 24*60*60*1000;
            let firstDate = new Date(this.startTravelDay);
            let secondDate = new Date(this.endTravelDay);
            console.log(firstDate);
            console.log(secondDate);
            let diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay))) + 1;

            if(isNaN(this.diffDays)){
              this.diffDays = 0;
            }else{
              this.diffDays = diffDays;
            }
            if(this.pkgCustomGo == false){
              this.getPriceServiceData();
            } else {
              this.toGetCusPkgPrice();
            }
          }
        }
      }
  }

  fireInTheHole(val) {
    $('#remove'+ val).removeClass('hidden');
  }

  toggleClazForAngle: boolean = false;
  toShowCusDetailContent(text) {
    if(text){
      this.toggleClazForAngle = !this.toggleClazForAngle;
      $('#mainLongDetailDiv').slideToggle('fast');
    }
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

    var idNum = $('#titlePkg .toShowContentAccordion').length;
    for(let x = 0; x <= idNum; x++) {
      $('#ele'+x).slideUp('fast');
    }
    $('#mainLongDetailDiv').slideToggle('fast');
  }

  toGetCustomPackageContent(val) {

    console.log(JSON.stringify(val));
    $('#mainLongDetailDiv').slideUp('fast');
    this.defaultCustomerPkg = val;
    if(val.length == 1){
      this.cusPackageList.forEach((item)=>{
        if(item['packageId'] == val){
          this.defaultCustomerPkg = item;
          this.selectedCustomePkg = item;
          this.cusItemJson = [];
          console.log('secondaryItems', this.defaultCustomerPkg['secondaryItems'])
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
      });
    }else{
      this.cusItemJson = [];
      console.log('secondaryItems', this.defaultCustomerPkg['secondaryItems'])
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
    if(window.innerWidth <= 500){
      setTimeout(function(){
        $('.toShowContentAccordion').slideUp('fast');
      }, 200);
    }
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

  clickWannaInsuredBtn(value) {
    document.querySelector('#flagOne').scrollIntoView();
  }

  toCloseAll(val) {
    for(let i = 0; i <= $('#paddingSpe i').length; i ++) {
      if($('#paddingSpe i')[i]){
        if($('#paddingSpe i')[i]['className'] == 'fa fa-angle-up'){
          $('#paddingSpe i')[i]['className'] = 'fa fa-angle-down';
        }
      }
    }

    $('#ele'+val).slideUp('fast');

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
    var idNum = $('#titlePkg .toShowContentAccordion').length;

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

  returnMonth(monDay) {
    // let day = new Date(monDay).getDate();
    let month = new Date(monDay).getMonth()+1;
    // let lastSun = this.getLastSunday(new Date(monDay));
    // console.log(day);
    // console.log(lastSun);
    if(new Date(monDay) >= new Date(this.testDay)){
      return month;
    }else if(new Date(monDay) < new Date(this.testDay)){
      return new Date(this.testDay).getMonth()+1;
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
      this.tableList = this.selectedPackage['table'];
      let dataBak = {};
      dataBak['packageId'] = this.selectedPackage['packageId'];
      dataBak['days'] = this.diffDays;

      this.dataService.getPkPrice(dataBak).subscribe((item) => {
        this.finalPrice = item;
      });
      this.featureDesc = this.selectedPackage['featureDesc'];
      for (var i = 0; i <= this.pkgPrimary.length; i++){
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
    var b = this.selectedCountry;
    var a;
    this.selectedCountries.countryList.forEach(function(el){
      if(el.code ==  b) {
       a = el.name;
      }
    })
    this.selectedCountryStr = a;
    document.querySelector('#flagTwo').scrollIntoView();

    // var body = $("html, body");
    // if(window.innerWidth <= 500){
    // }else{
      // body.stop().animate({scrollTop:930}, 200, 'swing', function() {
      // });
    // }
  }

  isLastDay(dt) {
  var test = new Date(dt.getTime()),
      month = test.getMonth();

  test.setDate(test.getDate() + 1);
  return test.getMonth() !== month;
}

  modifiedPlaces() {
    this.isDoneSelectedPlaces = false;
  }

  changeCountries(item) {
    if(this.resetBackCountry){
      for(let i = 0; i <= this.countries.length; i ++){
        if (this.countries[i]['groupId'] == this.selectedCountriesId) {
          this.selectedCountries = this.countries[i];
          console.log(this.selectedCountries);
        }
      }
      this.resetBackCountry = '';
    }else{
      this.selectedCountries = '';
      for(let i = 0; i <= this.countries.length; i ++){
        if (this.countries[i]['groupId'] == this.selectedCountriesId) {
          this.selectedCountries = this.countries[i];
        }
      }
    }
  }

  whichWeek(){
    var date = new Date(this.startTravelDay),
        prefixes = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];
    return prefixes[0 | date.getDate() / 8];
  }

  // getSunday(sun) {
  //   sun = new Date(sun);
  //   let day = sun.getDay(),
  //     diff = sun.getDate() - day + (day == 0 ? -6:0); // adjust when day is sunday
  // return new Date(sun.setDate(diff));
  // }

  lastDay:any;
  todayWhichWeek(monthDayCheck){
    var date = new Date(monthDayCheck);
    var day = date.getDate();
    day-=(date.getDay()==0?6:date.getDay()-1);//get monday of this week
    //special case handling for 0 (sunday)

    day+=7;
    //for the first non full week the value was negative

    var prefixes = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];
    return prefixes[0 | (day) / 7];
  }

  getRemanningDays() {
  var date = new Date(this.testDay);
  var time = new Date(date.getTime());
  time.setMonth(date.getMonth() + 1);
  time.setDate(0);
  var days =time.getDate() > date.getDate() ? time.getDate() - date.getDate() : 0;
  return days;
  }

  checkLastDayOfMonth() {
    let day = new Date(this.testDay).getDate();
    let numberDay = new Date(this.testDay).getDay();
    if((new Date(2017, 11, 0).getDate()) <= day || (day <= 7 && numberDay != 0)){
      return false;
    }else{
      return true;
    }
  }

  toHiddenDate(value){
    if(this.startTravelDay){
       var oneDay = 24*60*60*1000;
       var nextMonthLastDay = new Date(new Date(this.startTravelDay).getFullYear(), new Date(this.startTravelDay).getMonth() + this.theTimeClicked, 0);

       var startDayPlusLastDayNum = new Date(this.startTravelDay).setDate(new Date(this.startTravelDay).getDate() + this.travelPeriodLimit);

       if(this.theTimeClicked == this.totalTimesTimes){
         startDayPlusLastDayNum = new Date(this.startTravelDay).setDate(new Date(this.startTravelDay).getDate() + this.travelPeriodLimit);
       }else{
         var getDayBetween =  Math.round(Math.abs((new Date(nextMonthLastDay).getTime() - new Date(this.startTravelDay).getTime())/(oneDay)));
         startDayPlusLastDayNum = new Date(this.startTravelDay).setDate(new Date(this.startTravelDay).getDate() + getDayBetween);
         var getDayBtnDays = new Date(nextMonthLastDay).setDate(new Date(nextMonthLastDay).getDate()+1);
       }

      var toGetLastWeekend = function(){
        var lastDayNeedToHide
        switch (new Date(startDayPlusLastDayNum).getDay()){
          case 0:
            lastDayNeedToHide = 6;
            break;
          case 1:
            lastDayNeedToHide = 5;
            break;
          case 2:
            lastDayNeedToHide = 4;
            break;
          case 3:
            lastDayNeedToHide = 3;
            break;
          case 4:
            lastDayNeedToHide = 2;
            break;
          case 5:
            lastDayNeedToHide = 1;
            break;
          case 6:
            lastDayNeedToHide = 0;
            break;
          default:
        }
      return lastDayNeedToHide
      }

      var getSunDayOfTheWeek = new Date(startDayPlusLastDayNum).setDate(new Date(startDayPlusLastDayNum).getDate() + toGetLastWeekend());
      var theDayOfStartDaySun = new Date(this.startTravelDay).setDate(new Date(this.startTravelDay).getDate() - new Date(this.startTravelDay).getDay());
      if(new Date(value) > new Date(getSunDayOfTheWeek) || new Date(value) < new Date(theDayOfStartDaySun) || (new Date(value) > new Date(getDayBtnDays))){
        return true;
      }else{
        return false;
      }
    }else{
      var yesterday = new Date(this.testDay).setDate(new Date(this.getMonday(this.testDay)).getDate()-1);
      var lastPlustStartDayLimited = new Date(this.testDay).setDate(new Date(this.testDay).getDate() + this.startDayLimit);
      var lastDayNeedToHide;
      switch (new Date(lastPlustStartDayLimited).getDay()){
        case 0:
          lastDayNeedToHide = new Date(lastPlustStartDayLimited).setDate(new Date(lastPlustStartDayLimited).getDate() + 6);
          break;
        case 1:
          lastDayNeedToHide = new Date(lastPlustStartDayLimited).setDate(new Date(lastPlustStartDayLimited).getDate() + 5);
          break;
        case 2:
          lastDayNeedToHide = new Date(lastPlustStartDayLimited).setDate(new Date(lastPlustStartDayLimited).getDate() + 4);
          break;
        case 3:
          lastDayNeedToHide = new Date(lastPlustStartDayLimited).setDate(new Date(lastPlustStartDayLimited).getDate() + 3);
          break;
        case 4:
          lastDayNeedToHide = new Date(lastPlustStartDayLimited).setDate(new Date(lastPlustStartDayLimited).getDate() + 2);
          break;
        case 5:
          lastDayNeedToHide = new Date(lastPlustStartDayLimited).setDate(new Date(lastPlustStartDayLimited).getDate() + 1);
          break;
        case 6:
          lastDayNeedToHide = new Date(lastPlustStartDayLimited).setDate(new Date(lastPlustStartDayLimited).getDate() + 0);
          break;
        default:
      }

     if(new Date(this.testDay).getDate() == 1){
       if(new Date(value) < new Date(this.testDay)){
         return true;
       }else if (new Date(value) > new Date(lastDayNeedToHide)){
         return true;
       }
     }else if (new Date(value) > new Date(lastDayNeedToHide)){
      return true;
     }else if(new Date(value) < new Date(yesterday)){
        return true;
     }else{
        if(new Date(this.testDay).getDay() == 6){
          let tmr = new Date(new Date(this.testDay).setDate(new Date(this.testDay).getDate()+1));
          if(new Date(value) <= new Date(tmr)){
            return true;
          }else{
            return false;
          }
        }
      }
    }




    // let date = new Date(this.testDay);
    // if(this.startTravelDay){
    //   if(!this.modifiedClicked){
    //     this.getDayFromBkend = this.travelPeriodLimit + this.disabledDays.length/2;
    //   }
    //   let theDaylimited = new Date(new Date(this.testDay).setDate(date.getDate() + this.getDayFromBkend));
    //   let theLimitedLastDay = new Date(theDaylimited.setDate(theDaylimited.getDate() + (7 - theDaylimited.getDay()) % 7));
    //
    //   if(new Date(this.testDay).getDay() == 6 ){
    //     let dt = new Date(new Date(this.firstMon).setDate(new Date(this.firstMon).getDate() + 7));
    //     if(new Date(value) <= dt){
    //       return true
    //     }
    //   }
    //   if(new Date(value) >= new Date(theLimitedLastDay)){
    //     return true
    //   }
    //   if(this.modifiedClicked){
    //     let theDaylimited = new Date(new Date(this.testDay).setDate(new Date(this.testDay).getDate()+1 + this.travelPeriodLimit));
    //     let d = theDaylimited;
    //     let theDayLimited2 = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay() + 7);
    //     if(new Date(value) >= new Date(theDayLimited2) || new Date(value) == new Date(theLimitedLastDay) || new Date(value) < new Date(this.getMonday(this.startTravelDay))){
    //       return true;
    //     }
    //     // console.log('1',theDayLimited2);
    //     // console.log('2',theDaylimited);
    //     // console.log('3', theLimitedLastDay);
    //     // console.log('4', theDaylimited);
    //   }else{
    //     if(new Date(value) < new Date(this.firstMon) || new Date(value) < new Date(this.getMonday(this.startTravelDay))){
    //       return true;
    //     }else{
    //       return false;
    //     }
    //   }
    // }else{
    //   this.getDayFromBkend = this.startDayLimit + this.disabledDays.length/2 -1;
    //   if(this.modifiedClicked){
    //     this.testDay = new Date();
    //     this.firstMon = this.getMonday(new Date(this.testDay));
    //     date = new Date(this.testDay);
    //     var theDaylimited = new Date(new Date(this.testDay).setDate(date.getDate() + this.getDayFromBkend));
    //     if(this.disabledDays.length >= 0){
    //       var theLimitedLastDay = new Date(theDaylimited.setDate(theDaylimited.getDate()-1 + (21 - theDaylimited.getDay()) % 14));
    //     }else{
    //       var theLimitedLastDay = new Date(theDaylimited.setDate(theDaylimited.getDate()-1 + (7 - theDaylimited.getDay()) % 7));
    //     }
    //     if(new Date(this.testDay).getDay() == 6 ){
    //       let dt = new Date(new Date(this.firstMon).setDate(new Date(this.firstMon).getDate() + 7));
    //       if(new Date(value) <= dt){
    //         return true
    //       }
    //     }
    //     if(new Date(value) >= new Date(theLimitedLastDay) || new Date(value) <= new Date(this.firstMon)){
    //       return true
    //     }
    //     if(this.modifiedClicked){
    //       let theDaylimited = new Date(new Date(this.testDay).setDate(new Date(this.testDay).getDate()+1 + this.travelPeriodLimit));
    //       if(new Date(value) > new Date(theDaylimited)){
    //         return true;
    //       }
    //     }
    //   }else{
    //     var tmr = new Date(this.testDay).setDate(new Date(this.testDay).getDate() + 1);
    //     // this.getDayFromBkend = this.startDayLimit + this.disabledDays.length/2 -1;
    //     var dayDate = date.getDate();
    //     var lastDay = this.isLastDay(new Date(this.testDay));
    //     // this.lastDay = (new Date(2017, 11, 0).getDate()+1);
    //     this.getRemanningDays();
    //     // var yes = date.setDate(date.getDate() - 1);
    //     // var throwingMon = this.firstMon;
    //     // var todayWeekDay = new Date(this.testDay).getDay();
    //     var theDaylimited = new Date(new Date(this.testDay).setDate(date.getDate() + this.getDayFromBkend));
    //     if(this.disabledDays.length >= 0){
    //       var theLimitedLastDay = new Date(theDaylimited.setDate(theDaylimited.getDate() + (21 - theDaylimited.getDay()) % 14));
    //     }else{
    //       var theLimitedLastDay = new Date(theDaylimited.setDate(theDaylimited.getDate() + (7 - theDaylimited.getDay()) % 7));
    //     }
    //     if(new Date(this.testDay).getDay() == 6 ){
    //       let dt = new Date(new Date(this.firstMon).setDate(new Date(this.firstMon).getDate() + 7));
    //       if(new Date(value) <= dt){
    //         return true
    //       }
    //     }
    //     if(new Date(value) >= new Date(theLimitedLastDay)){
    //       return true
    //     }
    //   }
    //
    //   // var tmr = new Date(this.testDay).setDate(new Date(this.testDay).getDate() + 1);
    //   // this.getDayFromBkend = this.startDayLimit;
    //   // var dayDate = date.getDate();
    //   // var lastDay = this.isLastDay(new Date(this.testDay));
    //   // // this.lastDay = (new Date(2017, 11, 0).getDate()+1);
    //   // this.getRemanningDays();
    //   // // var yes = date.setDate(date.getDate() - 1);
    //   // // var throwingMon = this.firstMon;
    //   // // var todayWeekDay = new Date(this.testDay).getDay();
    //   // let theDaylimited = new Date(new Date(this.testDay).setDate(date.getDate() + this.getDayFromBkend));
    //   // let theLimitedLastDay = new Date(theDaylimited.setDate(theDaylimited.getDate() + (7 - theDaylimited.getDay()) % 7));
    //
    //
    //
    //   // if(new Date(this.testDay).getDay() == 6){
    //   //  if (new Date(value) <= new Date(tmr)) {
    //   //    return true;
    //   //  }
    //   // }else if(new Date(this.testDay).getDay() == 0){
    //   //   if (new Date(value) < new Date(this.testDay)) {
    //   //     return true;
    //   //   }
    //   // }else if(this.checkLastDayOfMonth()){
    //   //   if (new Date(value) <= new Date(this.getMonday(this.testDay))) {
    //   //     return true;
    //   //   }
    //   // }
    //
    //   // if(dayDate == 1 || lastDay){
    //   //   if(todayWeekDay == 0 || todayWeekDay == 6){
    //   //     this.startTravelDayOn = false;
    //   //     if((new Date(value) < new Date(tmr))){
    //   //       return true;
    //   //     }
    //   //   }else{
    //   //     if(new Date(value) <= new Date(tmr)){
    //   //       this.startTravelDayOn = false;
    //   //       return true;
    //   //     }
    //   //   }
    //   // }else{
    //   //   if(todayWeekDay <= 6){
    //   //     if(new Date(this.testDay).getDay() == 6){
    //   //       if (new Date(value) <= new Date(tmr)) {
    //   //         return true;
    //   //       }
    //   //     }else if(new Date(this.testDay).getDay() == 0){
    //   //       if (new Date(value) < new Date(this.testDay)) {
    //   //         return true;
    //   //       }
    //   //     }
    //   //   } else if (new Date(value) < new Date(tmr)) {
    //   //     return true;
    //   //   }
    //   // }
    //
    // }
  }

  getLastSunday(d){
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    var lastsunday = d.getDate() - (d.getDay());
    return lastsunday
  }

  checkShoudShowTitle(val){
    if(this.startTravelDay){
      var oneDay = 24*60*60*1000;
      var behindStartTravelDayHide = new Date(this.startTravelDay).setDate(new Date(this.startTravelDay).getDate()-1 - new Date(this.startTravelDay).getDay());
      var nextMonthLastDay = new Date(new Date(this.startTravelDay).getFullYear(), new Date(this.startTravelDay).getMonth() + this.theTimeClicked, 0);
      var sunday = new Date(this.startTravelDay).setDate(new Date(this.startTravelDay).getDate() - new Date(this.startTravelDay).getDay());
      var sundayMinusOneDay = new Date(sunday).setDate(new Date(sunday).getDate() - 1);
      var getStartDayLastDay;
      if(this.theTimeClicked == this.totalTimesTimes){
        getStartDayLastDay = new Date(this.startTravelDay).setDate(new Date(this.startTravelDay).getDate() + this.travelPeriodLimit);
      }else{
        var getDayBetween =  Math.round(Math.abs((new Date(nextMonthLastDay).getTime() - new Date(this.startTravelDay).getTime())/(oneDay)));
        getStartDayLastDay = new Date(this.startTravelDay).setDate(new Date(this.startTravelDay).getDate() + getDayBetween);
      }
      if((new Date(val).getDate() == 1) || (new Date(val) <= new Date(sunday)) && new Date(val).getDay() == 0 && new Date(val) > new Date(sundayMinusOneDay)){
        if(new Date(val) > new Date(getStartDayLastDay) || new Date(val) < new Date(behindStartTravelDayHide)){
          return false;
        }else{
          return true;
        }
      }else{
        return false;
      }
    }else{
      var tmr = new Date(this.testDay).setDate(new Date(this.testDay).getDate() + 1);
      var lastDayNoStartDay = new Date(this.testDay).setDate(new Date(this.testDay).getDate() + this.startDayLimit - 1);
      if((new Date(val).getDate() == 1 || (new Date(val).getDay() == 0 && new Date(val) < new Date(tmr)))){
        if(new Date(this.testDay).getDate() == 1){
          if(new Date(val) < new Date(this.testDay.setDate(new Date(this.testDay).getDate() - new Date(this.testDay).getDay()))){
            return true;
          }
        }else if(new Date(val) > new Date(lastDayNoStartDay)){
          return false;
        }else{
          return true;
        }
      }else{
        false;
      }
    }

    // let theDaylimited = new Date(new Date(this.testDay).setDate(new Date(this.testDay).getDate() + this.getDayFromBkend));
    // let theLimitedLastDay = new Date(theDaylimited.getFullYear(), theDaylimited.getMonth()+1, 0);
    // let lastMinsWeek = new Date(theLimitedLastDay).setDate(new Date(theLimitedLastDay).getDate() - 7);
    // let d = theDaylimited;
    // let theDayLimited2 = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay() + 7);
    // if ((new Date(val).getDate() == 1) && new Date(val) < new Date(theDayLimited2) || (new Date(val).getDay() == 0 && new Date(val) < new Date(tmr)) && new Date(val) < new Date(theDayLimited2)){
    //   if(this.startTravelDay){
    //     let dt = new Date(this.startTravelDay).getDay();
    //     let startDaySunday = new Date(this.startTravelDay).setDate(new Date(this.startTravelDay).getDate() - dt);
    //     if(new Date(val) <= new Date(startDaySunday) || (new Date(val).getDate() == 1) && new Date(val) < new Date(theDayLimited2) || (new Date(val).getDay() == 0 && new Date(val) < new Date(tmr)) && new Date(val) < new Date(theDayLimited2)){
    //       if((new Date(val).getDate() == 1) && new Date(val) >= new Date(lastMinsWeek) && new Date(val) < new Date(theDayLimited2)){
    //         return false;
    //       }else{
    //         return true;
    //       }
    //     }
    //   }else{
    //     return true;
    //   }
    // }

    // if(this.modifiedClicked){
    //
    //   if(this.startTravelDay && this.modifiedClicked){
    //
    //     // let theDaylimited = new Date(new Date(this.testDay).setDate(new Date(this.testDay).getDate() + this.travelPeriodLimit));
    //     // let d = theDaylimited;
    //     // let theDayLimited2 = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay() + 7);
    //     // if(new Date(val) == new Date(new Date(this.startTravelDay).setDate(new Date(this.startTravelDay).getDate() - 1)) && new Date(val) < new Date(theDayLimited2)){
    //     //   return true;
    //     // }
    //     // console.log(new Date(new Date(theDaySelected).setDate(new Date(theDaySelected).getDate() + 2)));
    //
    //   }
    //
    //   let theDaylimited = new Date(new Date(this.testDay).setDate(new Date(this.testDay).getDate() + this.travelPeriodLimit));
    //   let d = theDaylimited;
    //   let theDayLimited2 = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay() + 7);
    //   if(new Date(val) > new Date(theDayLimited2)){
    //     // return false;
    //   }
    // }
    // if(new Date(val) >= new Date(theLimitedLastDay)){
    //   // return false;
    // } else if(new Date(val).getDay() == 0 && new Date(val) < new Date(tmr)){
    //   // if(this.startTravelDay){
    //   //   let startpa= new Date(this.startTravelDay).setDate(new Date(this.startTravelDay).getDate() - 14);
    //   //   // let startfu= new Date(this.startTravelDay).setDate(new Date(this.startTravelDay).getDate() + 7);
    //   //   var theDaySelected = new Date(this.getMonday(new Date(this.startTravelDay)));
    //   //   if(new Date(val) < new Date(startpa)){
    //   //     // return false;
    //   //   }else if(new Date(val) >= new Date(startpa)){
    //   //     return true;
    //   //   }
    //   // }else{
    //   //   return true;
    //   // }
    // }else if (new Date(val).getDate() == 1){
    //   if(new Date(val) > new Date(tmr)){
    //     // if(this.startTravelDay){
    //     //   let startpa= new Date(this.startTravelDay).setDate(new Date(this.startTravelDay).getDate() - 7);
    //     //   // let startfu= new Date(this.startTravelDay).setDate(new Date(this.startTravelDay).getDate() + 7);
    //     //
    //     //   if(new Date(val) < new Date(startpa)){
    //     //     // return false;
    //     //   }else if(new Date(val) >= new Date(startpa)){
    //     //     return true;
    //     //   }
    //     // }else{
    //     //   return true;
    //     // }
    //   }else if (new Date(val) < new Date(tmr)){
    //     if(new Date(val).getDay() == 0){
    //       if(this.startTravelDay){
    //         let startpa= new Date(this.startTravelDay).setDate(new Date(this.startTravelDay).getDate() - 7);
    //         let startfu= new Date(this.startTravelDay).setDate(new Date(this.startTravelDay).getDate() + 7);
    //
    //         if(new Date(val) < new Date(startpa)){
    //           // return false;
    //         }else if(new Date(val) > new Date(startpa)){
    //           return true;
    //         }
    //       }else{
    //         return true;
    //       }
    //     }else{
    //       // return false;
    //     }
    //   }
    // }else{
    //   // return false;
    // }
  }

  buttonToDisabled(calVal) {
    var startDaysDisabled = new Date(this.startTravelDay);
    var buttonDate = new Date(calVal);
    var todayPlusStartDayLimitAndDisaster = new Date(this.testDay).setDate(new Date(this.testDay).getDate() + this.startDayLimit + 1);
    var startDayPlusLimitedDay = new Date(this.startTravelDay).setDate(new Date(this.startTravelDay).getDate() + this.travelPeriodLimit - 1);

    if(this.startTravelDay){
      if(
          buttonDate < startDaysDisabled ||
          buttonDate > new Date(startDayPlusLimitedDay)
      ){
        return true;
      } else {
        return false;
      }
    }else{
      var theBeginingDay = new Date(this.testDay).setDate(new Date(this.testDay).getDate() + (this.ifTheStartIsPlusOneMoreDay - 1));
      if(
          buttonDate < new Date(theBeginingDay) ||
          buttonDate >= new Date(todayPlusStartDayLimitAndDisaster) ||
          buttonDate < new Date(this.testDay)
      ){
        return true;
      } else {
        return false;
      }
    }





    // let today = new Date(this.testDay);
    // let date = new Date(this.testDay);
    // let tmr = date.setDate(today.getDate() + 1);
    // var dayDate = date.getDate();
    // var theDaylimited;
    //
    // if(this.modifiedClicked){
    //   this.testDay = new Date();
    //   this.firstMon = this.getMonday(new Date(this.testDay));
    // }
    //
    // if(this.startTravelDay){
    //   theDaylimited = new Date(new Date(this.testDay).setDate(new Date(this.testDay).getDate() + this.travelPeriodLimit));
    // }else{
    //   theDaylimited = new Date(new Date(this.testDay).setDate(new Date(this.testDay).getDate() + this.getDayFromBkend));
    // }
    //
    // if(!this.startTravelDay){
    //   let dayLimitedBegining = new Date(theDaylimited).setDate(new Date(theDaylimited).getDate() + 1);
    //   if(new Date(calVal) > new Date(dayLimitedBegining) || new Date(calVal) <= new Date(this.testDay)){
    //     return true;
    //   }
    // }
    //
    // if(this.startTravelDay){
    //   if(this.modifiedClicked){
    //     theDaylimited = new Date(new Date(this.testDay).setDate(new Date(this.testDay).getDate()+1 + this.travelPeriodLimit));
    //     if(new Date(calVal) > new Date(theDaylimited)){
    //       return true;
    //     }
    //   }else{
    //     if(new Date(calVal) >= new Date(theDaylimited)){
    //       return true;
    //     }
    //   }
    // }
    //
    // if(dayDate == 1){
    //   if(new Date(calVal) <= new Date(this.testDay)){
    //     return true;
    //   }else{
    //     return false;
    //   }
    // }
    // var lastDay = this.isLastDay(today);
    //
    //  if(lastDay){
    //    this.startTravelDayOn = true;
    //  }

    // if(this.startTravelDay){
    //   let monday = this.getMonday(this.startTravelDay);
    //   var oneDay = 24*60*60*1000;
    //   var diffDays = Math.round(Math.abs((monday.getTime() - startDaysDisabled.getTime())/(oneDay)));
    //   this.theDaysMissed = diffDays;
    // }
    //

  }

  buttonToDisabledTwo(btnVal){
    let buttonDate = new Date(btnVal);
    for(var i = 0; i <= this.disabledDays.length; i++) {
      if (buttonDate.getTime() == new Date(this.disabledDays[i]).getTime() && new Date(this.disabledDays[i]).getTime() > new Date(this.testDay).getTime()) {
        return true;
      }
    }
  }

  checkShoGoNot(){
    if(window.innerWidth <= 500){
      return true;
    }else{
      return false;
    }
  }

  windowSizeCheck(){
    if(window.innerWidth <= 500){
      return true;
    }else{
      return false;
    }
  }

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
    if(!this.selectedCountry){
      var modal = document.getElementById('myModal');
      modal.style.display = "block";
      this.dataService.AlertTXT = [];
      this.dataService.AlertTXT.push('請選擇國家');
      document.querySelector('#flagOne').scrollIntoView();
      // var body = $("html, body");
      // if(window.innerWidth <= 500){
      //   body.stop().animate({scrollTop:320}, 200, 'swing', function() {
      //   });
      // }else{
      //   body.stop().animate({scrollTop:490}, 200, 'swing', function() {
      //   });
      // }
      return false;
    } else if(!this.purposeGo){
      var modal = document.getElementById('myModal');
      modal.style.display = "block";
      this.dataService.AlertTXT = [];
      this.dataService.AlertTXT.push('目的');
      document.querySelector('#flagTwo').scrollIntoView();
      // var body = $("html, body");
      // if(window.innerWidth <= 500){
      //   body.stop().animate({scrollTop:390}, 200, 'swing', function() {
      //   });
      // }else{
      //   body.stop().animate({scrollTop:660}, 200, 'swing', function() {
      //   });
      // }
      return false;
    } else if(!this.transportation){

    }else if(!this.startTravelDay){
      var modal = document.getElementById('myModal');
      modal.style.display = "block";
      this.dataService.AlertTXT = [];
      this.dataService.AlertTXT.push('請選擇出發日期');
      document.querySelector('#flagFour').scrollIntoView();
      // var body = $("html, body");
      // if(window.innerWidth <= 500){
      //   body.stop().animate({scrollTop:1210}, 200, 'swing', function() {
      //   });
      // }else{
      //   body.stop().animate({scrollTop:1225}, 200, 'swing', function() {
      //   });
      // }
    } else if(!this.endTravelDay){
      var modal = document.getElementById('myModal');
      modal.style.display = "block";
      this.dataService.AlertTXT = [];
      this.dataService.AlertTXT.push('請選擇回國日期');
      document.querySelector('#flagFour').scrollIntoView();
      // var body = $("html, body");
      // if(window.innerWidth <= 500){
      //   body.stop().animate({scrollTop:1210}, 200, 'swing', function() {
      //   });
      // }else{
      //   body.stop().animate({scrollTop:1225}, 200, 'swing', function() {
      //   });
      // }
    }

    if(this.selectedCountry &&
       this.purposeGo &&
       this.transportation &&
       this.startTravelDay &&
       this.endTravelDay
    )
    {
      let dataToSendBack = {};
      dataToSendBack['orderNumber'] = '';
      dataToSendBack['countryCode'] = this.selectedCountry;
      dataToSendBack['cityId'] = 0;
      dataToSendBack['purpose'] = this.purposeGo;
      dataToSendBack['transport'] = this.transportation;
      dataToSendBack['startDate'] = this.startTravelDay;
      dataToSendBack['endDate'] = this.endTravelDay;

      dataToSendBack['packageId'] = this.selectedPackage['packageId'];

      var uniqueItemJson = [];
      $.each(this.cusItemJson, function(i, el){
        if($.inArray(el, uniqueItemJson) === -1) uniqueItemJson.push(el);
      });
      dataToSendBack['trackingId'] = '';
      dataToSendBack['cusItemList'] = uniqueItemJson;
      if(this.pkgCustomGo){
        dataToSendBack['packageId'] = 0;
        dataToSendBack['cusPackageId'] = this.defaultCustomerPkg['packageId'];
      }else{
        dataToSendBack['cusPackageId'] = 0;
        dataToSendBack['packageId'] = this.selectedPackage['packageId'];
      }
      console.log(dataToSendBack);
      this.dataService.toSendInsuredDataToBakHomePage(dataToSendBack);
    }
  }
}
