import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ShareService {
  data = new BehaviorSubject([]);
  user = new BehaviorSubject({});
  collect = new BehaviorSubject({});
  toast = new BehaviorSubject({});
  confirm = new BehaviorSubject({});

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
    this.toast.next(val);
  }

  handleSetConfirm(val) {
    this.confirm.next(val);
  }
}
