import {feeds_} from './feeds';
import {Observable} from 'rx';

let posts_ = Observable
      .fromPromise(Posts.orderBy('publishedDate').reverse().toArray());

export default {posts_};