import {
  Component, AfterViewInit, ComponentFactoryResolver, ViewContainerRef, OnInit, ViewChild,
  ElementRef } from '@angular/core';
import { DataServiceService } from '../../services/data-service.service';
import { ShareService } from '../../services/share.service';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-member-create',
  templateUrl: './member-create.component.html',
  styleUrls: ['./member-create.component.css']
})

export class MemberCreateComponent implements OnInit {
  buttonOne: boolean = false;
  buttonTwo: boolean = false;
  buttonThree: boolean = false;
  insuredFinalPrice: any;
  public loading = false;

  checkEmailDis: boolean = false;
  checkLastNameDis: boolean = false;
  checkFirstNameDis: boolean = false;
  checkPidDis: boolean = false;
  checkBDay: boolean = false;

  owlAnanOne: boolean = true;
  owlAnanTwo: boolean = true;
  owlAnanThree: boolean = true;
  owlAnanFour: boolean = true;
  owlAnanFifth: boolean = true;

  birthdayYears: any[] = [];
  birthdayMonths: any[] = [];
  birthdayDays: any[] = [];
  cityList: any[] = [];
  relationship: any[] = [];
  selectedCity: any = '';
  noGoWithYourFds: boolean = true;
  toGoWithYourFdsClick: boolean = false;
  hiddenAtBegining: any = 'hide';
  email:any = '';
  lastName:string = '';
  firstName:string = '';
  pid:string = '';
  pBirthYear:any = '';
  pBirthMonth:any = '';
  pBirthDay:any = '';
  Mobile:string = '';
  selectedDistrict:any = '';
  areaZipCode:any = '';
  addr: string = '';
  areaList: any = [];
  filteredArea: any = [];
  aggreeToUpdate: boolean = true;
  aggreeToUpdateAlreadyRead: boolean = true;
  applicantSelectListYear: any[] = [];
  applicantAgeMax: number;
  applicantAgeMin: number;
  insuredLimitedAge: number;
  aggreementCompany: string = 'MingTai';
  hideUpinput: boolean = true;
  pdfUrl4Terms: string = '';
  insuredMinAge: any;
  relationShip: any[] = [];
  rateInfoList: any[] = [];
  insuredAgeMax: any;
  insuredAgeMin: any;

  applicantAloneLastName:string = '';
  applicantAloneFirstName:string = '';
  applicantAlonePid:string = '';
  applicantAloneBirthYear: any = '';
  applicantAloneBirthMonth: any = '';
  applicantAloneBirthDay: any = '';
  aloneBirthdayDays: any;
  aloneBdWrong: boolean = false;
  personalInfoSelect: any = '本人';
  applicantAloneLockInput: boolean = false;
  applicantAloneMinAge: any = 0;
  readyToSaveData: boolean = false;
  personalAgeOver: boolean = false;
  alonePidTypeWrong: boolean = false;
  submitTimes: number = 0;
  toRecheck: boolean = false;
  aloneNameLastChinese: boolean;
  aloneNameFirstChinese: boolean;
  insuredList: any;
  countAlertNum: number = 0;
  countBrthDayFromSelectedBtn:any;

  aloneNameEmpty: boolean;
  alonePidWrong: boolean;
  aloneBdEmpty: boolean;
  btnClickToGoFds: boolean = false;
  ans:boolean;

  @ViewChild('emailElm') EmailEl:ElementRef;
  @ViewChild('lastNameEl') lastNameEl:ElementRef;
  @ViewChild('firstNameEl') firstNameEl:ElementRef;
  @ViewChild('birthdayCityEl') birthdayCityEl:ElementRef;
  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private shareService: ShareService,
    private dataService: DataServiceService,
  ) {
    $('html, body').animate({scrollTop: '0px'}, 0);
     this.buttonOne = this.shareService.buttonOne;
     this.buttonTwo = this.shareService.buttonTwo;
     this.buttonThree = this.shareService.buttonThree;

     this.owlAnanOne = this.dataService.owlAnanOne;
     this.owlAnanTwo = this.dataService.owlAnanTwo;
     this.owlAnanThree = this.dataService.owlAnanThree;
     this.owlAnanFour = this.dataService.owlAnanFour;
     this.owlAnanFifth = this.dataService.owlAnanFifth;
  }

  checkAloneBd(){
    this.toRecheckAgain();
    let currentYear = new Date(this.countBrthDayFromSelectedBtn).getFullYear();
    let currentMonth = new Date(this.countBrthDayFromSelectedBtn).getMonth() + 1;
    let currentDay = new Date(this.countBrthDayFromSelectedBtn).getDate();
    if(this.applicantAloneBirthYear && this.applicantAloneBirthMonth){
      this.aloneBirthdayDays =  this.birthDays(this.applicantAloneBirthYear, this.applicantAloneBirthMonth);
    }
    if(this.applicantAloneBirthYear && this.applicantAloneBirthMonth && this.applicantAloneBirthDay){
      let userAge = currentYear - this.applicantAloneBirthYear;
      if((currentMonth >= this.applicantAloneBirthMonth) && (currentDay >= this.applicantAloneBirthDay)){
        //生日過今天 保留原本選擇年紀
      } else {
        userAge = userAge - 1;
        //未過今天 年紀扣一歲
      }
      if(this.insuredLimitedAge !== 0){
        if(this.applicantAloneBirthYear <= (currentYear - (this.insuredLimitedAge+1))){
          if((this.applicantAloneBirthMonth < currentMonth) && (this.applicantAloneBirthDay >= currentDay) || (this.applicantAloneBirthMonth <= currentMonth) && (this.applicantAloneBirthDay <= currentDay)){
            this.aloneBdWrong = true;
          } else {
            this.aloneBdWrong = false;
          }
        } else if(this.applicantAloneBirthYear >= (currentYear - this.insuredMinAge)){
          if((this.applicantAloneBirthMonth >= currentMonth) && (this.applicantAloneBirthDay >= currentDay) || (this.applicantAloneBirthMonth > currentMonth) && (this.applicantAloneBirthDay <= currentDay)){
            console.log('out ininininini2');
            this.aloneBdWrong = true;
            console.log('3', userAge);
          } else {
            this.aloneBdWrong = false;
            console.log('4', userAge);
          }
        }
        if(this.applicantAloneBirthYear <  (currentYear - this.insuredMinAge) && this.applicantAloneBirthYear > (currentYear - (this.insuredLimitedAge+1))){
          this.aloneBdWrong = false;
        }

      }
    } else if (!this.applicantAloneBirthYear && !this.applicantAloneBirthMonth && !this.applicantAloneBirthDay) {
    }
  }

  emailChange(email){
  }

  changedData(year, month, day){
    this.checkBirthday(year, month, day);
    this.dataService.clearData = false;
  }

  checkChineseName(value, id){
    this.toRecheckAgain();
    if(value){
      if(value && id == 'last'){
        if (value.match(/[\u4E00-\u9FFF\u3400-\u4DFF\uF900-\uFAFF]+/g)) {
          this.aloneNameLastChinese = false;
        } else {
          this.aloneNameLastChinese = true;
        }
      } else if (value && id == 'first'){
        if (value.match(/[\u4E00-\u9FFF\u3400-\u4DFF\uF900-\uFAFF]+/g)) {
          this.aloneNameFirstChinese = false;
        } else {
          this.aloneNameFirstChinese = true;
        }
      } else if (value && id == ''){
        if (value.match(/[\u4E00-\u9FFF\u3400-\u4DFF\uF900-\uFAFF]+/g)) {
          return false;
        } else {
          return true;
        }
      }
    }
  }

  checkVal(){
    if(!this.applicantAloneLastName){
      this.aloneLastNameEmpty = true;
    }else{
      this.aloneLastNameEmpty = false;
    }

    if(!this.applicantAloneFirstName){
      this.aloneFirstNameEmpty = true;
    }else{
      this.aloneFirstNameEmpty = false;
    }

    if(!this.applicantAlonePid){
      this.alonePidEmpty = true;
    }else{
      this.alonePidEmpty = false;
    }

    if(this.alonePidTypeWrong){
      this.alonePidTypeWrong = true;
      this.alonePidEmpty = false;
    }else{
      this.alonePidTypeWrong = false;
    }

    if(
        !this.applicantAloneBirthYear ||
        !this.applicantAloneBirthMonth ||
        !this.applicantAloneBirthDay
    ){
      this.aloneBdEmpty = true;
    }else{
      this.aloneBdEmpty = false;
    }
  }

  personalSelectChange(){
    if(this.personalInfoSelect !== '本人') {
      this.applicantAloneLockInput = false;
      this.applicantAloneLastName = '';
      this.applicantAloneFirstName = '';
      this.applicantAlonePid = '';
      this.applicantAloneBirthYear = '';
      this.applicantAloneBirthMonth = '';
      this.applicantAloneBirthDay = '';
    } else {
      this.aloneLastNameEmpty = false;
      this.aloneFirstNameEmpty = false;
      this.alonePidEmpty = false;
      this.alonePidTypeWrong = false;
      this.aloneBdEmpty = false;
      this.applicantAloneLockInput = true;
      this.applicantAloneLastName = this.lastName;
      this.applicantAloneFirstName = this.firstName;
      this.applicantAlonePid = this.pid;
      this.applicantAloneBirthYear = this.pBirthYear;
      this.applicantAloneBirthMonth = this.pBirthMonth;
      this.applicantAloneBirthDay = this.pBirthDay;
      this.aloneLastNameEmpty = false;
      this.aloneFirstNameEmpty = false;
      this.alonePidEmpty = false;

    }
  }

  addrCheck(addr){
    if(!addr){
      return true;
    } else {
      return false;
    }
  }

  toRecheckAgain(){
    if(this.toRecheck){
        this.checkVal();
    }
  }

  checkBirthday(year, month, day){
    if (!year && !month && !day) {

    } else if(year && month && day) {
      let currentDay = new Date().getDate();
      let currentMonth = new Date().getMonth() + 1;
      let currentYear = new Date().getFullYear();
      let maxYear = new Date().getFullYear() - this.applicantAgeMax //old;
      let minYear = new Date().getFullYear() - this.applicantAgeMin //young;
      if(this.pBirthYear && this.pBirthMonth){
        this.birthdayDays = this.birthDays(this.pBirthYear, this.pBirthMonth);
      }
      if(year == maxYear ){

        if((this.pBirthYear <= maxYear && this.pBirthMonth <= currentMonth && this.pBirthDay <= currentDay)) {
          this.personalAgeOver = true;
        } else {
          this.personalAgeOver = false;
        }
      } else if (year == minYear) {

        if((this.pBirthYear >= minYear && this.pBirthMonth >= currentMonth && this.pBirthDay >= currentDay)) {
          this.personalAgeOver = true;
        } else {
          this.personalAgeOver = false;
        }
       } else if (year < maxYear && year > minYear) {
        if(year < maxYear && this.pBirthMonth < currentMonth && this.pBirthDay < currentDay){
          this.personalAgeOver = false;
        }
        if((year > minYear && this.pBirthMonth > currentMonth) || (year > minYear && this.pBirthMonth == currentMonth && this.pBirthDay < currentDay)){
          this.personalAgeOver = false;
        } else {
          this.personalAgeOver = true;
        }
      }

      if((year > maxYear && month > currentMonth && day > currentDay) && (year < minYear && month > currentMonth)){
        this.personalAgeOver = false;
      }
    } else {
      this.personalAgeOver = false;
    }
  }

  checkCityArea(city, area) {
    if(!city || !area) {
      return true;
    }
  }

  checkAlonePid(value){
    if(this.pidCheck(value)){
      this.alonePidTypeWrong = true;
      this.toRecheckAgain();
    }else{
      this.toRecheckAgain();
      this.alonePidTypeWrong = false;
    }
  }

  pidCheck(userid:string){
    if(userid){
      var tab = 'ABCDEFGHJKLMNPQRSTUVXYWZIO',
          A1 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3],
          A2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5],
          Mx = [9, 8, 7, 6, 5, 4, 3, 2, 1, 1];
      if (userid.length != 10) return true;
      var i = tab.indexOf(userid.toUpperCase().charAt(0));
      if (i == -1) return true;
      var sum = A1[i] + A2[i] * 9;
      for (i = 1; i < 10; i++) {
        var v = parseInt(userid.charAt(i));
        if (isNaN(v)) return true;
        sum = sum + v * Mx[i];
      }
      if (sum % 10 != 0) return true;
      return false;
    } else {
      return true;
    }
  }

  toZipCode(value, areaId) {
    if(value){
     this.areaList.forEach((item) => {
       if(item.id == areaId){
         this.areaZipCode = item.zipCode
       } else if(item.id == value.value){
         this.areaZipCode = item.zipCode
       }
     });
   }
  }

  toLoadArea(value) {
    var emptyArray = [];
    if(this.selectedCity && value == 'init'){
      this.areaList.forEach((item) => {
        if(item.cityId == this.selectedCity){
          emptyArray.push(item);
          this.filteredArea = emptyArray;
        }
      })
    } else {
      this.selectedDistrict = '';
      this.areaZipCode = '';
      this.areaList.filter(item => item.cityId == this.selectedCity).map((data)=>{
        emptyArray.push(data);
      });
      this.filteredArea = emptyArray;

    }
  }

  ToShowConfirmModal(val:boolean){
    if(val){
        var modal = document.getElementById('myConfirmModal');
        modal.style.display = "block";
        var body = $("html, body");
        body.stop().animate({scrollTop: 820}, 200, 'swing', function () {
        });
    }else{
        var modal = document.getElementById('myConfirmModal2');
        modal.style.display = "block";
        var body = $("html, body");
        body.stop().animate({scrollTop: 820}, 200, 'swing', function () {
        });
    }

  }

  GoingWithFds(val) {
    var body = $("html, body");
    body.stop().animate({scrollTop: 820}, 200, 'swing', function () {
    });
    if(!val){
      if(this.hiddenAtBegining == 'hide'){
        if(!this.lastName ||
          !this.firstName ||
          !this.email ||
          !this.pid ||
          !this.pBirthYear ||
          !this.pBirthMonth ||
          !this.pBirthDay ||
          !this.Mobile ||
          !this.selectedCity ||
          !this.selectedDistrict ||
          !this.addr ||
          this.personalAgeOver
        ){
          this.hiddenAtBegining = 'hide';
          var modal = document.getElementById('myModal');
          modal.style.display = "block";
          this.dataService.AlertTXT = [];
          this.dataService.AlertTXT.push('您必須先填寫完以上資料');
          var body = $("html, body");
          body.stop().animate({scrollTop:0}, 200, 'swing', function() {
          });
          return false;
        }else{
          this.noGoWithYourFds = false;
          this.personalInfoSelect = '本人';
          this.personalSelectChange();
          this.toGoWithYourFdsClick = false;
          this.hiddenAtBegining = false;
        }
      }else{
        if(!this.ans){
          this.noGoWithYourFds = true;
          return false;
        }else{
          this.noGoWithYourFds = false;
          this.personalInfoSelect = '本人';
          this.personalSelectChange();
          this.toGoWithYourFdsClick = false;
          this.hiddenAtBegining = false;
        }
      }
    }else{
      if(this.hiddenAtBegining == 'hide') {
        if (!this.lastName ||
            !this.firstName ||
            !this.email ||
            !this.pid ||
            !this.pBirthYear ||
            !this.pBirthMonth ||
            !this.pBirthDay ||
            !this.Mobile ||
            !this.selectedCity ||
            !this.selectedDistrict ||
            !this.addr ||
            this.personalAgeOver
        ){
          this.hiddenAtBegining = 'hide';
          var modal = document.getElementById('myConfirmModal');
          modal.style.display = "block";
          this.dataService.AlertTXT = [];
          this.dataService.AlertTXT.push('您必須先填寫完以上資料');
          var body = $("html, body");
          body.stop().animate({scrollTop: 0}, 200, 'swing', function () {
          });
          return false;
        }else{
          this.noGoWithYourFds = true;
          this.hiddenAtBegining = true;
          this.toGoWithYourFdsClick = false;
          this.btnClickToGoFds = true;
          this.owlAnanOne = false;
          this.dataService.owlAnanOne = false;
        }
        }else{
        if(!this.ans){
          this.noGoWithYourFds = false;
          return false;
        }else{
          this.noGoWithYourFds = true;
          this.hiddenAtBegining = true;
          this.toGoWithYourFdsClick = false;
          this.btnClickToGoFds = true;
          this.owlAnanOne = false;
          this.dataService.owlAnanOne = false;
        }
      }

    }
  };


  ModelCancel(){
      var modal = document.getElementById('myConfirmModal');
      modal.style.display = "none";
      var modal = document.getElementById('myConfirmModal2');
      modal.style.display = "none";
  }

  ModelClick(val){
      this.ans = true;
      if(val){
      var modal = document.getElementById('myConfirmModal');
      modal.style.display = "none";
      this.GoingWithFds(true);
    }else{
      var modal = document.getElementById('myConfirmModal2');
      modal.style.display = "none";
      this.GoingWithFds(false);
    }
  }
    // var ans;
    // if(this.hiddenAtBegining == 'hide'){
    //
    //
    //   }else{
    //     this.hiddenAtBegining = true;
    //     this.toGoWithYourFdsClick = false;
    //     this.btnClickToGoFds = true;
    //     this.owlAnanOne = false;
    //     this.dataService.owlAnanOne = false;
    //     ans = true;
    //     var body = $("html, body");
    //     if(window.innerWidth <= 500){
    //       body.stop().animate({scrollTop:1190}, 200, 'swing', function() {
    //       });
    //     }else{
    //       body.stop().animate({scrollTop:1020}, 200, 'swing', function() {
    //       });
    //     }
    //   }
    // }else{
    //   if(!this.lastName &&
    //       !this.firstName &&
    //       !this.email &&
    //       !this.pid &&
    //       !this.pBirthYear &&
    //       !this.pBirthMonth &&
    //       !this.pBirthDay &&
    //       !this.Mobile &&
    //       !this.selectedCity &&
    //       !this.selectedDistrict &&
    //       !this.addr ||
    //       this.personalAgeOver
    //   ){
    //     this.hiddenAtBegining = 'hide';
    //     var modal = document.getElementById('myModal');
    //     modal.style.display = "block";
    //     this.dataService.AlertTXT = [];
    //     this.dataService.AlertTXT.push('您必須先填寫完以上資料');
    //     var body = $("html, body");
    //     body.stop().animate({scrollTop:0}, 200, 'swing', function() {
    //     });
    //     return false;
    //   }else{
    //     this.hiddenAtBegining = true;
    //     this.toGoWithYourFdsClick = false;
    //     this.btnClickToGoFds = true;
    //     this.owlAnanOne = false;
    //     this.dataService.owlAnanOne = false;
    //     ans = confirm('您的被保人資料將不被保留，要繼續？');
    //     var body = $("html, body");
    //     if(window.innerWidth <= 500){
    //       body.stop().animate({scrollTop:1190}, 200, 'swing', function() {
    //       });
    //     }else {
    //       body.stop().animate({scrollTop: 1020}, 200, 'swing', function () {
    //       });
    //     }
    //     var body = $("html, body");
    //     if(window.innerWidth <= 500){
    //       body.stop().animate({scrollTop:1190}, 200, 'swing', function() {
    //       });
    //     }else{
    //       body.stop().animate({scrollTop:1020}, 200, 'swing', function() {
    //       });
    //     }
    //   }
    // }
    // console.log(ans);
    // if(!ans){
    //   return false;
    // }else{
    //
    // }


  // noGoingWithFds(val) {
  //   if(!val){
  //     this.noGoWithYourFds = false;
  //   }else{
  //     this.noGoWithYourFds = true;
  //   }
  //   this.personalInfoSelect = '本人';
  //   this.personalSelectChange();
  //   console.log('hiddener', this.hiddenAtBegining);
  //   var ans;
  //   if(this.hiddenAtBegining == 'hide'){
  //     ans = true;
  //   }else{
  //     if( !this.lastName &&
  //         !this.firstName &&
  //         !this.email &&
  //         !this.pid &&
  //         !this.pBirthYear &&
  //         !this.pBirthMonth &&
  //         !this.pBirthDay &&
  //         !this.Mobile &&
  //         !this.selectedCity &&
  //         !this.selectedDistrict &&
  //         !this.addr ||
  //         this.personalAgeOver
  //     ){
  //       this.hiddenAtBegining = 'hide';
  //       var modal = document.getElementById('myModal');
  //       modal.style.display = "block";
  //       this.dataService.AlertTXT = [];
  //       this.dataService.AlertTXT.push('您必須先填寫完以上資料');
  //       var body = $("html, body");
  //       body.stop().animate({scrollTop:0}, 200, 'swing', function() {
  //       });
  //       return false;
  //       }else{
  //       ans = confirm('您的被保人資料將不被保留，要繼續？');
  //       if(!ans){
  //         this.noGoWithYourFds = false;
  //       }else{

  //       }
  //     }
  //
  //     var body = $("html, body");
  //     if(window.innerWidth <= 500){
  //       body.stop().animate({scrollTop:1190}, 200, 'swing', function() {
  //       });
  //     }else{
  //       body.stop().animate({scrollTop:1020}, 200, 'swing', function() {
  //       });
  //     }
  //   }


  windowSizeCheck(){
    if(window.innerWidth < 500){
      return true;
    }else{
      return false;
    }
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

  reloadedAgain() {
    if(this.dataService.backFromConfirm){
      this.dataService.toGetBakInfo().subscribe((item) => {
        this.aggreeToUpdate = item['isUpdate'];
      });
    }
  }

  ngOnInit() {
    if(this.dataService.backFromConfirm && this.dataService.noGoWithYourFdsFlag !== undefined){
      this.hiddenAtBegining = false;
      this.noGoWithYourFds = this.dataService.noGoWithYourFdsFlag;
      if(!this.noGoWithYourFds){
        this.dataService.toGetBakInfo().subscribe((item) => {
          this.aggreeToUpdate = item['applicant']['isUpdate'];
          this.insuredList = item['insuredList'];
          console.log(item);
          this.relationShip = item.relationList;
          this.rateInfoList = item.rateInfoList;
          console.log('insuredAgeMax', item.companySetting['insuredAgeMax']);
          console.log('insuredAgeMin', item.companySetting['insuredAgeMin']);

          this.insuredAgeMax = item.companySetting['insuredAgeMax'];
          this.insuredAgeMin = item.companySetting['insuredAgeMin'];
          this.insuredLimitedAge = item.companySetting['insuredAgeMax'] - item.companySetting['insuredAgeMin'];
          this.insuredMinAge = item.companySetting['insuredAgeMin'];

          this.applicantAgeMax = item.companySetting['applicantAgeMax'];
          this.applicantAgeMin = item.companySetting['applicantAgeMin'];
          this.insuredLimitedAge = item.companySetting['insuredAgeMax'] - item.companySetting['insuredAgeMin'];
          this.applicantAloneMinAge = item.companySetting['insuredAgeMin'];
          this.countBrthDayFromSelectedBtn = item['travelStartDate'];

          this.applicantSelectBirth();
          this.pdfUrl4Terms = item.pdfUrl4Terms;
          this.birthYears();
          this.relationship = item.relationList;
          this.email = item.applicant.email;
          this.email.length == 0 ? this.checkEmailDis = false : this.checkEmailDis = true;
          this.lastName = item.applicant.lastName;
          this.lastName.length == 0 ? this.checkLastNameDis = false : this.checkLastNameDis = true;
          this.firstName = item.applicant.firstName;
          this.firstName.length == 0 ? this.checkFirstNameDis = false : this.checkFirstNameDis = true;
          this.pid = item.applicant.pid;
          this.pid.length == 0 ? this.checkPidDis = false : this.checkPidDis = true;
          item.applicant.birthday.length == 0 ? this.checkBDay = false : this.checkBDay = true;
          this.pBirthYear = item.applicant.birthday.slice(0, 4);
          this.pBirthMonth = item.applicant.birthday.slice(5, 7);
          if (this.pBirthMonth.slice(0, 1) == '0') {
            this.pBirthMonth = this.pBirthMonth.slice(1, 2);
          }
          this.pBirthDay = item.applicant.birthday.slice(8, 10);
          if (this.pBirthDay.slice(0, 1) == '0') {
            this.pBirthDay = this.pBirthDay.slice(1, 2);
          }
          this.Mobile = item.applicant.mobile;
          this.selectedCity = (item.applicant.addressCityId == 0 ? '' : item.applicant.addressCityId);
          this.toLoadArea('init');
          this.selectedDistrict = (item.applicant.addressAreaId == 0 ? '' : item.applicant.addressAreaId);
          this.toZipCode(true, this.selectedDistrict);
          this.addr = item.applicant['address'];
          if (!this.Mobile || !this.selectedCity || !this.selectedDistrict || !this.addr) {
            this.hideUpinput = true;
          } else {
            this.hideUpinput = false;
          }


          this.insuredList.forEach((item, index)=>{
            switch(index){
              case 0:
                this.applicantAloneLockInput = true;
                this.personalInfoSelect = item['relation'];
                this.applicantAloneLastName = item['lastName'];
                this.applicantAloneFirstName = item['firstName'];
                this.applicantAlonePid = item['pid'];
                this.applicantAloneBirthYear = item['birthday'].slice(0, 4);
                this.applicantAloneBirthMonth = item['birthday'].slice(5,6) == 0? item['birthday'].slice(6,7): item['birthday'].slice(5,7);
                this.applicantAloneBirthDay =  item['birthday'].slice(8,9) == 0? item['birthday'].slice(9,10): item['birthday'].slice(8,10);
                break;
              default:
            }
          })
        });
      }
    }
    this.birthdayMonths = this.birthMonths();
    this.birthdayDays = this.birthDays(new Date().getFullYear(), new Date().getMonth()+1);
    this.aloneBirthdayDays = this.birthdayDays;
    this.dataService.getIniData().subscribe((data) => {
      this.cityList = data.cityList;
      this.areaList = data.areaList;
      this.toLoadArea('init');
      this.toZipCode(true, this.selectedDistrict);
    });
    if(this.dataService.backFromConfirm){
    }else{
      var Url = window.location.href;
      var turnBakUrl = this.toGetDataFromUrl(Url);
      var idArray = this.toGetId(Url);
      idArray['orderNumber'].forEach((item) => {
        this.dataService.orderNumberForSave = item;
      });
      this.dataService.toGetInsuredInfo(idArray).subscribe((item) => {
        if (item) {
          console.log(item);
          this.relationShip = item.relationList;
          this.rateInfoList = item.rateInfoList;
          console.log('insuredAgeMax', item.companySetting['insuredAgeMax']);
          console.log('insuredAgeMin', item.companySetting['insuredAgeMin']);

          this.insuredAgeMax = item.companySetting['insuredAgeMax'];
          this.insuredAgeMin = item.companySetting['insuredAgeMin'];
          this.insuredLimitedAge = item.companySetting['insuredAgeMax'] - item.companySetting['insuredAgeMin'];
          this.insuredMinAge = item.companySetting['insuredAgeMin'];

          this.applicantAgeMax = item.companySetting['applicantAgeMax'];
          this.applicantAgeMin = item.companySetting['applicantAgeMin'];
          this.insuredLimitedAge = item.companySetting['insuredAgeMax'] - item.companySetting['insuredAgeMin'];
          this.applicantAloneMinAge = item.companySetting['insuredAgeMin'];
          this.countBrthDayFromSelectedBtn = item['travelStartDate'];

          this.applicantSelectBirth();
          this.pdfUrl4Terms = item.pdfUrl4Terms;
          this.birthYears();
          this.relationship = item.relationList;
          this.email = item.applicant.email;
          this.email.length == 0 ? this.checkEmailDis = false : this.checkEmailDis = true;
          this.lastName = item.applicant.lastName;
          this.lastName.length == 0 ? this.checkLastNameDis = false : this.checkLastNameDis = true;
          this.firstName = item.applicant.firstName;
          this.firstName.length == 0 ? this.checkFirstNameDis = false : this.checkFirstNameDis = true;
          this.pid = item.applicant.pid;
          this.pid.length == 0 ? this.checkPidDis = false : this.checkPidDis = true;
          item.applicant.birthday.length == 0 ? this.checkBDay = false : this.checkBDay = true;
          this.pBirthYear = item.applicant.birthday.slice(0, 4);
          this.pBirthMonth = item.applicant.birthday.slice(5, 7);
          if (this.pBirthMonth.slice(0, 1) == '0') {
            this.pBirthMonth = this.pBirthMonth.slice(1, 2);
          }
          this.pBirthDay = item.applicant.birthday.slice(8, 10);
          if (this.pBirthDay.slice(0, 1) == '0') {
            this.pBirthDay = this.pBirthDay.slice(1, 2);
          }
          this.Mobile = item.applicant.mobile;
          this.selectedCity = (item.applicant.addressCityId == 0 ? '' : item.applicant.addressCityId);
          this.toLoadArea('init');
          this.selectedDistrict = (item.applicant.addressAreaId == 0 ? '' : item.applicant.addressAreaId);
          this.toZipCode(true, this.selectedDistrict);
          this.addr = item.applicant['address'];
          if (!this.Mobile || !this.selectedCity || !this.selectedDistrict || !this.addr) {
            this.hideUpinput = true;
          } else {
            this.hideUpinput = false;
          }
        }
      });
    }
  }

  deleteThisOne() {
  }

  deleteThisMinus() {
    var lengthOfOwls = $('#insuredInfoAppend').children('#insuredOneCard').length;
    switch (lengthOfOwls) {
      case 2:
        this.dataService.owlAnanOne = true;
        this.owlAnanOne = true;
        break;
      case 3:
        this.dataService.owlAnanTwo = true;
        this.owlAnanTwo = true;
        break;
      case 4:
        this.dataService.owlAnanThree = true;
        this.owlAnanThree = true;
        break;
      case 5:
        this.dataService.owlAnanFour = true;
        this.owlAnanFour = true;
        break;
      case 6:
        this.dataService.owlAnanFifth = true;
        this.owlAnanFifth = true;
        break;
      default:
    };
    if(($('#insuredInfoAppend').children('#insuredOneCard').length) == 1){
      var modal = document.getElementById('myModal');
      modal.style.display = "block";
      this.dataService.AlertTXT = [];
      this.dataService.AlertTXT.push('最少必須一人');
    } else {
    };
  }

  applicantSelectBirth() {
    var date = new Date(this.countBrthDayFromSelectedBtn);
    let endAge = this.applicantAgeMax - this.applicantAgeMin;
    let limitAge = date.getFullYear() - this.applicantAgeMin;
    var returnVal = [];
    returnVal.push(limitAge);
    for (var i = 0; i <= endAge; i++) {
      if(i < endAge){
        limitAge--;
        returnVal.push(limitAge);
      } else {
        this.applicantSelectListYear = returnVal;
      }
    }
  }

  birthYears() {
    var date = new Date(this.countBrthDayFromSelectedBtn);
    let limitAge = date.getFullYear() - this.applicantAloneMinAge;
    var returnVal = [];
    returnVal.push(limitAge);
    for (var i = 0; i <= (this.insuredLimitedAge+1); i++) {
      if(i < (this.insuredLimitedAge+1)){
        limitAge--;
        returnVal.push(limitAge);
      } else {
        this.birthdayYears = returnVal;
      }
    }
  }

  getCustomerHomePage(){
    this.dataService.getCustomerHomePage().subscribe((item)=>{
      console.log(item);
    });
  }

  birthMonths() {
    var months = [];
    for (let i = 1; i <= 12; i++) {
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
    var lengthOfOwls = $('#insuredInfoAppend').children('#insuredOneCard').length;
    switch (lengthOfOwls) {
      case 1:
        this.dataService.owlAnanOne = false;
        this.owlAnanOne = false;
      break;
      case 2:
        this.dataService.owlAnanTwo = false;
        this.owlAnanTwo = false;
      break;
      case 3:
        this.dataService.owlAnanThree = false;
        this.owlAnanThree = false;
      break;
      case 4:
        this.dataService.owlAnanFour = false;
        this.owlAnanFour = false;
      break;
      case 5:
        this.dataService.owlAnanFifth = false;
        this.owlAnanFifth = false;
      break;
      default:
    }
    if(($('#insuredInfoAppend').children('#insuredOneCard').length) <= 5){
    } else {
      var modal = document.getElementById('myModal');
      modal.style.display = "block";
      this.dataService.AlertTXT = [];
      this.dataService.AlertTXT.push('您最多只能五位加保人');
    }
  }

  toUpdatePrice:boolean = false;
  finalPrice(){
    this.toUpdatePrice = true;
    return this.dataService.insuredTotal;
  }

  aloneLastNameEmpty: boolean = false;
  aloneFirstNameEmpty: boolean = false;
  alonePidEmpty: boolean = false;
  ToSaveInsured(){
    this.dataService.noGoWithYourFdsFlag = this.noGoWithYourFds;
    this.submitTimes = 0;
    this.dataService.backFromConfirm = false;
    this.readyToSaveData = true;
    this.dataService.SaveInsuredData['applicant'] = {};
    this.dataService.SaveInsuredData['applicant']['firstName'] = this.firstName;
    this.dataService.SaveInsuredData['applicant']['lastName'] = this.lastName;
    this.dataService.SaveInsuredData['applicant']['pid'] = this.pid;
    this.dataService.SaveInsuredData['applicant']['birthday'] = this.pBirthYear + '-' + (this.pBirthMonth.length == 1? '0'+this.pBirthMonth: this.pBirthMonth) + '-' + (this.pBirthDay.length == 1? '0'+ this.pBirthDay: this.pBirthDay);
    this.dataService.SaveInsuredData['applicant']['mobile'] = this.Mobile;
    this.dataService.SaveInsuredData['applicant']['email'] = this.email;
    this.dataService.SaveInsuredData['applicant']['addressCityId'] = this.selectedCity;
    this.dataService.SaveInsuredData['applicant']['addressAreaId'] = this.selectedDistrict;
    this.dataService.SaveInsuredData['applicant']['addressZipCode'] = this.areaZipCode;
    this.dataService.SaveInsuredData['applicant']['address'] = this.addr;
    this.dataService.SaveInsuredData['applicant']['isUpdate'] = this.aggreeToUpdate;

    if(!this.noGoWithYourFds){
      if(
          !this.personalInfoSelect ||
          !this.applicantAloneLastName ||
          !this.applicantAloneFirstName ||
          !this.applicantAlonePid ||
           this.alonePidTypeWrong ||
          !this.applicantAloneBirthYear ||
          !this.applicantAloneBirthMonth ||
          !this.applicantAloneBirthDay
      ){

        if(!this.personalInfoSelect){

        }else{

        }

        if(!this.applicantAloneLastName){
          this.aloneLastNameEmpty = true;
        }else{
          this.aloneLastNameEmpty = false;
        }

        if(!this.applicantAloneFirstName){
          this.aloneFirstNameEmpty = true;
        }else{
          this.aloneFirstNameEmpty = false;
        }

        if(!this.applicantAlonePid){
          this.alonePidEmpty = true;
        }else{
          this.alonePidEmpty = false;
        }

        if(this.alonePidTypeWrong){
          this.alonePidTypeWrong = true;
        }else{
          this.alonePidTypeWrong = false;
        }

        if(
          !this.applicantAloneBirthYear ||
          !this.applicantAloneBirthMonth ||
          !this.applicantAloneBirthDay
        ){
          this.aloneBdEmpty = true;
        }else{
          this.aloneBdEmpty = false;
        }

        this.toRecheck = true;
        var modal = document.getElementById('myModal');
        modal.style.display = "block";
        this.dataService.AlertTXT = [];
        this.dataService.AlertTXT.push('請正確填入要保人資料');
        var body = $("html, body");
        body.stop().animate({scrollTop:1520}, 200, 'swing', function() {
        });
      }else{

        this.dataService.SaveInsuredData['insuredList'] = [];
        let returnObj = {};
        returnObj['relation'] = this.personalInfoSelect;
        returnObj['lastName'] = this.applicantAloneLastName;
        returnObj['firstName'] = this.applicantAloneFirstName;
        returnObj['pid'] = this.applicantAlonePid;
        returnObj['birthday'] = this.applicantAloneBirthYear + '-' + (this.applicantAloneBirthMonth.length == 1? '0'+ this.applicantAloneBirthMonth: this.applicantAloneBirthMonth) + '-' + (this.applicantAloneBirthDay.length == 1? '0'+ this.applicantAloneBirthDay: this.applicantAloneBirthDay);
        this.dataService.SaveInsuredData['insuredList'].push(returnObj);
        this.dataService.toSaveInsuredData();

      }
    }
  }
}
