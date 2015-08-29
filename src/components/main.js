import h from 'virtual-dom/h';
import {Observable} from 'rx';

import postsList_ from './posts-list';

let view = (postsList) => {
return <div id='container' className='container'>
        <div className="surface">
          <div className="surface-container">
            <div className="content">
              <div className="wrapper">
                <div className="wrapper-container">{postsList}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
}

let render_ = () => Observable.combineLatest(
    postsList_(),
    view
);

export default render_;