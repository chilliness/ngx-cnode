import { Component, OnDestroy, Inject } from '@angular/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnDestroy {
  [x: string]: any;

  constructor(@Inject('share') private share$) {
    this['confirm$'] = this.share$.confirm.subscribe(({ title = '提示', msg = '', cancelText = '取消', confirmText = '确定', cancel = () => {}, confirm = () => {} }) => {
      this['title'] = title;
      this['msg'] = msg;
      this['cancel'] = cancel;
      this['confirm'] = confirm;
      this['cancelText'] = cancelText;
      this['confirmText'] = confirmText;
    });
  }

  ngOnDestroy() {
    this.confirm$.unsubscribe();
  }

  handleClose(type = 'cancel') {
    this['msg'] = '';
    this[type]();
  }
}
