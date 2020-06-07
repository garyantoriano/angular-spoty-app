import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  authorization: string;
  utilsRestApi: string;
  spotifyUrl: string;

  constructor(private http: HttpClient) {
    console.log('Spotify Service started');
    this.utilsRestApi = 'http://localhost:3000';
    this.spotifyUrl = 'https://api.spotify.com/v1';
  }

  getQuery(query: string) {
    const url = `${this.spotifyUrl}/${query}`;
    const headers = new HttpHeaders({
      Authorization: this.authorization
    });
    if (!this.authorization) {
      console.log('is not loged');
    }

    return this.http.get(url, { headers });
  }

  getNewReleases() {
    return this.getQuery('browse/new-releases?limit=20')
      .pipe(map((data: any) => {
        console.log(data);
        return data.albums.items;
      }));
  }

  getArtists(term: string) {
    return this.getQuery(`search?q=${term}&type=artist&limit=15`)
      .pipe(map((data: any) => data.artists.items));
  }

  getArtist(id: string) {
    return this.getQuery(`artists/${id}`);
    // .pipe(map((data: any) => data.artists.items));
  }

  getTopTracks(id: string) {
    return this.getQuery(`artists/${id}/top-tracks?country=US`)
      .pipe(map((data: any) => data.tracks));
  }

  login(clientId, clientSecret) {
    const body = {
      client_id: clientId,
      client_secret: clientSecret
    };

    const getLoginResponse = this.http.post(this.utilsRestApi + '/spotify/login', body);
    getLoginResponse
      .subscribe((response: any) => {
        this.authorization = `${response.token_type} ${response.access_token}`;
      });

    return getLoginResponse;
  }
}
