import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../shared/services/analytics.services';
import { Observable } from 'rxjs';
import { OverviewPage } from '../shared/interfaces';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.css']
})
export class OverviewPageComponent implements OnInit {

  data$: Observable<OverviewPage>

  constructor(private service:  AnalyticsService) { }

  ngOnInit() {
    console.log('mda ')
    // получаем все данные которые относятся к данной старнице
    this.data$ = this.service.getOverview()
  }

}
