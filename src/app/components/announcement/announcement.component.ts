import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css']
})
export class AnnouncementComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getAnnouncements();
  }

  @Input() QPs: { [key: string]: any } = {};
  public announcements: { [key: string]: any }[] = [];

  public getAnnouncements(): void {
    this.http.get<{ [key: string]: any }>(
      'https://search.kmb.hk/KMBWebSite/Function/FunctionRequest.ashx?action=getAnnounce&route=' +
      this.QPs['route'] +
      '&bound=' +
      (this.QPs['bound'] == 'I' ? '0' : '1')
    ).subscribe(res => {
      this.announcements = res['data'];
    });
  }

}
