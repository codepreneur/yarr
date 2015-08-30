import {Observable} from 'rx';
import {ajax} from 'jQuery';
import {Feeds, reactiveDexieTable_} from '../db';

let feedUrls = [
  'https://hacks.mozilla.org/category/es6-in-depth/feed/',
  'http://feeds.feedburner.com/JohnResig',
  'http://unisonweb.org/feed.xml'
];

let fetchFeed = (url) => {
  return ajax({
    url: `http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=30&q=${url}`,
    dataType: 'jsonp'
  }).promise();
};

let addPostToDb = (post, feedUrl) => {
  post.read = 'false';
  post.publishedDate = new Date(post.publishedDate);
  post.feedUrl = feedUrl;
  return Posts.add(post);
};

let addFeed_ = (feedUrl) => Observable
      .of(feedUrl)
      .flatMap(fetchFeed)
      .flatMap(data => {
        let feed = data.responseData.feed;
        let entries = feed.entries;

        let addFeedP =  Feeds.add({
          url: feed.feedUrl,
          name: feed.title,
          source: feed.link,
          description: feed.description
        });

        return Observable
          .fromPromise(addFeedP)
          .flatMap(() => Observable.from(entries))
          .flatMap(p => addPostToDb(p, feed.feedUrl));
      });

Observable
  .fromPromise(Feeds.count())
  .flatMap(count => {
    let urls = count === 0 ? feedUrls : [];
    return Observable.from(urls);
  })
  .flatMap(addFeed_)      
  .subscribe(
    x => console.log('Succesfully added ', x),
    e => console.log('Error while adding feed: ', e)
  );

let feeds_ = Observable
      .merge(
        reactiveDexieTable_(Feeds, 'creating'),
        reactiveDexieTable_(Feeds, 'updating'),
        reactiveDexieTable_(Feeds, 'deleting')
      )
      .startWith('')
      .flatMap(() => Feeds.toArray()).share();

export {feeds_};      