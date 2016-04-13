'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require('lodash');
var ViewportDetect = require('viewport-detection-es6');
var viewport = new ViewportDetect();

var PrimaryNavClass = function () {
  function PrimaryNavClass() {
    var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var init = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    _classCallCheck(this, PrimaryNavClass);

    this.config = _.defaults(config, { id: 'primary-nav' }, { list_id: 'primary-nav-list' }, { toggle_mobile_id: 'primary-nav-toggle-mobile' }, { toggle_id: 'primary-nav-toggle' }, { dropdown_class: 'dropdown-parent' });

    if (init) {
      this.initViewport();
      this.init();
    }
  }

  _createClass(PrimaryNavClass, [{
    key: 'addDropdownHoverListener',
    value: function addDropdownHoverListener(dropdown) {
      dropdown.addEventListener('mouseover', this.setDropdownAriaHiddenDesktop.bind(this), false);
      dropdown.addEventListener('mouseout', this.setDropdownAriaHiddenDesktop.bind(this), false);
    }
  }, {
    key: 'addDropdownClickListener',
    value: function addDropdownClickListener(dropdownParentMobile) {
      dropdownParentMobile.addEventListener('click', this.dropdownParentClick.bind(this), false);
    }
  }, {
    key: 'addToggleListener',
    value: function addToggleListener() {
      this.toggle.addEventListener('click', this.toggleClick.bind(this), false);
      if (!_.isNull(this.toggleMobile)) {
        this.toggleMobile.addEventListener('click', this.toggleClick.bind(this), false);
      }
    }
  }, {
    key: 'deviceCheck',
    value: function deviceCheck() {
      return this.device === 'mobile' || this.device === 'tablet';
    }
  }, {
    key: 'dropdownParentClick',
    value: function dropdownParentClick(e) {
      if (this.deviceCheck()) {
        this.hideDropdown(e.target);
        this.setDropdownAriaHiddenMobile(e.target);
      }

      e.preventDefault();
    }
  }, {
    key: 'getBodyClass',
    value: function getBodyClass() {
      this.body = document.body;
      this.bodyClass = this.body.getAttribute('class');
    }
  }, {
    key: 'getDropdownParents',
    value: function getDropdownParents() {
      var listItems = this.list.getElementsByTagName('li');

      _.forEach(listItems, function (li) {
        if (li.className === this.config.dropdown_class) {
          this.dropdownParents.push(li);
        }
      }.bind(this));

      _.forEach(this.dropdownParents, this.addDropdownHoverListener.bind(this));

      this.getDropdownParentsMobile();
    }
  }, {
    key: 'getDropdownParentsMobile',
    value: function getDropdownParentsMobile() {
      _.forEach(this.dropdownParents, function (dropdownParent) {
        this.dropdownParentsMobile.push(this.skipTextNodes(dropdownParent, 'firstChild'));
      }.bind(this));

      _.forEach(this.dropdownParentsMobile, this.addDropdownClickListener.bind(this));
    }
  }, {
    key: 'hideDropdown',
    value: function hideDropdown(dropdownParentMobile) {
      var className = dropdownParentMobile.className;
      var dropdown = this.skipTextNodes(dropdownParentMobile, 'nextSibling');

      if (dropdown.offsetParent === null) {
        dropdown.style.display = 'block';
        dropdownParentMobile.className += ' open';
      } else {
        dropdown.style.display = 'none';
        dropdownParentMobile.className = className.replace(/(?:^|\s)open(?!\S)/g, '');
      }
    }
  }, {
    key: 'hideNav',
    value: function hideNav(force) {
      if (_.isBoolean(force)) {
        this.hideMenu = force;
      } else {
        this.hideMenu = this.deviceCheck() ? !this.hideMenu : false;
      }

      this.setBodyClass(this.hideMenu);
      this.setToggleAriaExpanded(this.hideMenu);
    }
  }, {
    key: 'init',
    value: function init() {
      this.dropdownParents = [];
      this.dropdownParentsMobile = [];
      this.list = document.getElementById(this.config.list_id);
      this.toggle = document.getElementById(this.config.toggle_id);
      this.toggleMobile = document.getElementById(this.config.toggle_mobile_id);
      this.render();
    }
  }, {
    key: 'initViewport',
    value: function initViewport() {
      this.device = viewport.getDevice();
      this.size = viewport.windowSize();
      viewport.trackSize(this.trackSize.bind(this));
    }
  }, {
    key: 'resetDropdownParentsStates',
    value: function resetDropdownParentsStates() {
      var className = void 0;

      _.forEach(this.dropdownParentsMobile, function (dropdownParent) {
        className = dropdownParent.className;

        dropdownParent.className.replace(/(?:^|\s)open(?!\S)/g, '');
      });

      _.forEach(this.dropdownParents, function (dropdownParent) {
        var ul = dropdownParent.getElementsByTagName('ul')[0];
        ul.style.display = 'none';
        ul.setAttribute('aria-hidden', 'true');
      });
    }
  }, {
    key: 'setBodyClass',
    value: function setBodyClass(hidden) {
      this.body.className = hidden ? this.bodyClass : this.bodyClass + ' nav-open';
    }
  }, {
    key: 'setDropdownAriaHiddenDesktop',
    value: function setDropdownAriaHiddenDesktop(e) {
      if (!this.deviceCheck()) {
        var ul = void 0;
        var hoveredParent = e.target.parentNode;

        if (hoveredParent.className === this.config.dropdown_class) {
          ul = hoveredParent.getElementsByTagName('ul')[0];
        } else {
          ul = hoveredParent.parentNode;
        }

        ul.setAttribute('aria-hidden', ul.offsetParent === null ? 'true' : 'false');
      }
    }
  }, {
    key: 'setDropdownAriaHiddenMobile',
    value: function setDropdownAriaHiddenMobile(dropdownParent) {
      var ul = this.skipTextNodes(dropdownParent, 'nextSibling');

      ul.setAttribute('aria-hidden', ul.offsetParent === null ? 'true' : 'false');
    }
  }, {
    key: 'setToggleAriaExpanded',
    value: function setToggleAriaExpanded(hidden) {
      this.toggle.setAttribute('aria-expanded', hidden ? 'false' : 'true');
    }
  }, {
    key: 'setToggleAriaHidden',
    value: function setToggleAriaHidden(hidden) {
      this.toggle.setAttribute('aria-hidden', hidden ? 'true' : 'false');
    }
  }, {
    key: 'skipTextNodes',
    value: function skipTextNodes(el, method) {
      var element = el[method];

      while (element !== null && element.nodeType !== 1) {
        element = element.nextSibling;
      }

      return element;
    }
  }, {
    key: 'toggleClick',
    value: function toggleClick(e) {
      this.hideNav();
      e.preventDefault();
    }
  }, {
    key: 'trackSize',
    value: function trackSize(device, size) {
      this.resetDropdownParentsStates();

      if (this.device !== device) {
        this.device = device;
      }
      if (this.deviceCheck()) {
        this.hideNav(true);
        this.setToggleAriaHidden(false);
      } else {
        this.hideNav(false);
        this.setToggleAriaHidden(true);
      }
      this.size = size;
    }
  }, {
    key: 'render',
    value: function render() {
      this.addToggleListener();
      this.getBodyClass();
      this.getDropdownParents();
      this.hideNav();
      this.setToggleAriaHidden(!this.deviceCheck());
    }
  }]);

  return PrimaryNavClass;
}();

module.exports = PrimaryNavClass;