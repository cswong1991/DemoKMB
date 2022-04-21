import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit, OnDestroy {

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.qpSubscription = this.activatedRoute.queryParams.pipe(
      filter(value => value.hasOwnProperty('route') && value.hasOwnProperty('bound') && value.hasOwnProperty('service_type'))
    ).subscribe(
      value => {
        this.QPs = value;
        this.getStops();
      }
    );
  }

  ngOnDestroy(): void {
    this.qpSubscription.unsubscribe();
  }

  public getStops(): void {
    this.http.get<{ [key: string]: any }>(
      'https://search.kmb.hk/KMBWebSite/Function/FunctionRequest.ashx?action=getstops&route=' +
      this.QPs['route'] +
      '&bound=' +
      (this.QPs['bound'] == 'I' ? '0' : '1') +
      '&serviceType=' +
      this.QPs['service_type']
    ).subscribe(res => {
      this.routeDetail = res['data'];

      let temp: { [key: string]: any }[] = JSON.parse(JSON.stringify(res['data']['routeStops']));
      temp.forEach(e1 => {
        e1['Seq'] = parseInt(e1['Seq']) + 1;
        e1['AirFare'] = parseFloat(e1['AirFare']);
      });
      this.dataSource = temp;
    });
  }

  private qpSubscription!: Subscription;
  public QPs: { [key: string]: any } = {};

  public routeDetail: { [key: string]: any } = {};
  public dataSource: { [key: string]: any }[] = [];

}