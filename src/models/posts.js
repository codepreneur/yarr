import {Observable} from 'rx';
import {Posts, reactiveDexieTable_} from '../db';

let markPostAsRead_ = (post) => Posts.update(post, {read: 'true'});

let posts_ = Observable
      .merge(
        reactiveDexieTable_(Posts, 'creating'),
        reactiveDexieTable_(Posts, 'updating'),
        reactiveDexieTable_(Posts, 'deleting')
      )
      .startWith('')
      .flatMap(() => Posts.orderBy('publishedDate').reverse().toArray());

export default {posts_, markPostAsRead_};