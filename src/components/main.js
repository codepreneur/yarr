import h from 'virtual-dom/h';
import {Observable} from 'rx';

import postsList_ from './posts-list';
import sidebar_, {feedFilters_} from './sidebar';

feedFilters_() //these two lines are for testing only. Remove them before moving ahead
  .subscribe(x => console.log(x));

let view = (postsList, sidebar) => {
return <div id='container' className='container'>
        <div className="surface">
          <div className="surface-container">
            <div className="content">
              <aside className="cover">{sidebar}</aside>
              <div className="wrapper">
                <div className="wrapper-container">{postsList}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
}

let render_ = () => Observable.combineLatest(
  postsList_(feedFilter_),
  sidebar_(),
  view
);

export default render_;