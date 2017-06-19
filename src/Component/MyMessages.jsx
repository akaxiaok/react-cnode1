/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import TipMsgSignIn from './TipMsgSignIn';
import Content from './Content';
import DataLoad from './DataLoad';
import Footer from './Footer';
import Header from './Header';
import action from '../Action/Action';

const setting = {
  id: 'Messages',  // 应用关联使用的redux
  url: '/api/v1/messages', // 服务器请求的地址
  stop: props => !props.data, // true 拦截请求，false不拦截请求
  data: props =>  // 发送给服务器的数据
    ({ accesstoken: props.user.accesstoken }),
};

/**
 * 模块入口
 *
 * @class Main
 * @extends {Component}
 */

// todo: click tab, duplicate data
class Main extends Component {
  constructor(props) {
    super(props);
    if (!props.user) {
      browserHistory.push('/');
    }
    this.redayDOM = () => {
      if (this.get) return false; // 已经加载过
      // window.scrollTo(scrollX, scrollY); // 设置滚动条位置

      // todo: no used
      if (this.testStop()) return false; // 请求被拦截
      const { mdrender, accesstoken } = setting.data(this.props, this.props.status);
      this.props.getMessage({
        url: setting.url,
        mdrender,
        accesstoken,
      });
      return true;
    };
    this.testStop = () => {
      const { stop } = this.props.setting;
      if (typeof stop === 'function') {
        return stop(this.props);
      }
      return stop;
    };
  }

  componentDidMount() {
    this.redayDOM();
  }

  render() {
    const { pages, status } = this.props.data;
    const { loadAnimation, loadMsg } = status;
    const { user } = this.props;
    let main = null;
    if (!user) {
      main = <TipMsgSignIn />;
    } else if (!loadAnimation) {
      const hasnotReadMessage = pages.hasnot_read_messages;
      const hasReadMessage = pages.has_read_messages;
      Array.prototype.push.apply(hasnotReadMessage, hasReadMessage);
      main = <Content list={hasnotReadMessage} />;
    } else {
      main = <DataLoad loadAnimation={loadAnimation} loadMsg={loadMsg} />;
    }
    return (
      <div>
        <Header title="消息" />
        {main}
        <Footer index="2" />
      </div>
    );
  }
}
Main.defaultProps = { setting };

export default connect(state =>
  ({ data: state[setting.id], user: state.User }), action(setting.id))(Main); // 连接redux

