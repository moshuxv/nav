(function($){ 
    $(document).ready(function(){
        // 侧栏菜单初始状态设置
        if(theme.minNav != '1')trigger_resizable(true);
        // 主题状态
        // 搜索模块
        intoSearch();
        // 粘性页脚
        stickFooter();
        // 网址块提示 
        if(isPC()){ $('[data-toggle="tooltip"]').tooltip({trigger: 'hover'}); }else{ $('.qr-img[data-toggle="tooltip"]').tooltip({trigger: 'hover'}); }
        // 初始化tab滑块
        intoSlider();
        // 初始化theiaStickySidebar
        $('.sidebar').theiaStickySidebar({
            additionalMarginTop: 90,
            additionalMarginBottom: 20
        });
       
    // count-a数字动画
    $('.count-a').each(function () {
        $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
        }, {
            duration: 1000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });
    $(document).on('click', "a[target!='_blank']", function() {
        if( theme.loading=='1' && $(this).attr('href') && $(this).attr('href').indexOf("#") != 0 && $(this).attr('href').indexOf("java") != 0 && !$(this).data('fancybox')  && !$(this).data('commentid') && !$(this).hasClass('nofx') ){
            var load = $('<div id="load-loading"></div>');
            $("body").prepend(load);
            load.animate({opacity:'1'},200,'swing').delay(2000).hide(300,function(){ load.remove() });
        }
    });
    


    //返回顶部
    $(document).ready(function() {
        var $goToUp = $('#go-to-up');
        var $scrollPercentage = $('.scroll-percentage');
        var $icon = $goToUp.find('i');
        var scrollTimer;

        // 监听滚动事件
        $(window).scroll(function() {
            // 计算滚动百分比
            var scrollPercent = Math.round(($(window).scrollTop() / ($(document).height() - $(window).height())) * 100);
            
            // 显示按钮
            $goToUp.show();
            
            // 隐藏图标,显示百分比
            $icon.hide();
            $scrollPercentage.text(scrollPercent + '%').show();
            
            // 清除之前的定时器
            clearTimeout(scrollTimer);
            
            // 设置新的定时器,2秒后隐藏百分比,显示图标
            scrollTimer = setTimeout(function() {
                $scrollPercentage.hide();
                $icon.show();
            }, 2000);
        });

        // 点击返回顶部
        $goToUp.click(function() {
            $('html, body').animate({
                scrollTop: 0
            }, 500);
            return false;
        });
    });

 
    //滑块菜单
    $('.slider_menu').children("ul").children("li").not(".anchor").hover(function() {
        $(this).addClass("hover"),
        //$('li.anchor').css({
        //    transform: "scale(1.05)",
        //}),
        toTarget($(this).parent(),true,true) 
    }, function() {
        //$('li.anchor').css({
        //    transform: "scale(1)",
        //}),
        $(this).removeClass("hover") 
    });
    $('.slider_menu').mouseleave(function(e) {
        var menu = $(this).children("ul");
        window.setTimeout(function() { 
            toTarget(menu,true,true) 
        }, 50)
    }) ;  
    function intoSlider() {
        $(".slider_menu[sliderTab]").each(function() {
            if(!$(this).hasClass('into')){
                var menu = $(this).children("ul");
                menu.prepend('<li class="anchor" style="position:absolute;width:0;height:28px"></li>');
                var target = menu.find('.active').parent();
                if(0 < target.length){
                    menu.children(".anchor").css({
                        left: target.position().left + target.scrollLeft() + "px",
                        width: target.outerWidth() + "px",
                        height: target.height() + "px",
                        opacity: "1"
                    })
                }
                $(this).addClass('into');
            }
        })
    }
    //粘性页脚
    function stickFooter() {
        $('.main-footer').attr('style', '');
        if($('.main-footer').hasClass('text-xs'))
        {
            var win_height                 = jQuery(window).height(),
                footer_height             = $('.main-footer').outerHeight(true),
                main_content_height         = $('.main-footer').position().top + footer_height ;
            if(win_height > main_content_height - parseInt($('.main-footer').css('marginTop'), 10))
            {
                $('.main-footer').css({
                    marginTop: win_height - main_content_height  
                });
            }
        }
    }
 

    $('#sidebar-switch').on('click',function(){
        $('#sidebar').removeClass('mini-sidebar');
	//221024: 调整左导航展开时,点击图标锚定定位失效
        //$('.sidebar-nav .change-href').attr('href','javascript:;');

    }); 
 
    // Trigger Resizable Function
    var isMin = false,
        isMobileMin = false;
    function trigger_resizable( isNoAnim ) {
        if( (theme.minNav == '1' && !isMin && 767.98<$(window).width() )||(!isMin && 767.98<$(window).width() && $(window).width()<1024) ){
            //$('#mini-button').removeAttr('checked');
            $('#mini-button').prop('checked', false);
            trigger_lsm_mini(isNoAnim);
            isMin = true;
            if(isMobileMin){
                $('#sidebar').addClass('mini-sidebar');
                $('.sidebar-nav .change-href').each(function(){$(this).attr('href',$(this).data('change'))});
                isMobileMin = false;
            }
        }
        else if( ( theme.minNav != '1')&&((isMin && $(window).width()>=1024) || ( isMobileMin && !isMin && $(window).width()>=1024 ) ) ){
            $('#mini-button').prop('checked', true);
            trigger_lsm_mini(isNoAnim);
            isMin = false;
            if(isMobileMin){
                isMobileMin = false;
            }
        }
        else if($(window).width() < 767.98 && $('#sidebar').hasClass('mini-sidebar')){
            $('#sidebar').removeClass('mini-sidebar');
	    //221024: 调整左导航展开时,点击图标锚定定位失效
            //$('.sidebar-nav .change-href').attr('href','javascript:;');
            isMobileMin = true;
            isMin = false;
        }
    }
    // sidebar-menu-inner收缩展开
    $('.sidebar-menu-inner a').on('click',function(){//.sidebar-menu-inner a //.has-sub a  

        //console.log('--->>>'+$(this).find('span').text());
        if (!$('.sidebar-nav').hasClass('mini-sidebar')) {//菜单栏没有最小化   
            $(this).parent("li").siblings("li.sidebar-item").children('ul').slideUp(200);
            if ($(this).next().css('display') == "none") { //展开
                //展开未展开
                // $('.sidebar-item').children('ul').slideUp(300);
                $(this).next('ul').slideDown(200);
                $(this).parent('li').addClass('sidebar-show').siblings('li').removeClass('sidebar-show');
            }else{ //收缩
                //收缩已展开
                $(this).next('ul').slideUp(200);
                //$('.sidebar-item.sidebar-show').removeClass('sidebar-show');
                $(this).parent('li').removeClass('sidebar-show');
            }
        }
    });
    //菜单栏最小化
    $('#mini-button').on('click',function(){
        trigger_lsm_mini(false);

    });
    function trigger_lsm_mini(isNoAnim){
        if ($('.header-mini-btn input[type="checkbox"]').prop("checked")) {
            $('.sidebar-nav').removeClass('mini-sidebar');
	    //221024: 调整左导航展开时,点击图标锚定定位失效
            //$('.sidebar-nav .change-href').attr('href','javascript:;');
            $('.sidebar-menu ul ul').css("display", "none");
            if(isNoAnim){
                $('.sidebar-nav').removeClass('animate-nav');
                $('.sidebar-nav').width(220);
            }
            else{
                $('.sidebar-nav').addClass('animate-nav');
                $('.sidebar-nav').stop().animate({width: 170},200);
            }
        }else{
            $('.sidebar-item.sidebar-show').removeClass('sidebar-show');
            $('.sidebar-menu ul').removeAttr('style');
            $('.sidebar-nav').addClass('mini-sidebar');
            $('.sidebar-nav .change-href').each(function(){$(this).attr('href',$(this).data('change'))});
            if(isNoAnim){
                $('.sidebar-nav').removeClass('animate-nav');
                $('.sidebar-nav').width(60);
            }
            else{
                $('.sidebar-nav').addClass('animate-nav');
                $('.sidebar-nav').stop().animate({width: 60},200);
            }
        }
        //$('.sidebar-nav').css("transition","width .3s");
    }
    //显示2级悬浮菜单
    $(document).on('mouseover','.mini-sidebar .sidebar-menu ul:first>li,.mini-sidebar .flex-bottom ul:first>li',function(){
        var offset = 2;
        if($(this).parents('.flex-bottom').length!=0)
            offset = -3;
        $(".sidebar-popup.second").length == 0 && ($("body").append("<div class='second sidebar-popup sidebar-menu-inner text-sm'><div></div></div>"));
        $(".sidebar-popup.second>div").html($(this).html());
        $(".sidebar-popup.second").show();
        var top = $(this).offset().top - $(window).scrollTop() + offset; 
        var d = $(window).height() - $(".sidebar-popup.second>div").height();
        if(d - top <= 0 ){
            top  = d >= 0 ?  d - 8 : 0;
        }
        $(".sidebar-popup.second").stop().animate({"top":top}, 50);
    });
    //隐藏悬浮菜单面板
    $(document).on('mouseleave','.mini-sidebar .sidebar-menu ul:first, .mini-sidebar .slimScrollBar,.second.sidebar-popup',function(){
        $(".sidebar-popup.second").hide();
    });
    //常驻2级悬浮菜单面板
    $(document).on('mouseover','.mini-sidebar .slimScrollBar,.second.sidebar-popup',function(){
        $(".sidebar-popup.second").show();
    });
 
    $(document).on('click', '.ajax-cm-home .ajax-cm', function(event) {
        event.preventDefault();
        var t = $(this); 
        var id = t.data('id');
        var box = $(t.attr('href')).children('.site-list');
        //console.log(box.children('.url-card').length);
        if( box.children('.url-card').length==0 ){ 
            t.addClass('disabled');
            $.ajax({
                url: theme.ajaxurl,
                type: 'POST', 
                dataType: 'html',
                data : {
                    action: t.data('action'),
                    term_id: id,
                },
                cache: true,
            })
            .done(function(response) { 
                if (response.trim()) { 
                    var url = $(response);
                    box.html(url);
                    if(isPC()) url.find('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
                } else { 
                }
                t.removeClass('disabled');
            })
            .fail(function() { 
                t.removeClass('disabled');
            }) 
        }
    });

    //首页tab模式请求内容
    $(document).on('click', '.ajax-list a', function(event) {
        event.preventDefault();
        loadAjax( $(this), $(this).parents('.ajax-list') , '.'+$(this).data('target'));
    });

    $(document).on('click', '.ajax-list-home a', function(event) {
        event.preventDefault();
        loadAjax( $(this), $(this).parents('.ajax-list-home'), '.ajax-'+$(this).parents('.ajax-list-home').data('id') );
    });

    function loadAjax(t,parent,body){
        if( !t.hasClass('active') ){ 
            parent.find('a').removeClass('active');
            t.addClass('active');
            if($(body).children(".ajax-loading").length == 0)
                $(body).append('<div class="ajax-loading text-center rounded" style="position:absolute;display:flex;left:0;width:100%;top:-1rem;bottom:.5rem;background:rgba(125,125,125,.5)"><div class="col align-self-center"><i class="iconfont icon-loading icon-spin icon-2x"></i></div></div>');
            $.ajax({
                url: theme.ajaxurl,
                type: 'POST', 
                dataType: 'html',
                data : t.data(),
                cache: true,
            })
            .done(function(response) { 
                if (response.trim()) { 
                    $(body).html('');
                    $(body).append(response); 
                    //if(theme.lazyload == '1') {
                    //    $(body+" img.lazy").lazyload();
                    //} 
                    var url =  $(body).children('#ajax-cat-url').data('url');
                    if(url)
                        t.parents('.d-flex.flex-fill.flex-tab').children('.btn-move.tab-move').show().attr('href', url);
                    else
                        t.parents('.d-flex.flex-fill.flex-tab').children('.btn-move.tab-move').hide();
                    if(isPC()) $('.ajax-url [data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
                } else { 
                    $('.ajax-loading').remove();
                }
            })
            .fail(function() { 
                $('.ajax-loading').remove();
            }) 
        }
    }
    

    // 搜索模块 -----------------------
    function intoSearch() {
        if(window.localStorage.getItem("searchlist")){
            $(".hide-type-list input#"+window.localStorage.getItem("searchlist")).prop('checked', true);
            $(".hide-type-list input#m_"+window.localStorage.getItem("searchlist")).prop('checked', true);
        }
        if(window.localStorage.getItem("searchlistmenu")){
            $('.s-type-list.big label').removeClass('active');
            $(".s-type-list [data-id="+window.localStorage.getItem("searchlistmenu")+"]").addClass('active');
        }
        toTarget($(".s-type-list.big"),false,false);
        $('.hide-type-list .s-current').removeClass("s-current");
        $('.hide-type-list input:radio[name="type"]:checked').parents(".search-group").addClass("s-current"); 
        $('.hide-type-list input:radio[name="type2"]:checked').parents(".search-group").addClass("s-current");

        $(".super-search-fm").attr("action",$('.hide-type-list input:radio:checked').val());
        $(".search-key").attr("placeholder",$('.hide-type-list input:radio:checked').data("placeholder")); 
        if(window.localStorage.getItem("searchlist")=='type-zhannei'){
            $(".search-key").attr("zhannei","true"); 
        }
    }
    $(document).on('click', '.s-type-list label', function(event) {
        //event.preventDefault();
        $('.s-type-list.big label').removeClass('active');
        $(this).addClass('active');
        window.localStorage.setItem("searchlistmenu", $(this).data("id"));
        var parent = $(this).parents(".s-search");
        parent.find('.search-group').removeClass("s-current");
        parent.find('#'+$(this).attr("for")).parents(".search-group").addClass("s-current"); 
        toTarget($(this).parents(".s-type-list"),false,false);
    });
    $('.hide-type-list .search-group input').on('click', function() {
        var parent = $(this).parents(".s-search");
        window.localStorage.setItem("searchlist", $(this).attr("id").replace("m_",""));
        parent.children(".super-search-fm").attr("action",$(this).val());
        parent.find(".search-key").attr("placeholder",$(this).data("placeholder"));

        if($(this).attr('id')=="type-zhannei" || $(this).attr('id')=="m_type-zhannei")
            parent.find(".search-key").attr("zhannei","true");
        else
            parent.find(".search-key").attr("zhannei","");

        parent.find(".search-key").select();
        parent.find(".search-key").focus();
    });
    $(document).on("submit", ".super-search-fm", function() {
        var key = encodeURIComponent($(this).find(".search-key").val())
        if(key == "")
            return false;
        else{
            window.open( $(this).attr("action") + key);
            return false;
        }
    });
    function getSmartTipsGoogle(value,parents) {
        $.ajax({
            type: "GET",
            url: "//suggestqueries.google.com/complete/search?client=firefox&callback=iowenHot",
            async: true,
            data: { q: value },
            dataType: "jsonp",
            jsonp: "callback",
            success: function(res) {
                var list = parents.children(".search-smart-tips");
                list.children("ul").text("");
                tipsList = res[1].length;
                if (tipsList) {
                    for (var i = 0; i < tipsList; i++) {
                        list.children("ul").append("<li>" + res[1][i] + "</li>");
                        list.find("li").eq(i).click(function() {
                            var keyword = $(this).html();
                            parents.find(".smart-tips.search-key").val(keyword);
                            parents.children(".super-search-fm").submit();
                            list.slideUp(200);
                        });
                    };
                    list.slideDown(200);
                } else {
                    list.slideUp(200)
                }
            },
            error: function(res) {
                tipsList = 0;
            }
        })
    }
    function getSmartTipsBaidu(value,parents) {
        $.ajax({
            type: "GET",
            url: "//sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?cb=iowenHot",
            async: true,
            data: { wd: value },
            dataType: "jsonp",
            jsonp: "cb",
            success: function(res) {
                var list = parents.children(".search-smart-tips");
                list.children("ul").text("");
                tipsList = res.s.length;
                if (tipsList) {
                    for (var i = 0; i < tipsList; i++) {
                        list.children("ul").append("<li>" + res.s[i] + "</li>");
                        list.find("li").eq(i).click(function() {
                            var keyword = $(this).html();
                            parents.find(".smart-tips.search-key").val(keyword);
                            parents.children(".super-search-fm").submit();
                            list.slideUp(200);
                        });
                    };
                    list.slideDown(200);
                } else {
                    list.slideUp(200)
                }
            },
            error: function(res) {
                tipsList = 0;
            }
        })
    }
    var listIndex = -1;
    var parent;
    var tipsList = 0;
    var isZhannei = false;
    $(document).on("blur", ".smart-tips.search-key", function() {
        parent = '';
        $(".search-smart-tips").delay(150).slideUp(200)
    });
    $(document).on("focus", ".smart-tips.search-key", function() {
        isZhannei = $(this).attr('zhannei')!=''?true:false;
        parent = $(this).parents('#search');
        if ($(this).val() && !isZhannei) {
            switch(theme.hotWords) {
                case "baidu": 
                    getSmartTipsBaidu($(this).val(),parent)
                    break;
                case "google": 
                    getSmartTipsGoogle($(this).val(),parent)
                    break;
                default: 
            } 
        }
    });
    $(document).on("keyup", ".smart-tips.search-key", function(e) {
        isZhannei = $(this).attr('zhannei')!=''?true:false;
        parent = $(this).parents('#search');
        if ($(this).val()) {
            if (e.keyCode == 38 || e.keyCode == 40 || isZhannei) {
                return
            }
            switch(theme.hotWords) {
                case "baidu": 
                    getSmartTipsBaidu($(this).val(),parent)
                    break;
                case "google": 
                    getSmartTipsGoogle($(this).val(),parent)
                    break;
                default: 
            } 
            listIndex = -1;
        } else {
            $(".search-smart-tips").slideUp(200)
        }
    });
    $(document).on("keydown", ".smart-tips.search-key", function(e) {
        parent = $(this).parents('#search');
        if (e.keyCode === 40) {
            listIndex === (tipsList - 1) ? listIndex = 0 : listIndex++;
            parent.find(".search-smart-tips ul li").eq(listIndex).addClass("current").siblings().removeClass("current");
            var hotValue = parent.find(".search-smart-tips ul li").eq(listIndex).html();
            parent.find(".smart-tips.search-key").val(hotValue)
        }
        if (e.keyCode === 38) {
            if (e.preventDefault) {
                e.preventDefault()
            }
            if (e.returnValue) {
                e.returnValue = false
            }
            listIndex === 0 || listIndex === -1 ? listIndex = (tipsList - 1) : listIndex--;
            parent.find(".search-smart-tips ul li").eq(listIndex).addClass("current").siblings().removeClass("current");
            var hotValue = parent.find(".search-smart-tips ul li").eq(listIndex).html();
            parent.find(".smart-tips.search-key").val(hotValue)
        }
    });
    $('.nav-login-user.dropdown').hover(function(){
        if(!$(this).hasClass('show'))
            $(this).children('a').click();
    },function(){
        //$(this).removeClass('show');
        //$(this).children('a').attr('aria-expanded',false);
        //$(this).children('.dropdown-menu').removeClass('show');
    });
    $('#add-new-sites-modal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); 
        var modal = $(this);
        modal.find('[name="term_id"]').val(  button.data('terms_id') );
        modal.find('[name="url"]').val(  button.data('new_url') );
        modal.find('[name="url_name"]').val('');
        modal.find('[name="url_summary"]').removeClass('is-invalid').val('');
        button.data('new_url','');
        var _url = modal.find('[name="url"]').val();
        if(_url!=''){
            getUrlInfo(_url,modal);
            urlStartValue = _url;
        }
    });
    var urlStartValue = '';
    $('#modal-new-url').on('blur',function(){
        var t = $(this);
        if(t.val()!=''){
            if(isURL(t.val())){
                if(urlStartValue!=t.val()){
                    urlStartValue = t.val();
                    getUrlInfo(t.val(),$('.add_new_sites_modal'));
                }
            }else{
                showAlert(JSON.parse('{"status":4,"msg":"URL 无效！"}'));
            }
        }
    });
    $('#modal-new-url-summary').on('blur',function(){
        var t = $(this);
        if(t.val()!=''){
            t.removeClass('is-invalid');
        }
    });
    function getUrlInfo(_url,modal){
        $('#modal-new-url-ico').show();
		$.post("//apiv2.iotheme.cn/webinfo/get.php", { url: _url ,key: theme.apikey },function(data,status){ 
			if(data.code==0){
                $('#modal-new-url-ico').hide();
				$("#modal-new-url-summary").addClass('is-invalid');
			}
			else{
                $('#modal-new-url-ico').hide();
                if(data.site_title=="" && data.site_description==""){
                    $("#modal-new-url-summary").addClass('is-invalid');
                }else{
                    modal.find('[name="url_name"]').val(data.site_title);   
                    modal.find('[name="url_summary"]').val(data.site_description);
                }
			}
		}).fail(function () {
            $('#modal-new-url-ico').hide();
			$(".refre_msg").html('访问超时，请再试试，或者手动填写').show(200).delay(4000).hide(200);
		});
    }
})(jQuery);
function isURL(URL){
    var str=URL;
    var Expression=/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    var objExp=new RegExp(Expression);
    if(objExp.test(str)==true){
        return true;
    }else{
        return false;
    }
}
function isPC() {
    let u = navigator.userAgent;
    let Agents = ["Android", "iPhone", "webOS", "BlackBerry", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    let flag = true;
    for (let i = 0; i < Agents.length; i++) {
        if (u.indexOf(Agents[i]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
function chack_name(str){
    //var pattern = RegExp(/[( )(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\»)(\«)(\")(\")(\?)(\)]+/);
    var pattern = RegExp(/[( )(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\*)(\()(\))(\+)(\=)(\[)(\])(\{)(\})(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\»)(\«)(\")(\")(\?)(\)]+/);
    if (pattern.test(str)){
        return true;
    }
    return false;
}

/**
 * Minified by jsDelivr using Terser v5.3.5.
 * Original file: /npm/js-base64@3.6.0/base64.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):function(){const r=e.Base64,o=t();o.noConflict=()=>(e.Base64=r,o),e.Meteor&&(Base64=o),e.Base64=o}()}("undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:this,(function(){"use strict";const e="3.6.0",t="function"==typeof atob,r="function"==typeof btoa,o="function"==typeof Buffer,n="function"==typeof TextDecoder?new TextDecoder:void 0,a="function"==typeof TextEncoder?new TextEncoder:void 0,f=[..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="],i=(e=>{let t={};return e.forEach(((e,r)=>t[e]=r)),t})(f),c=/^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/,u=String.fromCharCode.bind(String),s="function"==typeof Uint8Array.from?Uint8Array.from.bind(Uint8Array):(e,t=(e=>e))=>new Uint8Array(Array.prototype.slice.call(e,0).map(t)),d=e=>e.replace(/[+\/]/g,(e=>"+"==e?"-":"_")).replace(/=+$/m,""),l=e=>e.replace(/[^A-Za-z0-9\+\/]/g,""),h=e=>{let t,r,o,n,a="";const i=e.length%3;for(let i=0;i<e.length;){if((r=e.charCodeAt(i++))>255||(o=e.charCodeAt(i++))>255||(n=e.charCodeAt(i++))>255)throw new TypeError("invalid character found");t=r<<16|o<<8|n,a+=f[t>>18&63]+f[t>>12&63]+f[t>>6&63]+f[63&t]}return i?a.slice(0,i-3)+"===".substring(i):a},p=r?e=>btoa(e):o?e=>Buffer.from(e,"binary").toString("base64"):h,y=o?e=>Buffer.from(e).toString("base64"):e=>{let t=[];for(let r=0,o=e.length;r<o;r+=4096)t.push(u.apply(null,e.subarray(r,r+4096)));return p(t.join(""))},A=(e,t=!1)=>t?d(y(e)):y(e),b=e=>{if(e.length<2)return(t=e.charCodeAt(0))<128?e:t<2048?u(192|t>>>6)+u(128|63&t):u(224|t>>>12&15)+u(128|t>>>6&63)+u(128|63&t);var t=65536+1024*(e.charCodeAt(0)-55296)+(e.charCodeAt(1)-56320);return u(240|t>>>18&7)+u(128|t>>>12&63)+u(128|t>>>6&63)+u(128|63&t)},g=/[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g,B=e=>e.replace(g,b),x=o?e=>Buffer.from(e,"utf8").toString("base64"):a?e=>y(a.encode(e)):e=>p(B(e)),C=(e,t=!1)=>t?d(x(e)):x(e),m=e=>C(e,!0),U=/[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g,F=e=>{switch(e.length){case 4:var t=((7&e.charCodeAt(0))<<18|(63&e.charCodeAt(1))<<12|(63&e.charCodeAt(2))<<6|63&e.charCodeAt(3))-65536;return u(55296+(t>>>10))+u(56320+(1023&t));case 3:return u((15&e.charCodeAt(0))<<12|(63&e.charCodeAt(1))<<6|63&e.charCodeAt(2));default:return u((31&e.charCodeAt(0))<<6|63&e.charCodeAt(1))}},w=e=>e.replace(U,F),S=e=>{if(e=e.replace(/\s+/g,""),!c.test(e))throw new TypeError("malformed base64.");e+="==".slice(2-(3&e.length));let t,r,o,n="";for(let a=0;a<e.length;)t=i[e.charAt(a++)]<<18|i[e.charAt(a++)]<<12|(r=i[e.charAt(a++)])<<6|(o=i[e.charAt(a++)]),n+=64===r?u(t>>16&255):64===o?u(t>>16&255,t>>8&255):u(t>>16&255,t>>8&255,255&t);return n},E=t?e=>atob(l(e)):o?e=>Buffer.from(e,"base64").toString("binary"):S,v=o?e=>s(Buffer.from(e,"base64")):e=>s(E(e),(e=>e.charCodeAt(0))),D=e=>v(z(e)),R=o?e=>Buffer.from(e,"base64").toString("utf8"):n?e=>n.decode(v(e)):e=>w(E(e)),z=e=>l(e.replace(/[-_]/g,(e=>"-"==e?"+":"/"))),T=e=>R(z(e)),Z=e=>({value:e,enumerable:!1,writable:!0,configurable:!0}),j=function(){const e=(e,t)=>Object.defineProperty(String.prototype,e,Z(t));e("fromBase64",(function(){return T(this)})),e("toBase64",(function(e){return C(this,e)})),e("toBase64URI",(function(){return C(this,!0)})),e("toBase64URL",(function(){return C(this,!0)})),e("toUint8Array",(function(){return D(this)}))},I=function(){const e=(e,t)=>Object.defineProperty(Uint8Array.prototype,e,Z(t));e("toBase64",(function(e){return A(this,e)})),e("toBase64URI",(function(){return A(this,!0)})),e("toBase64URL",(function(){return A(this,!0)}))},O={version:e,VERSION:"3.6.0",atob:E,atobPolyfill:S,btoa:p,btoaPolyfill:h,fromBase64:T,toBase64:C,encode:C,encodeURI:m,encodeURL:m,utob:B,btou:w,decode:T,isValid:e=>{if("string"!=typeof e)return!1;const t=e.replace(/\s+/g,"").replace(/=+$/,"");return!/[^\s0-9a-zA-Z\+/]/.test(t)||!/[^\s0-9a-zA-Z\-_]/.test(t)},fromUint8Array:A,toUint8Array:D,extendString:j,extendUint8Array:I,extendBuiltins:()=>{j(),I()},Base64:{}};return Object.keys(O).forEach((e=>O.Base64[e]=O[e])),O}));
/**
 * Chrome Bookmarks Converter
 * v1.0.0
 *
 * Convert a standard exported Google Chrome bookmarks HTML file into a JavaScript oject structure.
 * 
 * Dependencies: jQuery (latest).
 *
 * @summary Use JavaScript to convert an exported Chrome bookmarks HTML file. Export the results to JSON.
 * @author Jason Snelders <jason@jsnelders.com>
 *
 * Created at     : 2019-11-14 22:34:00
 * Last modified  : 2019-11-14 22:34:00
 */