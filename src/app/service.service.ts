import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { b2cPolicies } from './b2cConfig';
import { API_SCOPE } from './msal/scopes';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private authservice: MsalService , private http : HttpClient) { }

  getAccount(): any {
    const currentAccounts = this.authservice.instance.getAllAccounts();
    if (currentAccounts.length < 1) {
      return;
    } else if (currentAccounts.length > 1) {

      const accounts = currentAccounts.filter((account: any) =>
        account.homeAccountId.toUpperCase().includes(b2cPolicies.names.signUpSignIn.toUpperCase())
        &&
        account.idTokenClaims.iss.toUpperCase().includes(b2cPolicies.authorityDomain.toUpperCase())
        &&
        account.idTokenClaims.aud === environment.clientId
      );

      if (accounts.length > 1) {
        // localAccountId identifies the entity for which the token asserts information.
        if (accounts.every(account => account.localAccountId === accounts[0].localAccountId)) {
          //if all accounts belong to the same user
          return accounts[0];
        } else {
          // Multiple users detected. Logout all to be safe.
          this.authservice.logoutRedirect();
        };
      } else if (accounts.length === 1) {
        return accounts[0];
      }

    } else if (currentAccounts.length === 1) {
      return currentAccounts[0];
    }
  }

  //get acess token with silent call
  getToken(request : any) {

    //get account info
    request.account = this.authservice.instance.getAccountByHomeId(this.getAccount().homeAccountId);
    //silent call
    
    return this.authservice.acquireTokenSilent(request)
      .subscribe((response) => {
        console.log(response)
        // In case the response from B2C server has an empty accessToken field
        // throw an error to initiate token acquisition
        if (!response.accessToken || response.accessToken === "") {
          throw new InteractionRequiredAuthError;
        }
        return response.accessToken;
      });
  }

  callAPi(token : any) : Observable<any>{
    const bearer = `Bearer ${token}`;
    return this.http.get<any>(environment.webApi ,{headers : {"Authorization": bearer}})
  }

  callAPiWithInterceptor() : Observable<any>{
    return this.http.get<any>(environment.webApi)
  }
}
