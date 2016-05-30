/**
 * ActionSheet(提供 API 接口)
 *
 */

import React, {
  Component,
  PropTypes
} from 'react';
import {render} from 'react-dom';
import './style';
import {classNames, createContainer} from '../utils';
import TransitionShowContainer from '../TransitionShowContainer';
import getApiContainer from '../getApiContainer';

let apiInstance;

let id = 0;
function getId() {
  return id++;
}

export default class ActionSheet extends TransitionShowContainer {
  static propTypes = {
    ...TransitionShowContainer.propTypes,
    buttons: PropTypes.array,
    cancelButtonIndex: PropTypes.number,
    destroyButtonIndex: PropTypes.number,
    title: PropTypes.string,
    callback: PropTypes.func
  };

  static defaultProps = {
    ...TransitionShowContainer.defaultProps,
    duration: 300,
    buttons: []
  };

  transitionName = classNames('action-sheet');

  renderMain(style) {
    const {
      // reset
      show, zIndex, duration, timingFunction,

      buttons,
      cancelButtonIndex,
      destroyButtonIndex,
      title,
      callback,
      className,
      ...others
    } = this.props;
    let classes = classNames('action-sheet', {_user: className});

    return (
      <div className={classes} style={style} {...others} onClick={this.click}>
        <div className={classNames('action-sheet-main')} style={style}>
          {title ? (<header>{title}</header>) : null}
          <ol>{buttons.map((action, index) => {
            return (
              <Button
              key={getId()}
              name={action}
              index={index}
              cancel={cancelButtonIndex === index}
              destroy={destroyButtonIndex === index}
              callback={callback} />);
          })}</ol>
        </div>
      </div>
    );
  }

  click = () => {
    const {onClick, _hide} = this.props;
    _hide();
    onClick && onClick();
  };

  static getInstance(container) {
    return render(<ActionSheetApi />, container);
  }


  static show(options = {}, callback) {
    apiInstance.show(options, callback);
  }
}


class Button extends Component {
  static propTypes = {
    name: PropTypes.string,
    index: PropTypes.number,
    cancel: PropTypes.bool,
    destroy: PropTypes.bool,
    callback: PropTypes.func
  };

  static defaultProps = {
    callback() {}
  };

  render() {
    const {name, index, cancel, destroy, callback} = this.props;
    let classes = classNames('action-sheet-item', {
      'action-sheet-item-cancel': cancel,
      'action-sheet-item-destroy': destroy
    });

    return (
      <li className={classes} onClick={() => callback(index)}>
        <button>{name}</button>
      </li>
    );
  }
}




class ActionSheetApi extends Component {
  state = {};

  render() {
    return (<ActionSheet {...this.state} _hide={this.hide} />);
  }

  show(options = {}, callback) {
    // cancelButtonIndex 默认值
    let cancelButtonIndex = options.buttons.length - 1;
    let nextState = {
      cancelButtonIndex,
      ...this.state,
      ...options,
      callback,
      show: true
    };

    this.setState(nextState);
  }

  hide = () => {
    let nextState = {...this.state, show: false};

    this.setState(nextState);
  }
}


const container = createContainer();
apiInstance = render(<ActionSheetApi />, container);
