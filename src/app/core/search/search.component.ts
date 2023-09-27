import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'search-box',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Output() text = new EventEmitter<any>();
  @Input() placeholder = 'PROFILE.SEARCH';
  constructor() { }

  ngOnInit() {
  }

  searchAction(text: any) {
    
    this.text.emit(text);
  }

}
