$(function () {
    function p(a) {
        var c = 0;
        return $(a).each(function () {
            c += $(this).outerWidth(!0)
        }), c
    }

    function j(v) {
        var c = p($(v).prevAll()), d = p($(v).nextAll()), x = p($(".content-tabs").children().not(".J_menuTabs")),
            t = $(".content-tabs").outerWidth(!0) - x, u = 0;
        if ($(".page-tabs-content").outerWidth() < t) {
            u = 0
        } else {
            if (d <= t - $(v).outerWidth(!0) - $(v).next().outerWidth(!0)) {
                if (t - $(v).next().outerWidth(!0) > d) {
                    u = c;
                    for (var w = v; u - $(w).outerWidth() > $(".page-tabs-content").outerWidth() - t;) {
                        u -= $(w).prev().outerWidth(), w = $(w).prev()
                    }
                }
            } else {
                c > t - $(v).outerWidth(!0) - $(v).prev().outerWidth(!0) && (u = c - $(v).prev().outerWidth(!0))
            }
        }
        $(".page-tabs-content").animate({marginLeft: 0 - u + "px"}, "fast")
    }

    function m() {
        var u = Math.abs(parseInt($(".page-tabs-content").css("margin-left"))),
            c = p($(".content-tabs").children().not(".J_menuTabs")), d = $(".content-tabs").outerWidth(!0) - c, v = 0;
        if ($(".page-tabs-content").width() < d) {
            return !1
        }
        for (var o = $(".J_menuTab:first"), t = 0; t + $(o).outerWidth(!0) <= u;) {
            t += $(o).outerWidth(!0), o = $(o).next()
        }
        if (t = 0, p($(o).prevAll()) > d) {
            for (; t + $(o).outerWidth(!0) < d && o.length > 0;) {
                t += $(o).outerWidth(!0), o = $(o).prev()
            }
            v = p($(o).prevAll())
        }
        $(".page-tabs-content").animate({marginLeft: 0 - v + "px"}, "fast")
    }

    function h() {
        var u = Math.abs(parseInt($(".page-tabs-content").css("margin-left"))),
            c = p($(".content-tabs").children().not(".J_menuTabs")), d = $(".content-tabs").outerWidth(!0) - c, v = 0;
        if ($(".page-tabs-content").width() < d) {
            return !1
        }
        for (var o = $(".J_menuTab:first"), t = 0; t + $(o).outerWidth(!0) <= u;) {
            t += $(o).outerWidth(!0), o = $(o).next()
        }
        for (t = 0; t + $(o).outerWidth(!0) < d && o.length > 0;) {
            t += $(o).outerWidth(!0), o = $(o).next()
        }
        v = p($(o).prevAll()), v > 0 && $(".page-tabs-content").animate({marginLeft: 0 - v + "px"}, "fast")
    }

    function g() {
        var e = $(this).attr("href"), c = $(this).data("index"), d = $.trim($(this).text()), x = !0;
        if (void 0 == e || 0 == $.trim(e).length) {
            return !1
        }
        if ($(".J_menuTab").each(function () {
                return $(this).data("id") == e ? ($(this).hasClass("active") || ($(this).addClass("active").siblings(".J_menuTab").removeClass("active"), j(this), $(".J_mainContent .J_iframe").each(function () {
                    return $(this).data("id") == e ? ($(this).show().siblings(".J_iframe").hide(), !1) : void 0
                })), x = !1, !1) : void 0
            }), x) {
            var u = '<a href="javascript:;" class="active J_menuTab" data-id="' + e + '">' + d + ' <i class="fa fa-times-circle"></i></a>';
            $(".J_menuTab").removeClass("active");
            var v = '<iframe class="J_iframe" name="iframe' + c + '" width="100%" height="' + $("#iframe").attr("height") + '" src="' + e + '" frameborder="0" data-id="' + e + '" seamless></iframe>';
            $(".J_mainContent").find("iframe.J_iframe").hide().parents(".J_mainContent").append(v);
            $(".J_menuTabs .page-tabs-content").append(u), j($(".J_menuTab.active"))
        }
        return !1
    }

    function q() {
        var e = $(this).parents(".J_menuTab").data("id"), c = $(this).parents(".J_menuTab").width();
        if ($(this).parents(".J_menuTab").hasClass("active")) {
            if ($(this).parents(".J_menuTab").next(".J_menuTab").length > 0) {
                var d = $(this).parents(".J_menuTab").next(".J_menuTab:eq(0)").data("id");
                $(this).parents(".J_menuTab").next(".J_menuTab:eq(0)").addClass("active"), $(".J_mainContent .J_iframe").each(function () {
                    return $(this).data("id") == d ? ($(this).show().siblings(".J_iframe").hide(), !1) : void 0
                });
                var o = parseInt($(".page-tabs-content").css("margin-left"));
                0 > o && $(".page-tabs-content").animate({marginLeft: o + c + "px"}, "fast"), $(this).parents(".J_menuTab").remove(), $(".J_mainContent .J_iframe").each(function () {
                    return $(this).data("id") == e ? ($(this).remove(), !1) : void 0
                })
            }
            if ($(this).parents(".J_menuTab").prev(".J_menuTab").length > 0) {
                var d = $(this).parents(".J_menuTab").prev(".J_menuTab:last").data("id");
                $(this).parents(".J_menuTab").prev(".J_menuTab:last").addClass("active"), $(".J_mainContent .J_iframe").each(function () {
                    return $(this).data("id") == d ? ($(this).show().siblings(".J_iframe").hide(), !1) : void 0
                }), $(this).parents(".J_menuTab").remove(), $(".J_mainContent .J_iframe").each(function () {
                    return $(this).data("id") == e ? ($(this).remove(), !1) : void 0
                })
            }
        } else {
            $(this).parents(".J_menuTab").remove(), $(".J_mainContent .J_iframe").each(function () {
                return $(this).data("id") == e ? ($(this).remove(), !1) : void 0
            }), j($(".J_menuTab.active"))
        }
        return !1
    }

    function b() {
        $(".page-tabs-content").children("[data-id]").not(":first").not(".active").each(function () {
            $('.J_iframe[data-id="' + $(this).data("id") + '"]').remove(), $(this).remove()
        }), $(".page-tabs-content").css("margin-left", "0")
    }

    function f() {
        var a = $(".J_menuTabs .active").attr("data-id");
        $('.J_iframe[data-id="' + a + '"]').attr("src", a);
    }

    function k() {
        if (!$(this).hasClass("active")) {
            var a = $(this).data("id");
            $(".J_mainContent .J_iframe").each(function () {
                return $(this).data("id") == a ? ($(this).show().siblings(".J_iframe").hide(), !1) : void 0
            }), $(this).addClass("active").siblings(".J_menuTab").removeClass("active"), j(this)
        }
    }

    function l() {
        var d = $('.J_iframe[data-id="' + $(this).data("id") + '"]'), i = d.attr("src");
        d.attr("src", i);
    }

    function all() {
        $(".page-tabs-content").children("[data-id]").not(":first").each(function () {
            $('.J_iframe[data-id="' + $(this).data("id") + '"]').remove(), $(this).remove()
        }), $(".page-tabs-content").children("[data-id]:first").each(function () {
            $('.J_iframe[data-id="' + $(this).data("id") + '"]').show(), $(this).addClass("active")
        }), $(".page-tabs-content").css("margin-left", "0")
    }

    $(".J_menuItem").each(function (a) {
        $(this).attr("data-index") || $(this).attr("data-index", a)
    }), $(".J_menuItem").on("click", g), $(".J_menuTabs").on("click", ".J_menuTab i", q), $(".J_tabCloseOther").on("click", b), $(".J_tabShowActive").on("click", f), $(".J_menuTabs").on("click", ".J_menuTab", k), $(".J_menuTabs").on("dblclick", ".J_menuTab", l), $(".J_tabLeft").on("click", m), $(".J_tabRight").on("click", h), $(".J_tabCloseAll").on("click", function () {
        $(".page-tabs-content").children("[data-id]").not(":first").each(function () {
            $('.J_iframe[data-id="' + $(this).data("id") + '"]').remove(), $(this).remove()
        }), $(".page-tabs-content").children("[data-id]:first").each(function () {
            $('.J_iframe[data-id="' + $(this).data("id") + '"]').show(), $(this).addClass("active")
        }), $(".page-tabs-content").css("margin-left", "0")
    });
    context.init({preventDoubleContext: false});
    context.settings({compress: true});
    context.attach(".J_menuTab", [{
        text: "刷新当前", action: function (a) {
            f()
        }
    }, {divider: true}, {
        text: "关闭全部选项卡", action: function (a) {
            all()
        }
    }, {
        text: "关闭其他选择卡", action: function (a) {
            b()
        }
    }])
});

function $childNode(a) {
    return window.frames[a]
}

function animationHover(b, a) {
    b = $(b), b.hover(function () {
        b.addClass("animated " + a)
    }, function () {
        window.setTimeout(function () {
            b.removeClass("animated " + a)
        }, 2000)
    })
}

function WinMove() {
    var c = "[class*=col]", b = ".ibox-title", a = "[class*=col]";
    $(c).sortable({
        handle: b,
        connectWith: a,
        tolerance: "pointer",
        forcePlaceholderSize: !0,
        opacity: 0.8
    }).disableSelection()
}

var $parentNode = window.parent.document;
var context = context || (function () {
    var d = {
        fadeSpeed: 100, filter: function (g) {
        }, above: "auto", preventDoubleContext: true, compress: false
    };

    function a(g) {
        d = $.extend({}, d, g);
        $(document).on("click", "html", function () {
            $(".dropdown-context").fadeOut(d.fadeSpeed, function () {
                $(".dropdown-context").css({display: ""}).find(".drop-left").removeClass("drop-left")
            })
        });
        if (d.preventDoubleContext) {
            $(document).on("contextmenu", ".dropdown-context", function (h) {
                h.preventDefault()
            })
        }
        $(document).on("mouseenter", ".dropdown-submenu", function () {
            var j = $(this).find(".dropdown-context-sub:first"), i = j.width(), h = j.offset().left,
                k = (i + h) > window.innerWidth;
            if (k) {
                j.addClass("drop-left")
            }
        })
    }

    function c(g) {
        d = $.extend({}, d, g)
    }

    function e(o, k, m) {
        var j = (m) ? " dropdown-context-sub" : "", q = d.compress ? " compressed-context" : "",
            h = $('<ul class="dropdown-menu dropdown-context' + j + q + '" id="dropdown-' + k + '"></ul>');
        var p = 0, s = "";
        for (p; p < o.length; p++) {
            if (typeof o[p].divider !== "undefined") {
                h.append('<li class="divider"></li>')
            } else {
                if (typeof o[p].header !== "undefined") {
                    h.append('<li class="nav-header">' + o[p].header + "</li>")
                } else {
                    if (typeof o[p].href == "undefined") {
                        o[p].href = "#"
                    }
                    if (typeof o[p].target !== "undefined") {
                        s = ' target="' + o[p].target + '"'
                    }
                    if (typeof o[p].subMenu !== "undefined") {
                        $sub = ('<li class="dropdown-submenu"><a tabindex="-1" href="' + o[p].href + '">' + o[p].text + "</a></li>")
                    } else {
                        $sub = $('<li><a tabindex="-1" href="' + o[p].href + '"' + s + ">" + o[p].text + "</a></li>")
                    }
                    if (typeof o[p].action !== "undefined") {
                        var g = new Date(), n = "event-" + g.getTime() * Math.floor(Math.random() * 100000),
                            l = o[p].action;
                        $sub.find("a").attr("id", n);
                        $("#" + n).addClass("context-event");
                        $(document).on("click", "#" + n, l)
                    }
                    h.append($sub);
                    if (typeof o[p].subMenu != "undefined") {
                        var r = e(o[p].subMenu, k, true);
                        h.find("li:last").append(r)
                    }
                }
            }
            if (typeof d.filter == "function") {
                d.filter(h.find("li:last"))
            }
        }
        return h
    }

    function f(g, i) {
        var j = new Date(), k = j.getTime(), h = e(i, k);
        $("body").append(h);
        $(document).on("contextmenu", g, function (n) {
            n.preventDefault();
            n.stopPropagation();
            $(".dropdown-context:not(.dropdown-context-sub)").hide();
            if (!$(this).hasClass("active")) {
                var m = $(this).data("id");
                $(".J_mainContent .J_iframe").each(function () {
                    return $(this).data("id") == m ? ($(this).show().siblings(".J_iframe").hide(), !1) : void 0
                }), $(this).addClass("active").siblings(".J_menuTab").removeClass("active");
                $("iframe[data-id='" + m + "']").contents().find("body").click(function () {
                    $(".dropdown-context").fadeOut(d.fadeSpeed, function () {
                        $(".dropdown-context").css({display: ""}).find(".drop-left").removeClass("drop-left")
                    })
                })
            }
            $dd = $("#dropdown-" + k);
            if (typeof d.above == "boolean" && d.above) {
                $dd.addClass("dropdown-context-up").css({
                    top: n.pageY - 20 - $("#dropdown-" + k).height(),
                    left: n.pageX - 13
                }).fadeIn(d.fadeSpeed)
            } else {
                if (typeof d.above == "string" && d.above == "auto") {
                    $dd.removeClass("dropdown-context-up");
                    var l = $dd.height() + 12;
                    $dd.css({top: n.pageY + 2, left: n.pageX - 5}).fadeIn(d.fadeSpeed)
                }
            }
        })
    }

    function b(g) {
        $(document).off("contextmenu", g).off("click", ".context-event")
    }

    return {init: a, settings: c, attach: f, destroy: b}
})();