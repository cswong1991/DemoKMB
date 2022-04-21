import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-stop-list',
  templateUrl: './stop-list.component.html',
  styleUrls: ['./stop-list.component.css']
})
export class StopListComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getRouteETA();
    this.tSubscription = this.sInterval.subscribe(() => this.getRouteETA());
  }

  ngOnDestroy(): void {
    this.tSubscription.unsubscribe();
  }

  @Input() QPs: { [key: string]: any } = {};
  @Input() dataSource: { [key: string]: any }[] = [];
  public displayedColumns: string[] = ['no', 'cb', 'stop'];

  private ETAs: { [key: string]: any }[] = [];
  private sInterval = interval(20000);
  private tSubscription!: Subscription;

  public getRouteETA(): void {
    this.http.get<{ [key: string]: any }>(
      'https://data.etabus.gov.hk/v1/transport/kmb/route-eta/' +
      this.QPs['route'] + '/' + this.QPs['service_type']
    ).subscribe(res => {
      let now = new Date()
      this.ETAs = res['data'];
      this.ETAs.forEach(e1 => {
        let thisETA = new Date(e1['eta']);
        let minuteLeave = Math.round((thisETA.getTime() - now.getTime()) / 60 / 1000);
        e1['emta'] = minuteLeave > 0 ? minuteLeave : 0;
      });
    })
  }

  public getStopETA(index: number): { [key: string]: any }[] {
    return this.ETAs.filter(e1 => e1['seq'] == index);
  }

  public endStopSeq: number = 0;

  public checkChange(event: any, index: number): void {
    this.endStopSeq = (event.checked) ? index : 0;
  }

  public calDrive(): string {
    try {
      let totalDrive = 0;
      for (let i = 1; i < this.endStopSeq + 1; i++) {
        let startStopETAs = this.ETAs.filter(e1 => e1['seq'] == i);
        let nextStopETAs = this.ETAs.filter(e1 => e1['seq'] == i + 1);

        if (startStopETAs[0]['eta'] == null) {
          throw new Error("eta == null");
        }
        let thisStartDate = new Date(startStopETAs[0]['eta']);

        nextStopETAs.some(e1 => {
          if (e1['eta'] == null) {
            throw new Error("eta == null");
          }
          let thisNextDate = new Date(e1['eta']);
          if (thisNextDate > thisStartDate) {
            totalDrive = totalDrive + (thisNextDate.getTime() - thisStartDate.getTime()) / 60 / 1000;
            return true;
          } else {
            return false;
          }
        })
      }
      return '車程約' + Math.ceil(totalDrive).toString() + '分鐘';
    } catch (error) {
      return 'Unable to cal totalDrive';
    }
  }

}
