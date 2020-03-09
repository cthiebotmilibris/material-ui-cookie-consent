"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _jsCookie = _interopRequireDefault(require("js-cookie"));

var _Snackbar = _interopRequireDefault(require("@material-ui/core/Snackbar"));

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _Dialog = _interopRequireDefault(require("@material-ui/core/Dialog"));

var _DialogActions = _interopRequireDefault(require("@material-ui/core/DialogActions"));

var _DialogContent = _interopRequireDefault(require("@material-ui/core/DialogContent"));

var _DialogContentText = _interopRequireDefault(require("@material-ui/core/DialogContentText"));

var _DialogTitle = _interopRequireDefault(require("@material-ui/core/DialogTitle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * This component is the MUICookieConsent it pops a Snackbar or a Dialog informing the user about cookie consent.
 */
class MUICookieConsent extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "handleScroll", () => {
      const acceptOnScrollPercentage = this.props.acceptOnScrollPercentage;

      if (document && typeof acceptOnScrollPercentage === 'number') {
        const rootNode = document.documentElement || document.body;

        if (rootNode) {
          // (top / (height - height)) * 100
          const percentage = rootNode.scrollTop / (rootNode.scrollHeight - rootNode.clientHeight) * 100;

          if (percentage > acceptOnScrollPercentage) {
            this.handleAccept();
          }
        }
      }
    });

    _defineProperty(this, "handleAccept", () => {
      const _this$props = this.props,
            cookieName = _this$props.cookieName,
            cookieValue = _this$props.cookieValue,
            expires = _this$props.expires,
            hideOnAccept = _this$props.hideOnAccept,
            onAccept = _this$props.onAccept,
            extraCookieOptions = _this$props.extraCookieOptions;

      if (onAccept) {
        onAccept();
      }

      if (window) {
        window.removeEventListener('scroll', this.handleScroll);
      }

      _jsCookie.default.set(cookieName, cookieValue, _objectSpread({
        expires
      }, extraCookieOptions));

      if (hideOnAccept) {
        this.setState({
          visible: false
        });
      }
    });

    this.state = {
      visible: false
    };
  }

  componentDidMount() {
    const _this$props2 = this.props,
          cookieName = _this$props2.cookieName,
          debug = _this$props2.debug,
          acceptOnScroll = _this$props2.acceptOnScroll;

    if (_jsCookie.default.get(cookieName) === undefined || debug) {
      this.setState({
        visible: true
      });
    }

    if (window && acceptOnScroll) {
      window.addEventListener('scroll', this.handleScroll, {
        passive: true
      });
    }
  }

  componentWillUnmount() {
    if (window) {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }
  /**
   * checks whether scroll has exceeded set amount and fire accept if so.
   */


  render() {
    const _this$props3 = this.props,
          componentType = _this$props3.componentType,
          children = _this$props3.children,
          message = _this$props3.message,
          snackbarAnchor = _this$props3.snackbarAnchor,
          title = _this$props3.title,
          acceptButtonLabel = _this$props3.acceptButtonLabel,
          actions = _this$props3.actions;
    const childrenWithProps = React.Children.map(children, child => React.cloneElement(child, {
      onAccept: this.handleAccept
    }));

    switch (componentType) {
      case 'Snackbar':
        return children ? React.createElement(_Snackbar.default, {
          anchorOrigin: snackbarAnchor,
          open: this.state.visible
        }, childrenWithProps) : React.createElement(_Snackbar.default, {
          anchorOrigin: snackbarAnchor,
          open: this.state.visible,
          message: React.createElement("span", {
            id: "message-id"
          }, message),
          action: [...React.Children.toArray(actions), React.createElement(_Button.default, {
            key: "accept",
            color: "primary",
            size: "small",
            onClick: this.handleAccept
          }, acceptButtonLabel)]
        });

      case 'Dialog':
        return React.createElement(_Dialog.default, {
          open: this.state.visible
        }, children ? childrenWithProps : React.createElement(React.Fragment, null, title ? React.createElement(_DialogTitle.default, null, title) : null, React.createElement(_DialogContent.default, null, React.createElement(_DialogContentText.default, {
          id: "alert-dialog-description",
          component: "div"
        }, message)), React.createElement(_DialogActions.default, null, actions, React.createElement(_Button.default, {
          onClick: this.handleAccept,
          color: "primary"
        }, acceptButtonLabel))));

      default:
        return null;
    }
  }

}

exports.default = MUICookieConsent;

_defineProperty(MUICookieConsent, "defaultProps", {
  componentType: 'Snackbar',
  cookieValue: '',
  acceptOnScroll: false,
  acceptOnScrollPercentage: 25,
  expires: 365,
  hideOnAccept: true,
  debug: false,
  extraCookiesOptions: undefined,
  snackbarAnchor: {
    horizontal: 'center',
    vertical: 'bottom'
  },
  children: null,
  message: 'I love cookies!',
  title: null,
  acceptButtonLabel: 'Accept',
  actions: null
});