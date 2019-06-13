"use strict";
var TopNav = /** @class */ (function () {
    function TopNav(options) {
        this.options = options;
        this.$popups = [];
        this.cache = {
            path: null,
            top: {
                items: {
                    width: 0
                }
            }
        };
        this.items = [];
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
    TopNav.prototype.render = function () {
        this.$elem.addClass("top-nav");
        this.renderHome();
        this.renderTopItems(this.options.data);
        this.renderBack();
        this.resizeTopItemsSpace();
        this.bindEvent();
    };
    TopNav.prototype.goNavItem = function (key, value) {
        var _this_1 = this;
        var item = null;
        this.items.forEach(function (i) {
            if (i[key] === value) {
                item = i;
                _this_1.cache.path = item.path;
                return false;
            }
        });
        this.goItem(item, null);
    };
    TopNav.prototype.goItem = function (item, $elem) {
        var _this = this, $clone, $items;
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
            $items.eq(item.path[item.path.length - 1]).addClass("top-nav-item-select");
            _this.$elem.find(".top-nav-item-top-level-1").hide();
            _this.$elem
                .find(".top-nav-item-top-level-2")
                .empty()
                .append($clone);
        }
        $elem.closest(".top-nav-popup").hide();
    };
    TopNav.prototype.resizeTopItemsSpace = function () {
        var _this = this, itemsWidth, containerWidth, offsetWidth;
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
    };
    TopNav.prototype.goHome = function () {
        var fn, item = this.options.home;
        this.$home.removeClass("top-nav-home-show").addClass("top-nav-home-hide");
        this.$back.removeClass("top-nav-back-show").addClass("top-nav-back-hide");
        this.$elem.find(".top-nav-item-top-level-1").show();
        this.$elem.find(".top-nav-item-top-level-2").empty();
        fn = item.click || this.options.click;
        if (typeof fn === "function") {
            fn.call(this.$elem, item, this.options.id);
        }
    };
    TopNav.prototype.bindEvent = function () {
        var _this = this;
        $(document).on("click", 
        //".top-nav-item-leaf,.top-nav-item-top,.top-nav-item-title",
        ".top-nav-item-leaf", function (e) {
            var $elem = $(this), item, $clone, fn;
            item = _this.getItemByElement($elem);
            fn = item.click || _this.options.click;
            if (typeof fn === "function") {
                fn.call(_this.$elem, item, _this.options.id, e);
                _this.goItem(item, $elem);
            }
        });
        $(window).resize(function () {
            _this.resizeTopItemsSpace();
        });
        this.$elem.on("mouseenter", ".top-nav-item-top", function (e) {
            var path, item, $elem = $(this), $popup, offset;
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
            var $elem = $(this), fn, item = _this.options.back, checked;
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
    };
    TopNav.prototype.renderHome = function () {
        var item;
        this.mapItem(this.options.home);
        item = this.options.home;
        this.$home = $("<div class=\"top-nav-home\">" + (item.text || "首页") + "</div>");
        this.$home.appendTo(this.$elem);
    };
    TopNav.prototype.renderBack = function () {
        var item;
        this.mapItem(this.options.back);
        item = this.options.back;
        this.$back = $("<div class=\"top-nav-back\">" + (item.text || "返回") + "</div>");
        this.$back.appendTo(this.$elem);
    };
    TopNav.prototype.getPathByElement = function ($item) {
        var path;
        path = $item.attr("data-path") || "";
        path = path.split(",").map(function (value) {
            return Number(value);
        });
        this.cache.path = path;
        return path;
    };
    TopNav.prototype.getItemByElement = function ($item) {
        var path, item;
        path = this.getPathByElement($item);
        item = this.getItemByPath(path);
        return item;
    };
    TopNav.prototype.getElementByItem = function (item) {
        return $(".top-nav-popup").find("[data-path='" + item.path.join(",") + "']");
    };
    TopNav.prototype.getPath = function (path, index) {
        var _path;
        _path = path.map(function (i) {
            return i;
        });
        _path.push(index);
        return _path;
    };
    TopNav.prototype.getItemByPath = function (path) {
        if (path === void 0) { path = []; }
        var data = this.options.data, item;
        path.forEach(function (index, i) {
            if (i === 0) {
                item = data[index];
            }
            else {
                item = item.children[index];
            }
        });
        return item;
    };
    TopNav.prototype.mapItem = function (item) {
        var map = this.options.map;
        for (var i in map) {
            item[i] = item[map[i]];
        }
    };
    TopNav.prototype.renderItem = function (item, path, type) {
        if (type === void 0) { type = "leaf"; }
        item.path = path;
        this.items.push(item);
        return "\n    <div class=\"top-nav-item-" + type + "\" data-path=\"" + path.toString() + "\">\n        " + item.text + "\n    </div>";
    };
    TopNav.prototype.renderTopItem = function (item, index) {
        var popup, $popup, top;
        top = this.renderItem(item, [index], "top");
        if (item.children && item.children.length > 0) {
            popup = this.renderPopup(item.children, [index]);
            $popup = $(popup);
            this.$popups.push($popup);
            $("body").append($popup);
        }
        return top;
    };
    TopNav.prototype.renderTopItems = function (items) {
        var _this_1 = this;
        var $top, tops = [];
        items.forEach(function (item, i) {
            _this_1.mapItem(item);
            tops.push(_this_1.renderTopItem(item, i));
        });
        $top = $("\n    <div class=\"top-nav-item-top-level-1\">\n      " + tops.join("") + "\n    </div>\n    <div class=\"top-nav-item-top-level-2\">\n    </div>\n    ");
        this.$elem.append($top);
        this.cache.top.items.width = $top.width();
    };
    TopNav.prototype.renderPopup = function (items, path) {
        var _this_1 = this;
        var groups = [];
        items.forEach(function (item, i) {
            _this_1.mapItem(item);
            groups.push(_this_1.renderGroup(item, path, i));
        });
        this.cache.top.items.count = items.length;
        return "\n    <div class=\"top-nav-popup\">\n      <div class=\"top-nav-group-wrap\">\n        " + groups.join("") + "\n      </div>\n    </div>\n    ";
    };
    TopNav.prototype.renderGroupTitle = function (item, path) {
        return this.renderItem(item, path, "title");
    };
    TopNav.prototype.renderGroup = function (item, path, index) {
        var _this_1 = this;
        var items = [], titlePath, title;
        titlePath = this.getPath(path, index);
        title = this.renderGroupTitle(item, titlePath);
        if (item.children && item.children.length > 0) {
            item.children.forEach(function (item, i) {
                _this_1.mapItem(item);
                items.push(_this_1.renderItem(item, _this_1.getPath(titlePath, i)));
            });
        }
        return "\n    <div class=\"top-nav-group\">\n        " + title + "\n        <div class=\"top-nav-group-items\">\n        " + items.join("") + "\n        </div>\n    </div>\n    ";
    };
    return TopNav;
}());
