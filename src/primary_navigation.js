const _ = require('lodash');
const ViewportDetect = require('viewport-detection-es6');
const viewport = new ViewportDetect();

class PrimaryNavClass {
  constructor(config = {}, init = true) {
    this.config = _.defaults(config,
      {id: 'primary-nav'},
      {list_id: 'primary-nav-list'},
      {toggle_mobile_id: 'primary-nav-toggle-mobile'},
      {toggle_id: 'primary-nav-toggle'},
      {dropdown_class: 'dropdown-parent'}
    );

    if(init) {
      this.initViewport();
      this.init();
    }
  }

  addDropdownHoverListener(dropdown) {
    dropdown.addEventListener('mouseover', this.setDropdownAriaHiddenDesktop.bind(this), false);
    dropdown.addEventListener('mouseout', this.setDropdownAriaHiddenDesktop.bind(this), false);
  }

  addDropdownClickListener(dropdownParentMobile) {
    dropdownParentMobile.addEventListener('click', this.dropdownParentClick.bind(this), false);
  }

  addToggleListener() {
    this.toggle.addEventListener('click', this.toggleClick.bind(this), false);
    if(!_.isNull(this.toggleMobile)) {
      this.toggleMobile.addEventListener('click', this.toggleClick.bind(this), false);
    }
  }

  deviceCheck() {
    return (this.device === 'mobile' || this.device === 'tablet');
  }

  dropdownParentClick(e) {
    if(this.deviceCheck()) {
      this.hideDropdown(e.target);
      this.setDropdownAriaHiddenMobile(e.target);
    }

    e.preventDefault();
  }

  getBodyClass() {
    this.body = document.body;
    this.bodyClass = this.body.getAttribute('class');
  }

  getDropdownParents() {
    let listItems = this.list.getElementsByTagName('li');

    _.forEach(listItems, function(li) {
      if(li.className === this.config.dropdown_class) {
        this.dropdownParents.push(li);
      }
    }.bind(this));

    _.forEach(this.dropdownParents, this.addDropdownHoverListener.bind(this));

    this.getDropdownParentsMobile();
  }

  getDropdownParentsMobile() {
    _.forEach(this.dropdownParents, function(dropdownParent) {
      this.dropdownParentsMobile.push(this.skipTextNodes(dropdownParent, 'firstChild'));
    }.bind(this));

    _.forEach(this.dropdownParentsMobile, this.addDropdownClickListener.bind(this));
  }

  hideDropdown(dropdownParentMobile) {
    let className = dropdownParentMobile.className;
    let dropdown = this.skipTextNodes(dropdownParentMobile, 'nextSibling');

    if(dropdown.offsetParent === null) {
      dropdown.style.display = 'block';
      dropdownParentMobile.className += ' open';
    } else {
      dropdown.style.display = 'none';
      dropdownParentMobile.className = className.replace(/(?:^|\s)open(?!\S)/g, '');
    }
  }

  hideNav(force) {
    if(_.isBoolean(force)) {
      this.hideMenu = force;
    } else {
      this.hideMenu = (this.deviceCheck()) ? !this.hideMenu : false;
    }

    this.setBodyClass(this.hideMenu);
    this.setToggleAriaExpanded(this.hideMenu);
  }

  init() {
    this.dropdownParents = [];
    this.dropdownParentsMobile = [];
    this.list = document.getElementById(this.config.list_id);
    this.toggle = document.getElementById(this.config.toggle_id);
    this.toggleMobile = document.getElementById(this.config.toggle_mobile_id);
    this.render();
  }

  initViewport() {
    this.device = viewport.getDevice();
    this.size = viewport.windowSize();
    viewport.trackSize(this.trackSize.bind(this));
  }

  resetDropdownParentsStates() {
    let className;

    _.forEach(this.dropdownParentsMobile, function(dropdownParent) {
      className = dropdownParent.className;

      dropdownParent.className.replace(/(?:^|\s)open(?!\S)/g, '');
    });

    _.forEach(this.dropdownParents, function(dropdownParent) {
      let ul = dropdownParent.getElementsByTagName('ul')[0];
      ul.style.display = 'none';
      ul.setAttribute('aria-hidden', 'true');
    });
  }

  setBodyClass(hidden) {
    this.body.className = hidden ? this.bodyClass : this.bodyClass + ' nav-open';
  }

  setDropdownAriaHiddenDesktop(e) {
    if(!this.deviceCheck()) {
      let ul;
      let hoveredParent = e.target.parentNode;

      if(hoveredParent.className === this.config.dropdown_class) {
        ul = hoveredParent.getElementsByTagName('ul')[0];
      } else {
        ul = hoveredParent.parentNode;
      }

      ul.setAttribute('aria-hidden', ul.offsetParent === null ? 'true' : 'false');
    }
  }

  setDropdownAriaHiddenMobile(dropdownParent) {
    let ul = this.skipTextNodes(dropdownParent, 'nextSibling');

    ul.setAttribute('aria-hidden', ul.offsetParent === null ? 'true' : 'false');
  }

  setToggleAriaExpanded(hidden) {
    this.toggle.setAttribute('aria-expanded', hidden ? 'false' : 'true');
  }

  setToggleAriaHidden(hidden) {
    this.toggle.setAttribute('aria-hidden', hidden ? 'true' : 'false');
  }

  skipTextNodes(el, method) {
    let element = el[method];

    while(element !== null && element.nodeType !== 1) {
      element = element.nextSibling;
    }

    return element;
  }

  toggleClick(e) {
    this.hideNav();
    e.preventDefault();
  }

  trackSize(device, size) {
    this.resetDropdownParentsStates();

    if(this.device !== device) {
      this.device = device;
    }
    if(this.deviceCheck()) {
      this.hideNav(true);
      this.setToggleAriaHidden(false);
    } else {
      this.hideNav(false);
      this.setToggleAriaHidden(true);
    }
    this.size = size;
  }

  render() {
    this.addToggleListener();
    this.getBodyClass();
    this.getDropdownParents();
    this.hideNav();
    this.setToggleAriaHidden(!this.deviceCheck());
  }
}

module.exports = PrimaryNavClass;
