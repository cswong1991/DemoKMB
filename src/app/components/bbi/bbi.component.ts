import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bbi',
  templateUrl: './bbi.component.html',
  styleUrls: ['./bbi.component.css']
})
export class BbiComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getBBIs();
  }

  @Input() QPs: { [key: string]: any } = {};
  public dataSource: { [key: string]: any }[] = [];
  public displayedColumns: string[] = ['route', 'destination', 'discount'];

  public getBBIs(): void {
    this.http.get<{ [key: string]: any }>(
      'https://search.kmb.hk/KMBWebSite/Function/FunctionRequest.ashx?action=getbbiforroute&route=' +
      this.QPs['route'] +
      '&bound=' +
      (this.QPs['bound'] == 'I' ? '0' : '1')
    ).subscribe(res => {
      this.dataSource = res['data']['BBIs'];
    });
  }

}
