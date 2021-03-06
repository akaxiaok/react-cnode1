import fetch from 'isomorphic-fetch';
import { config } from '../Tool';

const server = config;

export function startFetch(type) {
  const target = {
    loadAnimation: true,
    loadMsg: '正在加载中...',
  };
  return {
    type, target,
  };
}

export function endFetch(type) {
  const target = {
    loadAnimation: false,
    loadMsg: '上拉加载更多',
  };
  return {
    type, target,
  };
}

export function setScroll(x, y) {
  const target = {
    scrollX: x,
    scrollY: y,
  };
  return {
    type: 'setScroll', target,
  };
}

export function nomoreData() {
  const target = {
    loadAnimation: false,
    loadMsg: '没有了',
  };
  return {
    type: 'setStatus', target,
  };
}

export function fetchError(type) {
  const target = {
    loadAnimation: false,
    loadMsg: '加载失败',
  };
  return {
    type, target,
  };
}

export function setStatus(newTab, oldTab) {
  const target = { tab: newTab };
  return function (dispatch) {
    dispatch({ type: 'setIndexStatus', target });
    if (oldTab) {
      dispatch({ type: 'clearList', target: { tab: oldTab } });
    }
  };
}

export function getNextPage(data, page) {
  return function (dispatch) {
    const { limit, mdrender, tab, url } = data;
    dispatch(startFetch('setIndexStatus'));
    return fetch(`${server.target}${url}?page=${page}&limit=${limit}&mdrender=${mdrender}&tab=${tab}`).then((response) => {
      if (response.status >= 400) {
        throw new Error('Bad response from server');
      }
      return response.json();
    }).then((json) => {
      const target = { data: json.data };
      target.tab = tab;
      dispatch({ target, type: 'setData' });
      dispatch(endFetch('setIndexStatus'));
    }).catch(() => {
      dispatch(fetchError('setIndexStatus'));
    });
  };
}


function get(data) {
  return function (dispatch) {
    dispatch(startFetch('setPageStatus'));
    const { mdrender, id, accesstoken } = data;
    return fetch(`${server.target}/api/v1/topic/${id}?mdrender=${mdrender}&accesstoken=${accesstoken}`).then((response) => {
      if (response.status >= 400) {
        throw new Error('Bad response from server');
      }
      return response.json();
    }).then((json) => {
      const target = { data: json.data };
      target.id = id;
      dispatch({ target, type: 'getTopic' });
      dispatch(endFetch('setPageStatus'));
    }).catch((e) => {
      console.log(e.stack);
      dispatch(fetchError('setPageStatus'));
    });
  };
}

function replyTopic(data) {
  return function (dispatch) {
    return fetch(`${server.target}/api/v1//topic/${data.id}/replies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.status >= 400) {
        throw new Error('Bad response from server');
      }
      return response.json();
    }).then((json) => {
      if (json.success === true) {
        dispatch(get(data));
      }
    }).catch((e) => {
      console.log(e.stack);
    });
  };
}

function getMessage(data) {
  return function (dispatch) {
    dispatch(startFetch('setMessageStatus'));
    const { mdrender, url, accesstoken } = data;
    return fetch(`${server.target}${url}?mdrender=${mdrender}&accesstoken=${accesstoken}`).then((response) => {
      if (response.status >= 400) {
        throw new Error('Bad response from server');
      }
      return response.json();
    }).then((json) => {
      const target = { data: json.data };
      target.url = url;
      dispatch({ target, type: 'getMessage' });
      dispatch(endFetch('setMessageStatus'));
    }).catch((e) => {
      console.log(e.stack);
      dispatch(fetchError('setMessageStatus'));
    });
  };
}

function getUserView(data) {
  return function (dispatch) {
    dispatch(startFetch('setUserViewStatus'));
    const { url } = data;
    return fetch(`${server.target}${url}`).then((response) => {
      if (response.status >= 400) {
        throw new Error('Bad response from server');
      }
      return response.json();
    }).then((json) => {
      const target = { data: json.data };
      target.url = url;
      dispatch({ target, type: 'setUserView' });
      dispatch(endFetch('setUserViewStatus'));
    }).catch((e) => {
      console.log(e.stack);
      dispatch(fetchError('setUserViewStatus'));
    });
  };
}

export default (ID) => {
  if (ID === 'Topic') {
    return { get, replyTopic };
  }
  if (ID === 'Messages') {
    return { getMessage };
  }
  if (ID === 'UserView') {
    return { getUserView };
  }
  const action = {};
  const arr = [
    'signInSuccess', // 登录成功
    'signOut', // 退出登录
    'setState', // 设置状态
  ];
  for (let i = 0; i < arr.length; i += 1) {
    action[arr[i]] = target => ({ target, type: arr[i], ID });
  }
  return action;
};
