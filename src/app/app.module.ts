import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { b2cPolicies } from './b2cConfig';
import { API_SCOPE, GRAPH_API_SCOPE } from './msal/scopes';
import { NgModel } from '@angular/forms';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1

@NgModule({

  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    HttpClientModule,
    MsalModule.forRoot(new PublicClientApplication({
      auth: {
        clientId: environment.clientId,
        authority: b2cPolicies.authorities.signUpSignIn.authority,
        redirectUri: "http://localhost:4200",
        knownAuthorities: [b2cPolicies.authorityDomain],
        //validateAuthority: true,
        //postLogoutRedirectUri: "your_app_logout_redirect_uri"
      },
      cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true
      }
    }), {
      interactionType: InteractionType.Popup, // MSAL Guard Configuration
      //Scopes you add here will be prompted for user consent during sign-in.
      authRequest: {
        scopes: [...GRAPH_API_SCOPE  , ...GRAPH_API_SCOPE]
      }
    }, {
      interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
      protectedResourceMap: new Map([
        [environment.webApi, API_SCOPE]
      ])
    }),

  ],
  providers: [MsalGuard, {
    provide: HTTP_INTERCEPTORS,
    useClass: MsalInterceptor,
    multi: true
  },],// MsalGuard added as provider here
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
