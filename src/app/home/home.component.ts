import { Call } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { API_SCOPE } from '../msal/scopes';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loginDisplay = false;
  welcome : String =  ""
  check = false;
  show = false;
  constructor(private authService: MsalService, private msalBroadcastService: MsalBroadcastService, private service: ServiceService) { }

  ngOnInit(): void {
    //get value returned by login event and check if it's succefull.
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
      )
      .subscribe((result: EventMessage) => {
        this.setLoginDisplay();
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None)
      )
      .subscribe((result) => {
        this.setLoginDisplay();
      })

  }

  //set loginDisplay variable True if the list returned got at leat one element
  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }


  //get ressource by using Msal interceptor
  Callapi1() {
    this.show =false;
    this.check = true;
    this.service.callAPiWithInterceptor().subscribe((resp : any) => {
      this.welcome = resp.name;
      this.show = true;
    })
  }

    //get ressource by using methode 
    Callapi() {
      this.show =false;
      this.check = true;
      var request  = {"scopes" : API_SCOPE}
      this.service.callAPi( this.service.getToken(request)).subscribe((resp) => {
        this.welcome = resp.name;
        this.show = true;
      })
    }
}
