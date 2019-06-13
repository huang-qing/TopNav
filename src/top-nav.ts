interface Item {
  text: String;
  icon: String;
  children: Array<Item>;
  click: Function;
  tag: any;
  path: Number[]
  [index: string]: any;
}

interface Options {
  id: string;
  data: Array<Item>;
  map: any;
  click: Function;
  home: Item;
  back: Item;
  style: any;
  autoResize: false
}

class TopNav {
  $popups: Array<JQuery> = [];
  $elem: JQuery;
  $popup: JQuery;
  $home: JQuery;
  $back: JQuery;
  cache: any = {
    path: null,
    top: {
      items: {
        width: 0
      }
    }
  };
  items: Item[] = [];
  style: any;

  constructor(public options: Options) {
    this.$elem = $("#" + options.id);
    this.$home = $();
    this.$popup = $();
    this.$back = $();
    this.style = $.extend(true, {
      popup: {
        space: 30
      }
    }, options.style);
  }

  render() {
    this.$elem.addClass("top-nav");
    this.renderHome();
    this.renderTopItems(this.options.data);
    this.renderBack();
    this.resizeTopItemsSpace();
    this.bindEvent();
  }

  goNavItem(key: string, value: any) {
    var item: Item | null = null;
    this.items.forEach(i => {
      if (i[key] === value) {
        item = i;
        this.cache.path = item.path;
        return false;
      }
    });

    this.goItem(item, null);
  }

  goItem(item: Item | null, $elem: JQuery | null) {
    var _this = this,
      $clone,
      $items;

    if (item === null) {
      return;
    }
    $elem = $elem || this.getElementByItem(item);
    if ($elem.hasClass("top-nav-item-leaf") || $elem.hasClass("top-nav-item-title")) {

      _this.$home.removeClass("top-nav-home-hide")
        .addClass("top-nav-home-show");

      _this.$back.removeClass("top-nav-back-hide")
        .addClass("top-nav-back-show");

      $clone = $elem.closest(".top-nav-group").clone(true);
      $clone.css({ padding: 0 });
      $items = $clone.find(".top-nav-item-leaf");
      $items.removeClass("top-nav-item-select");
      $items.eq(<number>item.path[item.path.length - 1]).addClass("top-nav-item-select");
      _this.$elem.find(".top-nav-item-top-level-1").hide();
      _this.$elem
        .find(".top-nav-item-top-level-2")
        .empty()
        .append($clone);
    }
    $elem.closest(".top-nav-popup").hide();
  }

  resizeTopItemsSpace() {
    var _this = this,
      itemsWidth: number,
      containerWidth: number,
      offsetWidth: number;
    if (!this.options.autoResize) {
      return;
    }
    containerWidth = _this.$elem.parent().width() || 0;
    itemsWidth = _this.cache.top.items.width;
    offsetWidth = Math.floor((containerWidth - itemsWidth) / _this.cache.top.items.count) || 0;
    _this.$elem.find(".top-nav-item-top-level-1 .top-nav-item-top").each(function (i) {
      if (i > 0) {
        $(this).css("margin-left", offsetWidth);
      }
    });
  }

  goHome() {
    var fn,
      item = this.options.home;

    this.$home.removeClass("top-nav-home-show").addClass("top-nav-home-hide");
    this.$back.removeClass("top-nav-back-show").addClass("top-nav-back-hide");
    this.$elem.find(".top-nav-item-top-level-1").show();
    this.$elem.find(".top-nav-item-top-level-2").empty();

    fn = item.click || this.options.click;
    if (typeof fn === "function") {
      fn.call(this.$elem, item, this.options.id);
    }
  }

  bindEvent() {
    var _this = this;
    $(document).on(
      "click",
      //".top-nav-item-leaf,.top-nav-item-top,.top-nav-item-title",
      ".top-nav-item-leaf",
      function (e) {
        var $elem = $(this),
          item,
          $clone,
          fn;

        item = _this.getItemByElement($elem);
        fn = item.click || _this.options.click;
        if (typeof fn === "function") {
          fn.call(_this.$elem, item, _this.options.id, e);
          _this.goItem(item, $elem);
        }
      }
    );

    $(window).resize(function () {
      _this.resizeTopItemsSpace();
    });

    this.$elem.on("mouseenter", ".top-nav-item-top", function (e) {
      var path,
        item,
        $elem = $(this),
        $popup,
        offset;

      $(".top-nav-popup").hide();
      path = _this.getPathByElement($elem);
      item = _this.getItemByElement($elem);
      offset = $elem.offset();

      if (item.children && item.children.length > 0) {
        $popup = _this.$popups[path[0]];
        if (item.children.length <= 4) {
          $popup.find(".top-nav-group-wrap").css({
            "text-align": "left",
            "margin-left": offset ? (Math.floor(offset.left) - _this.style.popup.space + "px") : 0
          });
          $popup.find(".top-nav-group").css({
            "padding-left": _this.style.popup.space + "px",
            "padding-right": _this.style.popup.space + "px"
          });
        }
        $popup.show();
      }
    });

    $(document).on("mouseleave", ".top-nav-popup", function (e) {
      $(this).hide();
    });

    this.$home.on("click", function (e) {
      _this.goHome();
    });

    this.$back.on("click", function (e) {
      var $elem = $(this),
        fn,
        item = _this.options.back,
        checked;

      fn = item.click || _this.options.click;
      if (typeof fn === "function") {
        var checked = fn.call(_this.$elem, item, _this.options.id, e);
        if (checked) {
          _this.goHome();
        }
      }
    });

    this.$home.on("mouseenter", function () {
      $(".top-nav-popup").hide();
      _this.$popups[_this.cache.path[0]].show();
    });
  }

  renderHome() {
    var item;
    this.mapItem(this.options.home);
    item = this.options.home;
    this.$home = $(`<div class="top-nav-home">${item.text || "首页"}</div>`);
    this.$home.appendTo(this.$elem);
  }

  renderBack() {
    var item;
    this.mapItem(this.options.back);
    item = this.options.back;
    this.$back = $(`<div class="top-nav-back">${item.text || "返回"}</div>`);
    this.$back.appendTo(this.$elem);
  }

  getPathByElement($item: JQuery) {
    var path;

    path = $item.attr("data-path") || "";
    path = path.split(",").map(value => {
      return Number(value);
    });
    this.cache.path = path;

    return path;
  }

  getItemByElement($item: JQuery) {
    var path, item;

    path = this.getPathByElement($item);
    item = this.getItemByPath(path);

    return item;
  }

  getElementByItem(item: Item): JQuery {
    return $(".top-nav-popup").find("[data-path='" + item.path.join(",") + "']");
  }

  getPath(path: Array<Number>, index: Number) {
    var _path;

    _path = path.map(i => {
      return i;
    });
    _path.push(index);

    return _path;
  }

  getItemByPath(path: Number[] = []) {
    var data = this.options.data,
      item: any;

    path.forEach((index: any, i) => {
      if (i === 0) {
        item = data[index];
      } else {
        item = item.children[index];
      }
    });

    return item;
  }

  mapItem(item: Item | any) {
    var map = this.options.map;
    for (var i in map) {
      item[i] = item[map[i]];
    }
  }

  renderItem(item: Item, path: Array<Number>, type: string = "leaf") {
    item.path = path;
    this.items.push(item);
    return `
    <div class="top-nav-item-${type}" data-path="${path.toString()}">
        ${item.text}
    </div>`;
  }

  renderTopItem(item: Item, index: Number) {
    var popup, $popup, top;

    top = this.renderItem(item, [index], "top");
    if (item.children && item.children.length > 0) {
      popup = this.renderPopup(item.children, [index]);
      $popup = $(popup);
      this.$popups.push($popup);
      $("body").append($popup);
    }

    return top;
  }

  renderTopItems(items: Item[]) {
    var $top,
      tops: string[] = [];

    items.forEach((item, i) => {
      this.mapItem(item);
      tops.push(this.renderTopItem(item, i));
    });

    $top = $(`
    <div class="top-nav-item-top-level-1">
      ${tops.join("")}
    </div>
    <div class="top-nav-item-top-level-2">
    </div>
    `);
    this.$elem.append($top);
    this.cache.top.items.width = $top.width();
  }

  renderPopup(items: Item[], path: Array<Number>) {
    var groups: string[] = [];

    items.forEach((item, i) => {
      this.mapItem(item);
      groups.push(this.renderGroup(item, path, i));
    });

    this.cache.top.items.count = items.length;

    return `
    <div class="top-nav-popup">
      <div class="top-nav-group-wrap">
        ${groups.join("")}
      </div>
    </div>
    `;
  }

  renderGroupTitle(item: Item, path: Array<Number>) {
    return this.renderItem(item, path, "title");
  }

  renderGroup(item: Item, path: Array<Number>, index: Number) {
    var items: string[] = [],
      titlePath: Number[],
      title;

    titlePath = this.getPath(path, index);
    title = this.renderGroupTitle(item, titlePath);
    if (item.children && item.children.length > 0) {
      item.children.forEach((item, i) => {
        this.mapItem(item);
        items.push(this.renderItem(item, this.getPath(titlePath, i)));
      });
    }

    return `
    <div class="top-nav-group">
        ${title}
        <div class="top-nav-group-items">
        ${items.join("")}
        </div>
    </div>
    `;
  }

}