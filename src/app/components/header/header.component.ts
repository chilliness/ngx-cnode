import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() isHome = false;

  @Output() emitToggle = new EventEmitter();

  handleClick() {
    if (this.isHome) {
      return this.emitToggle.emit();
    }
    history.back();
  }
}
