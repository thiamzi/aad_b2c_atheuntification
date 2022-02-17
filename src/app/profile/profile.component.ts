import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { SilentRequest } from '@azure/msal-browser';
import { b2cPolicies } from '../b2cConfig';
import { ServiceService } from '../service.service';

type ProfileType = {
  name?: string,
  username?: string,
  id?: any
};

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profile: ProfileType = {};
  request!: SilentRequest

  constructor(
    private http: HttpClient, private authservice: MsalService , private service : ServiceService
  ) { }

  ngOnInit() {
    this.setprofile(this.service.getAccount());
  }

  setprofile(acount: any) {
    console.log(acount);
    this.profile.name = acount.name
    this.profile.username = acount?.username
    this.profile.id = acount?.localAccountId
  }

  // To initiate a B2C user-flow, simply make a login request using
  editProfile() {
    const editProfileRequest: any = b2cPolicies.authorities.editProfile;
    //get login hint, the user name
    editProfileRequest.loginHint = this.authservice.instance.getAccountByHomeId(this.profile.id)?.username;

    this.authservice.loginPopup(editProfileRequest).subscribe(_ => {

    }, err => { console.log(err) })
  }
}
