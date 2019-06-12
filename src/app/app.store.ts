
import session from './utils/storage';

// 备注，switch返回的值要和state初始值对应
export function appReducer(
  state = {
    isLogin: session.get('isLogin', 0),
    user: session.get('user', {})
  },
  action: { type: string, payload?: any }
) {
  switch (action.type) {
    case 'login':
      const isLogin = session.set('isLogin', action.payload);
      !action.payload && session.clear();
      return { ...state, isLogin };

    case 'user':
      const user = session.set('user', action.payload);
      return { ...state, user };

    default:
      return state;
  }
}
