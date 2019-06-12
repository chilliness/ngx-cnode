import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const toastConfig = { msg: '', callback() { } };
const confirmConfig = {
  title: '提示',
  cancelText: '取消',
  confirmText: '确定',
  msg: '',
  cancel() { },
  confirm() { }
};

@Injectable()
export class ShareService {
  data = new BehaviorSubject([]);
  user = new BehaviorSubject({});
  collect = new BehaviorSubject({});
  toast = new BehaviorSubject(toastConfig);
  confirm = new BehaviorSubject(confirmConfig);

  constructor() { }

  handleSetData(val) {
    this.data.next(val);
  }

  handleSetUser(val) {
    this.user.next(val);
  }

  handleSetCollect(val) {
    this.collect.next(val);
  }

  handleSetToast(val) {
    this.toast.next({ ...toastConfig, ...val });
  }

  handleSetConfirm(val) {
    this.confirm.next({ ...confirmConfig, ...val });
  }
}
