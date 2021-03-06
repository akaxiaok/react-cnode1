import React from 'react';
import 'normalize.css'; // 重置浏览器默认样式
import 'github-markdown-css'; // markdown css
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import route from './Config/Route'; // 路由配置
import store from './Config/Store';
import './Style/style.less'; // 加载公共样式
import './Iconfont/iconfont.css'; // 字体图标

store.subscribe(() => {
  // console.log(store.getState());
});

injectTapEventPlugin();
// eslint-disable-next-line no-undef
const div = document.createElement('div');
div.style.height = '100%';
render(
  <Provider store={store} >
    {route}
  </Provider >,
// eslint-disable-next-line no-undef
  document.body.appendChild(div),
);
