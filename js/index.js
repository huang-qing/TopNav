$(function(){var data = [{
    Text: "业务功能",
    Children: [
        {
            Text: "订单合同",
            Children: [{
                Text: "订单创建"
            }, {
                Text: "订单浏览"
            }]
        },
        {
            Text: "质量计划",
            Children: [{
                Text: "质量计划编制"
            }]
        },
        {
            Text: "质量检测",
            Children: []
        },
        {
            Text: "不符合项报告",
            Children: []
        },
        {
            Text: "完工报告",
            Children: []
        },
        {
            Text: "工艺管理",
            Children: []
        },
        {
            Text: "试验设备集成",
            Children: []
        },
        {
            Text: "供应商管理",
            Children: []
        },
    ]
}, {
    Text: "系统管理"
}, {
    Text: "帮助与支持",
    click: function (item, id, e) {
        console.dir({
            id: id,
            item: item
        });
    }
}, {
    Text: "关于"
}];

var topNav = new TopNav({
    id: "top-nav",
    data: data,
    map: {
        text: "Text",
        children: "Children"
    },
    click: function (item, id, e) {
        console.dir({
            id: id,
            item: item
        });
    },
    home: {
        Text: "首页"
    }
});
topNav.render();
});