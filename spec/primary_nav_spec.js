const _  = require("lodash");
const PrimaryNav = require("../src/primary_navigation");

function createDropdown(li) {
  let ul;

  ul = document.createElement("ul");
  ul.setAttribute("aria-hidden", "true");

  li.className = "dropdown-parent";
  li.appendChild(ul);

  return li;
}

function createList() {
  let a, li, ul;

  ul = document.createElement("ul");
  ul.id = "primary-nav-list";

  createListItems(ul);

  document.body.appendChild(ul);

  return ul;
}

function createListItems(ul, items = 3) {
  let a, li;
  let range = Array.from(new Array(items).keys());

  _.forEach(range, function(i) {
    li = document.createElement("li");
    a = document.createElement("a");

    if(i == 2) {
      createDropdown(li);
    }

    a.innerHTML = "Link " + i;
    a.setAttribute("href", "http://www." + i + ".com");

    li.appendChild(a);
    ul.appendChild(li);
  });
}

function createToggle(id, text) {
  let a;

  a = document.createElement("a");
  a.innerHTML = text;
  a.setAttribute("id", id);
  a.setAttribute("aria-expanded", "false");
  a.setAttribute("aria-hidden", "true");

  document.body.appendChild(a);

  return a;
}

function removeElement(el) {
  el.parentNode.removeChild(el);
}

function setBodyClass() {
  let bodyClass = "spec";

  document.body.className = bodyClass;

  return bodyClass;
}

describe("primary navigation module", function() {
  let main_nav, viewport;

  beforeEach(() => {
    main_nav = new PrimaryNav({id: "primary-nav", list_id: "primary-nav-list", toggle_id: "primary-nav-toggle", toggle_mobile_id: "primary-nav-mobile-toggle"}, false);
    viewport = PrimaryNav.__get__("viewport");
    this.bodyClass = setBodyClass();
    this.toggle = createToggle("primary-nav-toggle", "Toggle");
    this.toggleMobile = createToggle("primary-nav-mobile-toggle", "Toggle Mobile");
    createList();
    main_nav.dropdownParents = [];
    main_nav.dropdownParentsMobile = [];
    main_nav.list = document.getElementById(main_nav.config.list_id);

    main_nav.toggle = document.getElementById(main_nav.config.toggle_id);
    main_nav.toggleMobile = document.getElementById(main_nav.config.toggle_mobile_id);
  });

  afterEach(() => {
    removeElement(document.getElementById(main_nav.config.list_id));
    removeElement(document.getElementById(main_nav.config.toggle_id));
  });

  it("should exist", function() {
    expect(main_nav).toBeDefined();
  });

  // describe("addDropdownClickListener function", () => {
    // How do I test this?
  // });

  // describe("addToggleListener function", () => {
    // How do I test this?
  // });

  describe("deviceCheck function", () => {
    it("should return true if the device is a mobile", () => {
      main_nav.device = "mobile";

      main_nav.deviceCheck();

      expect(main_nav.deviceCheck()).toEqual(true);
    });

    it("should return true if the device is a tablet", () => {
      main_nav.device = "tablet";

      main_nav.deviceCheck();

      expect(main_nav.deviceCheck()).toEqual(true);
    });

    it("should return false if the device is a desktop", () => {
      main_nav.device = "desktop";

      main_nav.deviceCheck();

      expect(main_nav.deviceCheck()).toEqual(false);
    });
  });

  // describe("dropdownParentClick function", () => {
  // });

  describe("getBodyClass function", () => {
    beforeEach(() => {
      main_nav.getBodyClass();
    });

    it("should assign the document body to this.body", () => {
      expect(main_nav.body).toEqual(document.body);
    });

    it("should assign the body class to this.bodyClass", () => {
      expect(main_nav.bodyClass).toEqual(this.bodyClass);
    });
  });

  describe("getDropdownParents function", () => {
    beforeEach(() => {
      spyOn(main_nav, "addDropdownHoverListener");

      main_nav.getDropdownParents();
    });

    it("should push list items with a class of 'dropdown-parent' to the dropdownParents array", () => {
      expect(main_nav.dropdownParents.length).toEqual(1);
    });

    it("should call the addDropdownHoverListener function", () => {
      expect(main_nav.addDropdownHoverListener).toHaveBeenCalled();
    });
  });

  // describe("getDropdownParentsMobile function", () => {
  // });

  // describe("hideDropdown function", () => {
  // });

  describe("hideNav function", () => {
    beforeEach(() => {
      spyOn(main_nav, "setBodyClass");
      spyOn(main_nav, "setToggleAriaExpanded");
    });

    it("should assign this.hideMenu to the value of the parameter if the parameter is a boolean", () => {
      main_nav.hideNav(true);

      expect(main_nav.hideMenu).toEqual(true);
    });

    it("should call the deviceCheck function if the parameter is not a boolean", () => {
      spyOn(main_nav, "deviceCheck");

      main_nav.hideNav();

      expect(main_nav.deviceCheck).toHaveBeenCalled();
    });

    it("should assign this.hideMenu to false if the parameter is not a boolean and the deviceCheck function returns false", () => {
      spyOn(main_nav, "deviceCheck").and.returnValue(false);

      main_nav.hideNav();

      expect(main_nav.hideMenu).toEqual(false);
    });

    it("should assign this.hideMenu to the opposite of this.hideMenu if the parameter is not a boolean and the deviceCheck function returns true", () => {
      spyOn(main_nav, "deviceCheck").and.returnValue(true);
      main_nav.hideMenu = false;

      main_nav.hideNav();

      expect(main_nav.hideMenu).toEqual(true);
    });

    it("should call the setBodyClass function and pass this.hideMenu as a parameter", () => {
      main_nav.hideNav(true);

      expect(main_nav.setBodyClass).toHaveBeenCalledWith(true);
    });

    it("should call the setToggleAriaExpanded function and pass this.hideMenu as a parameter", () => {
      main_nav.hideNav(true);

      expect(main_nav.setToggleAriaExpanded).toHaveBeenCalledWith(true);
    });
  });

  describe("init function", () => {
    beforeEach(() => {
      spyOn(main_nav, "render");

      main_nav.init();
    });

    it("should assign the HTML node specified in this.config.toggle_id to this.toggle", () => {
      expect(main_nav.toggle).toEqual(this.toggle);
    });

    it("should assign the HTML node specified in this.config.toggle_mobile_id to this.toggle_mobile", () => {
      expect(main_nav.toggleMobile).toEqual(this.toggleMobile);
    });

    it("should call the render function", () => {
      expect(main_nav.render).toHaveBeenCalled();
    });
  });

  describe("initViewport function", () => {
    beforeEach(() => {
      spyOn(viewport, "getDevice").and.returnValue("desktop");
      spyOn(viewport, "windowSize").and.returnValue({height: 568, width: 1680});
      spyOn(viewport, "trackSize");

      main_nav.initViewport();
    });

    it("should assign this.device to the value returned by the viewport.getDevice function", () => {
      expect(main_nav.device).toEqual("desktop");
    });

    it("should assign this.size to the value returned by the viewport.windowSize function", () => {
      expect(main_nav.size).toEqual({height: 568, width: 1680});
    });

    it("should call the trackSize function", () => {
      expect(viewport.trackSize).toHaveBeenCalled();
    });
  });

  // describe("resetDropdownParentsStates function", () => {
  // });

  describe("setBodyClass function", () => {
    beforeEach(() => {
      main_nav.body = document.body;
      main_nav.bodyClass = this.bodyClass;
    });

    it("should assign 'nav-open' to this.bodyClass if it's passed a parameter of false", () => {
      main_nav.setBodyClass(false);

      expect(main_nav.body.className).toContain("nav-open");
    });

    it("should not assign 'nav-open' to this.bodyClass if it's passed a parameter of true", () => {
      main_nav.setBodyClass(true);

      expect(main_nav.body.className).not.toContain("nav-open");
    });
  });

  // describe("setDropdownAriaHiddenDesktop function", () => {
  // });

  // describe("setDropdownAriaHiddenMobile function", () => {
  // });

  describe("setToggleAriaExpanded function", () => {
    it("should set the 'aria-expanded' attribute of this.toggle to true if it's passed a parameter of false", () => {

      main_nav.setToggleAriaExpanded(false);

      expect(main_nav.toggle.getAttribute("aria-expanded")).toEqual("true");
    });

    it("should set the 'aria-expanded' attribute of this.toggle to false if it's passed a parameter of true", () => {

      main_nav.setToggleAriaExpanded(true);

      expect(main_nav.toggle.getAttribute("aria-expanded")).toEqual("false");
    });
  });

  describe("setToggleAriaHidden function", () => {
    it("should set the 'aria-hidden' attribute of this.toggle to true if it's passed a parameter of true", () => {

      main_nav.setToggleAriaHidden(true);

      expect(main_nav.toggle.getAttribute("aria-hidden")).toEqual("true");
    });

    it("should set the 'aria-hidden' attribute of this.toggle to false if it's passed a parameter of false", () => {

      main_nav.setToggleAriaHidden(false);

      expect(main_nav.toggle.getAttribute("aria-hidden")).toEqual("false");
    });
  });

  // describe("skipTextNodes function", () => {
  // });

  describe("toggleClick function", () => {
    let clickSpy;

    beforeEach(() => {
      spyOn(main_nav, "hideNav");
      clickSpy = jasmine.createSpyObj("e", ["preventDefault"]);

      main_nav.toggleClick(clickSpy);
    });

    it("should call the hideNav function", () => {
      expect(main_nav.hideNav).toHaveBeenCalled();
    });

    it("should call e.preventDefault", () => {
      expect(clickSpy.preventDefault).toHaveBeenCalled();
    });
  });

  describe("trackSize function", () => {
    beforeEach(() => {
      spyOn(main_nav, "hideNav");
      spyOn(main_nav, "resetDropdownParentsStates");
      spyOn(main_nav, "setToggleAriaHidden");
    });

    it("should call the resetDropdownParentsStates function", () => {
      main_nav.trackSize("desktop", {height: 568, width: 1680});

      expect(main_nav.resetDropdownParentsStates).toHaveBeenCalled();
    });

    it("should assign the value of the device parameter to this.device if they are not strictly equal", () => {
      main_nav.device = "mobile";

      main_nav.trackSize("desktop", {height: 568, width: 1680});

      expect(main_nav.device).toEqual("desktop");
    });

    describe("when the deviceCheck function returns true", () => {
      beforeEach(() => {
        spyOn(main_nav, "deviceCheck").and.returnValue(true);

        main_nav.trackSize("desktop", {height: 568, width: 1680});
      });

      it("should call the hideNav function with a parameter of true", () => {
        expect(main_nav.hideNav).toHaveBeenCalledWith(true);
      });

      it("should call the setToggleAriaHidden function with a parameter of false", () => {
        expect(main_nav.setToggleAriaHidden).toHaveBeenCalledWith(false);
      });
    });

    describe("when the deviceCheck function returns false", () => {
      beforeEach(() => {
        spyOn(main_nav, "deviceCheck").and.returnValue(false);

        main_nav.trackSize("desktop", {height: 568, width: 1680});
      });

      it("should call the hideNav function with a parameter of false", () => {
        expect(main_nav.hideNav).toHaveBeenCalledWith(false);
      });

      it("should call the setToggleAriaHidden function with a parameter of true", () => {
        expect(main_nav.setToggleAriaHidden).toHaveBeenCalledWith(true);
      });
    });

    it("should assign the value of the size parameter to this.size", () => {
      main_nav.trackSize("desktop", {height: 568, width: 1680});

      expect(main_nav.size).toEqual({height: 568, width: 1680});
    });
  });

  describe("render function", () => {
    beforeEach(() => {
      spyOn(main_nav, "addToggleListener");
      spyOn(main_nav, "getBodyClass");
      spyOn(main_nav, "getDropdownParents");
      spyOn(main_nav, "hideNav");
      spyOn(main_nav, "setToggleAriaHidden");
    });

    it("should call the addToggleListener function", () => {
      main_nav.render();

      expect(main_nav.addToggleListener).toHaveBeenCalled();
    });

    it("should call the getBodyClass function", () => {
      main_nav.render();

      expect(main_nav.getBodyClass).toHaveBeenCalled();
    });

    it("should call the hideNav function", () => {
      main_nav.render();

      expect(main_nav.hideNav).toHaveBeenCalled();
    });

    it("should call the getDropdownParents function", () => {
      main_nav.render();

      expect(main_nav.getDropdownParents).toHaveBeenCalled();
    });

    it("should call the setToggleAriaHidden function with a paramater of false if the deviceCheck function returns true", () => {
      spyOn(main_nav, "deviceCheck").and.returnValue(true);

      main_nav.render();

      expect(main_nav.setToggleAriaHidden).toHaveBeenCalledWith(false);
    });

    it("should call the setToggleAriaHidden function with a paramater of true if the deviceCheck function returns false", () => {
      spyOn(main_nav, "deviceCheck").and.returnValue(false);

      main_nav.render();

      expect(main_nav.setToggleAriaHidden).toHaveBeenCalledWith(true);
    });
  });
});
