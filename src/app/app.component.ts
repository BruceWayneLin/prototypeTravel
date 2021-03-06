import {Component} from '@angular/core';
import {DataServiceService} from '../../src/app/services/data-service.service';

declare var jquery:any;
declare var $ :any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loading: boolean = false;

  constructor(
    private dataService: DataServiceService
  ) {
  }
  ngOnInit() {
  }

  AlertArr(){
    return this.dataService.AlertTXT;
  }

  ngAfterViewInit() {
    this.detectScrollAndHeaderChange();
  }

  ifItsLoading(){
    this.loading = this.dataService.loading;
    return this.loading;
  }

  cancelThisModal(){
    var modal = document.getElementById('myModal');
    modal.style.display = "none";
  }

  detectScrollAndHeaderChange() {
   $(document).on('scroll', function(){
     if($(document).scrollTop() > 400){
       $('header').css({
         'background-color': 'white',
         'color': '#999'
       });
       $('.memberBtn').css({
         'background-color': 'rgba(255, 255, 255, 0.83)',
         'color': 'rgb(153, 153, 153)',
         'border': '1px solid'
       });
       $('.logo').css({
         'background': 'url(assets/images/logos/carelineBlack.png)',
         'background-repeat': 'no-repeat',
         'background-size': 'contain',
       });

     } else {
       $('.logo').css({
         'background': 'url(assets/images/logos/carelineWhite.png)',
         'background-repeat': 'no-repeat',
         'background-size': 'contain',
       });
       $('header').css({
         'background-color': 'rgba(0, 0, 0, 0.48)',
         'color': 'white'
       });
       $('.memberBtn').css({
         'background-color': 'transparent',
         'color': 'white',
         'border': '1px solid white'
       });
     }
   });
  }
}
