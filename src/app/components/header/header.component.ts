import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() isHome = false;

  @Output() toggle = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  handleClick() {
    if (this.isHome) {
      return this.toggle.emit();
    }
    history.back();
  }
}
