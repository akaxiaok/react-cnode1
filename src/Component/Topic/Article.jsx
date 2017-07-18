/* eslint-disable react/prop-types */
/**
 * Created by Kimi on 2017/5/3.
 */
import React, { Component } from 'react';
import CreaterHeader from './CreaterHeader'
import TipMsgSignIn from '../TipMsgSignIn';
import ReplyBox from '../ReplyBox';
import ReList from './ReList';
import muiThemeable from 'material-ui/styles/muiThemeable';

/**
 * 文章主体部分
 *
 * @class Article
 * @extends {Component}
 */
class Article extends Component {
  render() {
    const palette = this.props.muiTheme.palette;
    const { id, title, content, replies, } = this.props.page;
    const createMarkup = () => ({
      __html: content,
    });
    const bottom = this.props.User ?
      <ReplyBox replyTopic={this.props.replyTopic} data={{ accesstoken: this.props.User.accesstoken, id }} /> :
      <TipMsgSignIn />;

    return (
      <div className="topic" >
        <h2 style={{
          padding: '10px',
          fontSize: '3em',
          background: palette.canvasColor,
          textAlign: 'center',
        }} >{title}</h2>
        <CreaterHeader {...this.props.page} />
        <div className="content markdown-body" dangerouslySetInnerHTML={createMarkup()} />
        <h3 className="tit3" style={{ borderColor: palette.primary1Color }} >共<em
          style={{ color: palette.primary1Color }} >{replies.length}</em>条回复</h3>
        <ReList
         {...this.props}
        />
        {bottom}
      </div>
    );
  }
}
export default muiThemeable()(Article);