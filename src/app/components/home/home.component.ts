import { Component, OnInit } from '@angular/core';
import _ from 'lodash';
import { SpotifyService } from '../../services/spotify.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {

  newSongs: any[] = [];
  loading: boolean;
  error: boolean;
  errorMessage: string;
  private loginForm: FormGroup;

  constructor(private spotify: SpotifyService, private router: Router) {
    this.loading = true;
    this.error = false;
    this.loginForm = new FormGroup({
      clientID: new FormControl(),
      clientSecret: new FormControl()
    });

    this.loadReleases();
  }

  ngOnInit() {
  }

  loadReleases() {
    this.spotify.getNewReleases()
      .subscribe((data: any) => {
        this.newSongs = data;
        this.loading = false;
      }, (reason) => {
        this.loading = false;
        this.error = true;
        if (_.has(reason, 'error.error.message')) {
          this.errorMessage = reason.error.error.message;
        } else {
          this.errorMessage = 'Unkown error';
        }
      });
  }

  login() {
    this.loading = true;
    const clientId = this.loginForm.get('clientID').value;
    const clientSecret = this.loginForm.get('clientSecret').value;
    this.spotify.login(clientId, clientSecret)
      .subscribe((response: any) => {
        this.loading = false;
        this.error = false;
        this.loadReleases();
      });
  }

}
