import {Component, OnInit, ViewChild} from '@angular/core';
import {Accordion} from "ngx-accordion";
declare var jquery:any;
declare var $ :any;
@Component({
  selector: 'app-confirm-info',
  templateUrl: './confirm-info.component.html',
  styleUrls: ['./confirm-info.component.css']
})

export class ConfirmInfoComponent implements OnInit {
  isExpandAll: boolean = false;
  @ViewChild(Accordion) MyAccordion: Accordion;

  constructor() {
    $('html, body').animate({scrollTop: '0px'}, 0);
  }

  ngOnInit() {
  }

  doSomethingOnClose() {

    this.MyAccordion.closeAll();
    $('html, body').animate({
      scrollTop: $("#thisFocusDiv").offset().top
    }, 300);
  }

}
