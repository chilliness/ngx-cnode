import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpService {

  constructor(private $http: HttpClient) { }

  get(url: string, params?: Object): Observable<any> {
    return this.$http.get(url, params);
  }

  post(url: string, body?: Object): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' });

    return this.$http.post(url, fnToString(body), { headers });
  }

}

export function fnToString(obj) {
  const arr = [];
  for (const [key, val] of Object.entries(obj)) {
    arr.push(`${key}=${val}`);
  }
  return arr.join('&');
}

const host = 'https://cnodejs.org/api/v1/';
export const $api = {
  topics: `${host}topics`,
  topic: `${host}topic/`,
  user: `${host}user/`,
  topic_collect: `${host}topic_collect/`,
  accesstoken: `${host}accesstoken`,
  messages: `${host}messages`,
  count: `${host}message/count`,
  mark_all: `${host}message/mark_all`,
  mark_one: `${host}message/mark_one/`,
  collect: `${host}topic_collect/collect`,
  de_collect: `${host}topic_collect/de_collect`,
  ups: `${host}reply/`,
  replies: `${host}topic/`,
  tip: '参数有误或网络故障',
  code: true
};
