import { Component, ViewChild, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { debounceTime, filter, distinctUntilChanged, map } from 'rxjs/operators';
import { fromEvent, Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('search')
  input: ElementRef;

  search$ = new Subject<string>();

  ngOnInit(): void {
    this.search$
      .pipe(
        filter(content => Boolean(content.trim())),
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(result => console.log(result));
  }

  ngAfterViewInit() {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        map((event: Event) => (event.currentTarget as HTMLInputElement).value),
        filter(content => Boolean(content.trim())),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(content => {
        console.log('fromEvent', content);
      });
  }

  onKeyup(content: string) {
    this.search$.next(content);
  }
}
