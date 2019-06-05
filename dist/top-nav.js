"use strict";
var TopNav = /** @class */ (function () {
    function TopNav(options) {
        this.options = options;
        this.$popups = [];
        this.cache = {
            path: null
        };
        this.$elem = $("#" + options.id);
        this.$home = $();
    }
    TopNav.prototype.render = function () {
        this.$elem.addClass("top-nav");
        this.renderHome();
        this.renderTopItems(this.options.data);
        this.bindEvent();
    };
    TopNav.prototype.bindEvent = function () {
        var _this = this;
        $(document).on("click", ".top-nav-item-leaf,.top-nav-item-top,.top-nav-item-title", function (e) {
            var $elem = $(this), item, $clone, fn;
            item = _this.getItemByElement($elem);
            fn = item.click || _this.options.click;
            if (typeof fn === "function") {
                fn.call(_this.$elem, item, _this.options.id, e);
                if ($elem.hasClass("top-nav-item-leaf")) {
                    _this.$elem
                        .find(".top-nav-home")
                        .removeClass("top-nav-home-hide")
                        .addClass("top-nav-home-show");
                    $clone = $elem.closest(".top-nav-group").clone(true);
                    _this.$elem.find(".top-nav-item-top-level-1").hide();
                    _this.$elem
                        .find(".top-nav-item-top-level-2")
                        .empty()
                        .append($clone);
                }
                $elem.closest(".top-nav-popup").hide();
            }
        });
        this.$elem.on("mouseenter", ".top-nav-item-top", function (e) {
            var path, item, $elem = $(this);
            $(".top-nav-popup").hide();
            path = _this.getPathByElement($elem);
            item = _this.getItemByElement($elem);
            if (item.children && item.children.length > 0) {
                _this.$popups[path[0]].show();
            }
        });
        $(document).on("mouseleave", ".top-nav-popup", function (e) {
            $(this).hide();
        });
        this.$home.on("click", function (e) {
            var $elem = $(this), fn, item = _this.options.home;
            $elem.removeClass("top-nav-home-show").addClass("top-nav-home-hide");
            _this.$elem.find(".top-nav-item-top-level-1").show();
            _this.$elem.find(".top-nav-item-top-level-2").empty();
            fn = item.click || _this.options.click;
            if (typeof fn === "function") {
                fn.call(_this.$elem, item, _this.options.id, e);
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
        this.$home = $("<div class=\"top-nav-home\">" + item.text + "</div>");
        this.$home.appendTo(this.$elem);
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
    };
    TopNav.prototype.renderPopup = function (items, path) {
        var _this_1 = this;
        var groups = [];
        items.forEach(function (item, i) {
            _this_1.mapItem(item);
            groups.push(_this_1.renderGroup(item, path, i));
        });
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
