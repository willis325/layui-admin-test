layui.use(['element', 'layer'], function() {
    var element = layui.element(),
        layer = layui.layer,
        $ = layui.jquery;

    //监听头部的一级导航点击事件
    element.on('nav(nav)', function(elem) {
        var index = $(elem).children('a').data('index');
        var secondArr = json[index].children;
        var htmls = '';
        for (var i in secondArr) {
            htmls += returnLi(secondArr[i]);
        }
        $('.left-tree').html("").html(htmls);
        element.init('aside');
    });

    //监听左侧的二级导航点击事件
    element.on('nav(aside)', function(elem) {
        var name = $(elem).children('a').text();
        var href = $(elem).children('a').data('href');

        var iframes = $('iframe');
        var iframesArr = $.makeArray(iframes);
        var arr = [];
        for(var i in iframesArr){
            arr.push($(iframesArr[i]).attr('name'));
        }
        if(arr.length >= 10){
            layer.msg('当前导航最多同时存在10个');
        }else{
            var index = $.inArray(name, arr);
            if( index == -1){
                var iframe = '<iframe src="html/'+href+'" name="'+name+'"></iframe>';
                element.tabAdd('tab', {
                    title: name
                    ,content: iframe
                });

                var index = $('.layui-tab-title li').length;
                element.tabChange('tab', index-1);
            }else{
                element.tabChange('tab', index);
            }
        }
    });

    //tab切换的右击事件
    $(document).on('contextmenu','.layui-tab-title li',function(){
        return false;
    });
    $(document).on('mousedown','.layui-tab-title li',function(e){
        if(e.which === 3){
            var a = $.makeArray($('.layui-tab-title li'));
            var b = $.makeArray($(this));
            var index = $.inArray(b[0], a);

            var left = e.clientX;
            var isNow = $(this).hasClass('layui-this');
            $('.tabOperation').remove();
            var html = returntabOperation(left,isNow,index);
            $('.layui-tab-content').append(html);
            return false;
        }else if (e.which === 1) {
            if($('.tabOperation').length !== 0){
                $('.tabOperation').remove();
            }
        }
    });

    //刷新当前页
    $(document).on('click','.refreshCurrent',function(){
        var index = $('.tabOperation').attr('index');
        var src = $('.layui-show iframe').attr('src');
        $('.layui-show iframe').attr('src',src);
        $('.tabOperation').remove();
    });

    //显示当前页
    $(document).on('click','.showCurrent',function(){
        var index = $('.tabOperation').attr('index');
        element.tabChange('tab', index);
        $('.tabOperation').remove();
    });

    //关闭当前页
    $(document).on('click','.closeCurrent',function(){
        var index = $('.tabOperation').attr('index');
        element.tabDelete('tab', index);
        $('.tabOperation').remove();
    });

    //关闭其他页
    $(document).on('click','.closeOther',function(){
        var index = $('.tabOperation').attr('index');
        var len = $('.layui-tab-title li').length;

        var items = $('.layui-tab-item');
        $('.layui-tab-content').prepend($(items[index]));

        var lis = $('.layui-tab-title li');
        $('.layui-tab-title').prepend($(lis[index]));
        for(var i = len;i>0;i--){
            element.tabDelete('tab', i);
        }

        $('.tabOperation').remove();
    });

    $(document).on('click','.showFull',function(){
        var left = parseInt($('.layui-tab-item').css('left'));
        if(left){
            $('.layui-tab-item').css('left',0);
            $('.aside-btns').css({'background':'#fff',"border-bottom":'1px solid #e2e2e2'});

        }else{
            $('.layui-tab-item').css('left','200px');
            $('.aside-btns').css({'background':'#393D49',"border-bottom":'1px solid #393D49'});
        }
    });

    function returnLi(obj) {
        var results = "";
        if (obj.children) {
            var dds = "";
            for (var i in obj.children) {
                dds += '<dd><a href="javascript:;" data-href="' + obj.children[i].url + '">' + obj.children[i].name + '</a></dd>';
            }
            results = '<li class="layui-nav-item"><a href="javascript:;">' + obj.name + '</a><dl class="layui-nav-child">' + dds + '</dl></li>'
        } else {
            results = '<li class="layui-nav-item"><a href="javascript:;" data-href="' + obj.url + '">' + obj.name + '</a></li>';
        }
        return results;
    }

    function returntabOperation(left,isNow,index){
        if(index == -1){
            console.log('tab的index出错',index);
        }
        if(isNow){
            var li = '<li><a href="javascript:;" class="refreshCurrent">刷新当前选项卡</a></li>';
        }else{
            var li = '<li><a href="javascript:;" class="showCurrent">显示当前选项卡</a></li>';
        }
        return '<div class="tabOperation" style="left:'+left+'px" index="'+index+'"><ul>'
                +li
                +'<li class="divider"></li>'
                +'<li><a href="javascript:;" class="closeCurrent">关闭当前选项卡</a></li>'
                +'<li><a href="javascript:;" class="closeOther">关闭其他选项卡</a></li>'
                +'</ul></div>'
    }

});
