import { Component, OnInit, OnDestroy, Inject } from '@angular/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit, OnDestroy {
  [x: string]: any;
  title = '';
  cancelText = '';
  confirmText = '';
  msg = '';
  cancel = () => { };
  confirm = () => { };

  constructor(@Inject('share') private share$) { }

  ngOnInit() {
    this.seller$confirm = this.share$.confirm.subscribe(({ title, cancelText, confirmText, msg, cancel, confirm }) => {
      this.title = title;
      this.cancelText = cancelText;
      this.confirmText = confirmText;
      this.msg = msg;
      this.cancel = cancel;
      this.confirm = confirm;
    });
  }

  ngOnDestroy() {
    this.seller$confirm.unsubscribe();
  }

  handleClose(type = 'cancel') {
    this.msg = '';
    this[type]();
  }
}
