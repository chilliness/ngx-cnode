import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit {

  @Input() nowPos = 0;
  @Input() minPos = -150;

  @Output() top = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onResetTop() {
    this.top.emit();
  }

}
