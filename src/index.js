import mainView_ from './components/main';
import render from './renderer';

require('./styles/styles.scss');

let view_ = mainView_();

render(view_, document.getElementById('app'));