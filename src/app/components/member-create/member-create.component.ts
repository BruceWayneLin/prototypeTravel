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
  buttonOne: boolean = false;
  buttonTwo: boolean = false;
  buttonThree: boolean = false;
  insuredFinalPrice: any;

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
  noGoWithYourFds: boolean = false;
  toGoWithYourFdsClick: boolean = false;
  email:any = '';
  lastName:string = '';
  firstName:string = '';
  pid:string = '';
  pBirthYear:string = '';
  pBirthMonth:string = '';
  pBirthDay:string = '';
  Mobile:string = '';
  selectedDistrict:any = '';
  areaZipCode:any = '';
  addr: string = '';
  areaList: any = [];
  filteredArea: any = [];

  applicantSelectListYear: any[] = [];
  applicantAgeMax: number;
  applicantAgeMin: number;
  insuredLimitedAge: number;

  applicantAloneLastName:string = '';
  applicantAloneFirstName:string = '';
  applicantAlonePid:string = '';
  applicantAloneBirthYear: string = '';
  applicantAloneBirthMonth: string = '';
  applicantAloneBirthDay: string = '';
  personalInfoSelect: any = '本人';
  applicantAloneLockInput: boolean = false;
  applicantAloneMinAge: any = 0;

  @ViewChild('emailElm') EmailEl:ElementRef;
  @ViewChild('lastNameEl') lastNameEl:ElementRef;
  @ViewChild('firstNameEl') firstNameEl:ElementRef;
  @ViewChild('birthdayCityEl') birthdayCityEl:ElementRef;

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

     this.owlAnanOne = this.dataService.owlAnanOne;
     this.owlAnanTwo = this.dataService.owlAnanTwo;
     this.owlAnanThree = this.dataService.owlAnanThree;
     this.owlAnanFour = this.dataService.owlAnanFour;
     this.owlAnanFifth = this.dataService.owlAnanFifth;
  }

  emailChange(email){
  }

  changedData(){
    this.dataService.clearData = false;
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
      this.applicantAloneLockInput = true;
      this.applicantAloneLastName = this.lastName;
      this.applicantAloneFirstName = this.firstName;
      this.applicantAlonePid = this.pid;
      this.applicantAloneBirthYear = this.pBirthYear;
      this.applicantAloneBirthMonth = this.pBirthMonth;
      this.applicantAloneBirthDay = this.pBirthDay;
    }
  }

  addrCheck(addr){
    if(!addr){
      return true;
    } else {
      return false;
    }
  }

  checkBirthday(year, month, day){
    if(!year && !month && !day) {
      return true;
    }
  }

  checkCityArea(city, area) {
    if(!city || !area) {
      return true;
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

  toZipCode(value) {
    this.areaZipCode = value.model;
  }

  toLoadArea() {
    console.log(this.selectedCity);
    let emptyArray = [];
    this.selectedDistrict = 0;
    this.areaZipCode = '';
    this.areaList.filter(item => item.cityId == this.selectedCity).map((data)=>{
      emptyArray.push(data);
    })
    this.filteredArea = emptyArray;
  }

  GoingWithFds() {
    this.toGoWithYourFdsClick = false;
    this.noGoWithYourFds = true;
    this.owlAnanOne = false;
    this.dataService.owlAnanOne = false;
    $('html body').animate({'scrollTop': $('#addInsuredAdd').offset().top - 130 });
  }
  noGoingWithFds() {
    this.toGoWithYourFdsClick = true;
    this.noGoWithYourFds = false;
    this.personalSelectChange();
  }

  ngOnInit() {
    this.birthdayMonths = this.birthMonths();
    this.birthdayDays = this.birthDays(new Date().getFullYear(), new Date().getMonth()+1);
    this.dataService.getIniData().subscribe((data) => {
      this.cityList = data.cityList;
      this.areaList = data.areaList;
    });
    this.dataService.toGetInsuredInfo(localStorage.getItem('id')).subscribe((item) => {
      if(item){
        console.log(item);
        this.applicantAgeMax = item.companySetting['applicantAgeMax'];
        this.applicantAgeMin =  item.companySetting['applicantAgeMin'];
        this.insuredLimitedAge = item.companySetting['insuredAgeMax'] - item.companySetting['insuredAgeMin'];
        this.applicantAloneMinAge = item.companySetting['insuredAgeMin'];
        this.applicantSelectBirth();
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
        if(this.pBirthMonth.slice(0, 1) == '0'){
          this.pBirthMonth = this.pBirthMonth.slice(1, 2);
        }
        this.pBirthDay = item.applicant.birthday.slice(8, 10);
        if(this.pBirthDay.slice(0, 1) == '0'){
          this.pBirthDay = this.pBirthDay.slice(1, 2);
        }
        this.Mobile = item.applicant.mobile;
        this.selectedCity = item.applicant.addressCityId;
        this.selectedDistrict = item.applicant.addressAreaId;
        this.addr = item.applicant.address;
      }
    });
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
      alert('最少必須一人');
    } else {
    };
  }

  applicantSelectBirth() {
    var date = new Date();
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
    var date = new Date();
    let limitAge = date.getFullYear() - this.applicantAloneMinAge;
    var returnVal = [];
    returnVal.push(limitAge);
    for (var i = 0; i <= this.insuredLimitedAge; i++) {
      if(i < this.insuredLimitedAge){
        limitAge--;
        returnVal.push(limitAge);
      } else {
        this.birthdayYears = returnVal;
      }
    }
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
      alert('您最多只能五位加保人');
    }
  }

  finalPrice(){

    if (this.dataService.insuredTotal.currentValue !== this.dataService.insuredTotal.previousValue) {
        setTimeout(() => this.dataService.insuredTotal.emit(this.dataService.insuredTotal), this.dataService.insuredTotal.previousValue)
    }

    return this.dataService.insuredTotal;
  }

}
