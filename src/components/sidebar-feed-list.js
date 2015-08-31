import h from 'virtual-dom/h';
import {Observable} from 'rx';

import {clicksByClass_} from '../events';
import {dataAttrAsClass} from '../utils';
import {feeds_} from '../models/feeds';

let feedFilters_ = () => {
  let widgetClicks_ = clicksByClass_('filter-posts');

  let filters_ = widgetClicks_
    .map(e => e.target)
    .map(el => dataAttrAsClass('filter', el))
    .do(x => console.log(x));

    return filters_;
};

let selectedFeedUrl_ = () =>
      clicksByClass_('sidebar-feed')
      .do(e => e.preventDefault())
      .map(e => e.target.href.split('/').reverse()[0] === 'all-feeds'
           ? null
           : e.target.href);
           

let nodeView = (feed, extraClasses) =>
  <li className="sidebar-feedlist-item">
    <a className={extraClasses + ' sidebar-feed'} href={feed.url}>{feed.name}</a>
  </li>
  ;

let view = (feedViews) => 
  <ul className="sidebar-feedlist">
    {nodeView({url: 'all-feeds', name: 'All'}, 'active')}
    {feedViews}
  </ul>
  ;

let render_ = () => {
  let selectFeedClicks_ = clicksByClass_('sidebar-feed');
  selectFeedClicks_
    .do(e => e.preventDefault())
    .do(e => {
        let activeEl = document.querySelector('.sidebar-feed.active');
        if(activeEl) activeEl.classList.remove('active');

        e.target.classList.add('active');
    })
    .subscribe();

  return feeds_
    .startWith([])
    .map(feeds => feeds.map(nodeView))
    .map(view);
}

export default render_;
export {selectedFeedUrl_};
