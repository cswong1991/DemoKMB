import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.http.get<{ [key: string]: any }>('https://data.etabus.gov.hk/v1/transport/kmb/route/').subscribe(
      value => this.routeIndex = value['data']
    )

    let savedHistory = localStorage.getItem('history');
    this.searchHistory = (savedHistory == null) ? [] : JSON.parse(savedHistory);
  }

  private routeIndex: { [key: string]: any }[] = [];
  public searchHistory: string[] = [];
  public displayedColumns: string[] = ['route', 'orig_tc', 'dest_tc'];
  public dataSource: { [key: string]: any }[] = [];

  public applyFilter(filterValue: string): void {
    if (filterValue != "") {
      this.dataSource = this.routeIndex.filter((e1: { [key: string]: any }) => {
        return e1['route'].includes(filterValue);
      });
      if (this.dataSource.length > 0) {
        this.addHistory(filterValue);
      } else {
        alert('No Results');
      }
    }
  }

  public genSHOpts(filterValue: string): string[] {
    return this.searchHistory.filter(e1 => e1.includes(filterValue));
  }

  public addHistory(route: string): void {
    this.searchHistory.unshift(route);
    this.searchHistory = [...new Set(this.searchHistory)];
    localStorage.setItem('history', JSON.stringify(this.searchHistory));
  }

  public removeHistory(index: number): void {
    this.searchHistory.splice(index, 1);
    localStorage.setItem('history', JSON.stringify(this.searchHistory));
  }

  public removeAllHistory(): void {
    this.searchHistory = [];
    localStorage.removeItem('history');
  }

}
