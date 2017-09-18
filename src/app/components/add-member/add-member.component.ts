import { Component, OnInit } from '@angular/core';
import { ShareService } from '../../services/share.service';
import { DataServiceService } from '../../services/data-service.service';
import { MemberCreateComponent } from '../../components/member-create/member-create.component'

@Component({
  selector: 'app-add-member',
  templateUrl: 'add-member.component.html',
  styleUrls: ['add-member.component.css']
})
export class AddMemberComponent implements OnInit {
  birthdayYears: any[] = [];
  birthdayMonths: any[] = [];
  birthdayDays: any[] = [];
  relationShip: any[] = [];
  rateInfoList: any[] = [];
  lockFirstCard: boolean = true;
  insuredLimitedAge: number = 0;
  insuredMinAge: any;

  Relationship: any = {};

  constructor(
      private shareService:ShareService,
      private dataService:DataServiceService,
      private memberCom: MemberCreateComponent
  ) {
    this.birthdayMonths = this.birthMonths();
    this.birthdayDays = this.birthDays(new Date().getFullYear(), new Date().getMonth()+1);
  }

  ngOnInit() {
    this.dataService.toGetInsuredInfo(localStorage.getItem('id')).subscribe((item) => {
      if(item){
        console.log(item);
        this.relationShip = item.relationList;
        this.rateInfoList = item.rateInfoList;
        this.insuredLimitedAge = item.companySetting['insuredAgeMax'] - item.companySetting['insuredAgeMin'];
        this.insuredMinAge = item.companySetting['insuredAgeMin'];
        this.birthYears();
      }
    });
   this.changedRelationship();
  }

  owlAnanTwo() {
    if(this.dataService.clearData == false){
      this.firstCardLastName = this.memberCom.lastName;
      this.firstCardFirstName = this.memberCom.firstName;
      this.firstCardPid = this.memberCom.pid
      this.firstCardYear = this.memberCom.pBirthYear.slice(0, 4);
      this.firstCardMonth = this.memberCom.pBirthMonth;
      this.firstCardDay = this.memberCom.pBirthDay;
      this.checkRatioAmt(1);
    }
    if(this.dataService.owlAnanOne){
      this.secondCardInsuredPrice = 0;
      this.secondCardRelationship = "";
      this.secondCardLastName = '';
      this.secondCardFirstName = '';
      this.secondCardPid = '';
      this.secondCardYear = '';
      this. secondCardMonth = '';
      this. secondCardDay  = '';
    }
    return this.dataService.owlAnanOne;
  }
  owlAnanThree() {
    if(this.dataService.owlAnanTwo){
      this.thirdCardInsuredPrice = 0;
      this.thirdCardRelationship = "";
      this.thirdCardLastName = '';
      this.thirdCardFirstName = '';
      this.thirdCardPid = '';
      this.thirdCardYear = '';
      this.thirdCardMonth = '';
      this.thirdCardDay = '';
    }
    return this.dataService.owlAnanTwo;
  }
  owlAnanFour() {
    if(this.dataService.owlAnanThree){
      this.fourthCardInsuredPrice = 0;
      this.fourthCardRelationship = "";
      this.fourthCardLastName = '';
      this.fourthCardFirstName = '';
      this.fourthCardPid = '';
      this.fourthCardYear  = '';
      this.fourthCardMonth = '';
      this.fourthCardDay = '';
    }
    return this.dataService.owlAnanThree;
  }
  owlAnanFifth() {
    if(this.dataService.owlAnanFour){
      this.fifthCardInsuredPrice = 0;
      this.fifthCardRelationship = "";
      this.fifthCardLastName = '';
      this.fifthardFirstName  = '';
      this.fifthCardPid = '';
      this.fifthCardYear = '';
      this.fifthCardMonth = '';
      this.fifthCardDay = '';
    }
    return this.dataService.owlAnanFour;
  }
  owlAnanSixth() {
    if(this.dataService.owlAnanFifth){
      this.sixthCardInsuredPrice = 0;
      this.sixthCardRelationship  = "";
      this.sixthCardLastName = '';
      this.sixthCardFirstName = '';
      this.sixthCardPid = '';
      this.sixthCardYear  = '';
      this.sixthCardMonth = '';
      this.sixthCardDay = '';
    }
    return this.dataService.owlAnanFifth;
  }

  changedRelationship() {
    if(this.firstCardRelationship == '本人') {
      this.lockFirstCard = true;
      this.dataService.clearData = false;
      this.Data();
    } else {
      this.dataService.clearData = true;
      this.lockFirstCard = false;
      this.Data();
    }
  }

  Data() {
    if(this.dataService.clearData == true){
      this.firstCardLastName = '';
      this.firstCardFirstName = '';
      this.firstCardPid = '';
      this.firstCardYear = '';
      this.firstCardMonth = '';
      this.firstCardDay = '';
      this.firstCardInsuredPrice = 0;
    } else {
      this.firstCardLastName = this.memberCom.lastName;
      this.firstCardFirstName = this.memberCom.firstName;
      this.firstCardPid = this.memberCom.pid
      this.firstCardYear = this.memberCom.pBirthYear.slice(0, 4);
      this.firstCardMonth = this.memberCom.pBirthMonth;
      this.firstCardDay = this.memberCom.pBirthDay;
      this.dataService.insuredTotal = this.firstCardInsuredPrice;
      this.dataService.insuredTotal.emit(this.dataService.insuredTotal, this.firstCardInsuredPrice);
    }
  }

  birthYears() {
    var date = new Date();
    let limitAge = date.getFullYear() - this.insuredMinAge;
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

  checkRatioAmt(index){
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth() + 1;
    let currentDay = new Date().getDate();
    switch(index){
      case 1:
        if(this.firstCardYear && this.firstCardMonth && this.firstCardDay){
          let userAge = currentYear - this.firstCardYear;
          if((currentMonth >= this.firstCardMonth) && (currentDay >= this.firstCardDay)){
            //生日過今天 保留原本選擇年紀
          } else {
            userAge = userAge - 1;
            //未過今天 年紀扣一歲
          }
          this.rateInfoList.forEach((item) => {
            if((userAge >= item.ageMin) && (userAge <= item.ageMax)){
              this.firstCardInsuredPrice = item.rate;
              this.dataService.insuredTotal = (this.firstCardInsuredPrice +
                                              this.secondCardInsuredPrice +
                                              this.thirdCardInsuredPrice +
                                              this.fourthCardInsuredPrice +
                                              this.fifthCardInsuredPrice +
                                              this.sixthCardInsuredPrice);
            }
          });
        }
        break;

      case 2:
        if(this.secondCardYear && this.secondCardMonth && this.secondCardDay){
          let userAge = currentYear - this.secondCardYear;
          if((currentMonth >= this.secondCardMonth) && (currentDay >= this.secondCardDay)){
            //生日過今天 保留原本選擇年紀
          } else {
            userAge = userAge - 1;
            //未過今天 年紀扣一歲
          }
          this.rateInfoList.forEach((item) => {
            if((userAge >= item.ageMin) && (userAge <= item.ageMax)){
              this.secondCardInsuredPrice = item.rate;
              this.dataService.insuredTotal = (this.firstCardInsuredPrice +
                  this.secondCardInsuredPrice +
                  this.thirdCardInsuredPrice +
                  this.fourthCardInsuredPrice +
                  this.fifthCardInsuredPrice +
                  this.sixthCardInsuredPrice);
            }
          });
        }
        break;

      case 3:
        if(this.thirdCardYear && this.thirdCardMonth && this.thirdCardDay){
          let userAge = currentYear - this.thirdCardYear;
          if((currentMonth >= this.thirdCardMonth) && (currentDay >= this.thirdCardDay)){
            //生日過今天 保留原本選擇年紀
          } else {
            userAge = userAge - 1;
            //未過今天 年紀扣一歲
          }
          this.rateInfoList.forEach((item) => {
            if((userAge >= item.ageMin) && (userAge <= item.ageMax)){
              this.thirdCardInsuredPrice = item.rate;
              this.dataService.insuredTotal = (this.firstCardInsuredPrice +
                  this.secondCardInsuredPrice +
                  this.thirdCardInsuredPrice +
                  this.fourthCardInsuredPrice +
                  this.fifthCardInsuredPrice +
                  this.sixthCardInsuredPrice);
            }
          });
        }
        break;

      case 4:
        if(this.fourthCardYear && this.fourthCardMonth && this.fourthCardDay){
          let userAge = currentYear - this.fourthCardYear;
          if((currentMonth >= this.fourthCardMonth) && (currentDay >= this.fourthCardDay)){
            //生日過今天 保留原本選擇年紀
          } else {
            userAge = userAge - 1;
            //未過今天 年紀扣一歲
          }
          this.rateInfoList.forEach((item) => {
            if((userAge >= item.ageMin) && (userAge <= item.ageMax)){
              this.fourthCardInsuredPrice = item.rate;
              this.dataService.insuredTotal = (this.firstCardInsuredPrice +
                  this.secondCardInsuredPrice +
                  this.thirdCardInsuredPrice +
                  this.fourthCardInsuredPrice +
                  this.fifthCardInsuredPrice +
                  this.sixthCardInsuredPrice);
            }
          });
        }
        break;

      case 5:
        if(this.fifthCardYear && this.fifthCardMonth && this.fifthCardDay){
          let userAge = currentYear - this.fifthCardYear;
          if((currentMonth >= this.fifthCardMonth) && (currentDay >= this.fifthCardDay)){
            //生日過今天 保留原本選擇年紀
          } else {
            userAge = userAge - 1;
            //未過今天 年紀扣一歲
          }
          this.rateInfoList.forEach((item) => {
            if((userAge >= item.ageMin) && (userAge <= item.ageMax)){
              this.fifthCardInsuredPrice = item.rate;
              this.dataService.insuredTotal = (this.firstCardInsuredPrice +
                  this.secondCardInsuredPrice +
                  this.thirdCardInsuredPrice +
                  this.fourthCardInsuredPrice +
                  this.fifthCardInsuredPrice +
                  this.sixthCardInsuredPrice);
            }
          });
        }
        break;

      case 6:
        if(this.sixthCardYear && this.sixthCardMonth && this.sixthCardDay){
          let userAge = currentYear - this.sixthCardYear;
          if((currentMonth >= this.sixthCardMonth) && (currentDay >= this.sixthCardDay)){
            //生日過今天 保留原本選擇年紀
          } else {
            userAge = userAge - 1;
            //未過今天 年紀扣一歲
          }
          this.rateInfoList.forEach((item) => {
            if((userAge >= item.ageMin) && (userAge <= item.ageMax)){
              this.sixthCardInsuredPrice = item.rate;
              this.dataService.insuredTotal = (this.firstCardInsuredPrice +
                  this.secondCardInsuredPrice +
                  this.thirdCardInsuredPrice +
                  this.fourthCardInsuredPrice +
                  this.fifthCardInsuredPrice +
                  this.sixthCardInsuredPrice);
            }
          });
        }
        break;

      default:

    }
  }

  // many many of dummpy variables starts from here!!
  // first card
  firstCardInsuredPrice: number = 0;
  firstCardRelationship: any = "本人";
  firstCardLastName: string = '';
  firstCardFirstName: string = '';
  firstCardPid: string = '';
  firstCardYear: any = '';
  firstCardMonth: any = '';
  firstCardDay: any = '';

  // second card
  secondCardInsuredPrice: number = 0;
  secondCardRelationship: any = "";
  secondCardLastName: string = '';
  secondCardFirstName: string = '';
  secondCardPid: string = '';
  secondCardYear: any = '';
  secondCardMonth: any = '';
  secondCardDay: any = '';

  // third card
  thirdCardInsuredPrice: number = 0;
  thirdCardRelationship: any = "";
  thirdCardLastName: string = '';
  thirdCardFirstName: string = '';
  thirdCardPid: string = '';
  thirdCardYear: any = '';
  thirdCardMonth: any = '';
  thirdCardDay: any = '';

  // fourth card
  fourthCardInsuredPrice: number = 0;
  fourthCardRelationship: any = "";
  fourthCardLastName: string = '';
  fourthCardFirstName: string = '';
  fourthCardPid: string = '';
  fourthCardYear: any = '';
  fourthCardMonth: any = '';
  fourthCardDay: any = '';

  // fifth card
  fifthCardInsuredPrice: number = 0;
  fifthCardRelationship: any = "";
  fifthCardLastName: string = '';
  fifthardFirstName: string = '';
  fifthCardPid: string = '';
  fifthCardYear: any = '';
  fifthCardMonth: any = '';
  fifthCardDay: any = '';

  // sixth card
  sixthCardInsuredPrice: number = 0;
  sixthCardRelationship: any = "";
  sixthCardLastName: string = '';
  sixthCardFirstName: string = '';
  sixthCardPid: string = '';
  sixthCardYear: any  = '';
  sixthCardMonth: any = '';
  sixthCardDay: any = '';

}
