import h from 'virtual-dom/h';
import {Observable} from 'rx';

import {posts_} from '../models/posts';
import {formatDate} from '../utils';
import {clicksByClass_} from '../events';
import {markPostAsRead_} from '../models/posts';

let readPost_ = () => {
  let readPostClicks_ = clicksByClass_('post-title');
  return readPostClicks_
      .do(e => e.preventDefault())
      .map(e => e.target.href)
      .flatMap(link => Posts.get(link))
      .do(markPostAsRead_)
      .startWith('');
}

let postView = (post) =>
    <article className="post-item post">
      <header className="post-item-header">
        <h2 className="post-item-title">
          <a className='post-title' href={post.link}>{post.title}</a>
          </h2>
      </header>
      <section className="post-item-excerpt">
        {post.contentSnippet}
      </section>

      <footer className="post-item-footer">
        <ul className="post-item-meta-list">
          <li className="post-item-meta-item">
            <p><a href={post.link}>{post.author}</a>
            </p>
          </li>

          <li className="post-item-meta-item">
            <p>
              {formatDate(post.publishedDate)}
            </p>
          </li>

          <li className="post-item-meta-item">
            <p itemprop="articleSection">{post.categories.join(', ')}</p>
          </li>
        </ul>
      </footer>
    </article>
  ;


let view = (postViews) =>
  <section className="post-list">
    {postViews}
  </section>
  ;

  let render_ = (feedFilters_) =>
    Observable
    .combineLatest(
      posts_,
      feedFilters_(),
      (posts, filters) => posts.filter(post => {
        let result = true;
        let checks = Object.keys(filters);
        for(let key of checks) {
          if(post[key] !== filters[key])
            result = false;
        }

        return result;
      })
    )
    .map(posts => posts.map(postView))
    .map(view)
    .startWith(view());

export default render_;
export {readPost_};