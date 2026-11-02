/**
 * 第四套界面导航页主逻辑
 */

/* globals requirejs */

//取消对全局键交互逻辑模块的依赖
// window.Config = { apkGlobalKeyDownModule: '' };

/**
 * [baseUrl 配置第四套的导航页面的模块名称]
 */
requirejs.config({
    baseUrl: '../lib/js/common',
    paths: {
        'jquery': '../pulgin/jquery',
        'juicer': '../pulgin/juicer',
        'indexConfig': './logic/indexConfig',
        'juicerData': '../../../index/js/juicerData',
        'parseWeather': '../../../index/js/parseWeather',
        'weatherData': '../../../index/js/weatherData',
        'sort': '../../../index/js/sort',
        'common': '../../../index/js/common',
        'indexText': '../../../index/js/index-' + Config.LANGUAGE_CODE
    },

    //加载css文件需要的配置
    map: {
        '*': {
            'css': '../pulgin/css'
        }
    },

    shim: {
        'juicer': {
            exports: 'juicer'
        }
    }
});

requirejs(['juicer',
        'jquery',
        'globalKeyDown',
        'indexConfig',
        'juicerData',
        'globalStatic',
        'apkGlobalStatic',
        'indexText',
        'url',
        'common',
        'apkTools',
        'tools',
    ],

    function(juicer, $, globalKeyDown, indexConfig, jData, GS, agbs, GL, url, common, aTools) {

        //导航页常量值定义
        var INDEX_CUR_02 = 'indexCur02', //记录首页二级菜单的位置的key值
            INDEX_CUR_03 = 'indexCur03', //记录首页二级菜单的偏移位置的key值

            SHOW_SUB_MEUN_LENGTH = 7, //允许的二级菜单最大长度

            INIT_SUB_HEIGHT = 7, //初始的二级菜单的高度

            PER_LINE_HEIGHT = 100, //二级菜单移动一行的距离

            ACTVIE = 'active', //焦点的样式类名

            ANIMATION_CSS = 'active animation', //焦点的样式类名动画

            SUB_ACTIVE = 'activeFlag', // 标识性的焦点类名

            ANIMATION_ACTIVEFLAG_CSS = 'activeFlag animation'; //标识性的焦点类名动画

        var tplContent = juicer('#contentTemplate'),
            tplBanner = juicer('#bannerTemplate'),
            footer = juicer('#footerTemplate');


        /**
         * 标识adv二级栏目被推荐
         */
        var advRecommendNum = 0;

        /**
         * 操作页面的dom节点变量
         */
        var domTitleList, //一级标题节点数组
            domSubMenuArry, // 屏幕模块数组
            curIndexList, // 二级节点数组
            domContentBase = $('.center-box'), //内容模块的承载容器
            domBannerLayerOne, //广告图片渲染层一
            domBannerLayerTwo, //广告图片渲染层二
            domBanner, //当前可以显示的banner模块元素
            domBulletin, // 承载显示公告的容器
            domCurBanner, // 当前显示的banner模块元素
            domAlertBoxList, // 进入直播的提示框焦点列表
            domHeader, //页头的元素
            domFooter, //页脚的元素
            domScreenLayer, // 内容的整体布局节点
            domLiNum = null;
        //公告板用的变量
        var noticeScrollHeight = jData.contentBodyObj.noticeScrollHeight,
            timerBgPic = -1,
            noticeCountPage;
        // 模块通用的变量
        var keyDownLock = true, //按键的键盘锁
            enterLock = true, //进入二级模块的方法加锁
            twoModelDetail = 0, //二级数据模块
            offsetCursor = 0, //焦点的偏移量
            bannerImageIndex = 0, // banner广告的索引
            bannerImageUrlArr = []; //banner广告的数组
        var defHomeFocusPosi = termConfig.getByKeyEx("DefHomeFocusPosi", "0"); //值定义： 0，影片点播（默认）； 1，频道直播
        var allowBackToWelcome = termConfig.getByKeyEx("AllowBackToWelcome", "0"); //是否跳转欢迎页 0，不跳转； 1，跳转
        var datas=[];
        /**
         * [通过自执行函数加载页面的初始数据]
         */
        (function() {
            //二级菜单允许的最大宽度
            tools.ALLOW_NAME_MAX_PX = 206;
            tools.ALLOW_TITLE_MAX_PX = 206;

            //注册juicer的方法
            registerFunction();
            // alert("启动index页面");
            if (storage.getVolatileVariable('Portal.ProcShowBulletinAtBootup', '0') === '0') {
                //每次启动终端后，加载缓存一次portal的背景图片,
                var apkbgimage = apk.getWpkgMaterial('apklaunchimage');
                if(apkbgimage) {
                    var imagepath = storage.getCacheFileOfOss($.parseJSON(apkbgimage).content);
                    if(imagepath != null && imagepath != ""){
                        storage.setPersistVariable("apklaunchimage",imagepath);
                    }
                }

                try{
                    //加载动态设置的背景图片后，再次设置背景透明
                    bgMedia.setApkBgTransparent();
                    //每次启动终端后，清除第三方应用账号等缓存信息，传入第三方应用的包名
                    apk.clearApplicationData("com.ktcp.video");
                    apk.clearApplicationData("com.tencent.qqmusictv");
                }catch(e){}
            }

            var bgImage=apk.getWpkgMaterial('背景图片');
            var bgImgaes="";
            if(bgImage){
                bgImgaes = apk.getFileUrlPrefix()+$.parseJSON(bgImage).content;
                console.log("背景图片-》"+bgImgaes);
            }
            //获取设置当前套系的背景图片
            storage.setVolatileVariable(GS.BG_IMG_PATH, bgImgaes);
            storage.setVolatileVariable(GS.THE_PAGE_KINDEOF, '5');

            if(storage.getVolatileVariable("curindex_s")&&storage.getVolatileVariable("offsetCursor")){
                jData.curIndex_s=parseInt(storage.getVolatileVariable("curindex_s"));
                offsetCursor=parseInt(storage.getVolatileVariable("offsetCursor"));
            }
            // alert("offsetcursor->"+offsetCursor+"<>"+jData.curIndex_s);
            var cloumns= storage.getPersistVariable('index_s');
            // alert("cloumns->"+JSON.stringify(cloumns));
            if(cloumns){
                datas=$.parseJSON(cloumns);
                var dataList=datas;
                jData.showSubMenuArr=dataList.slice(offsetCursor*6,datas.length);
            }
            for (var i = 0; i < jData.showSubMenuArr.length; i++) {
                jData.showIndexIcon[i]=jData.showSubMenuArr[i].src;
            }
            //获取logo
            var lo = apk.getHotelLogo();
            console.log("logo->"+lo);
            if (lo) {
                jData.logoImg = lo;
            } else {
                jData.logoImg = '';
            }
            // alert("图标-》"+JSON.stringify(jData.showIndexIcon));
            //渲染页面内容
            renderContent(false);

        })();

        //离开首页的时候进行焦点记忆
        window.onbeforeunload = function() {
            storage.setVolatileVariable(INDEX_CUR_02, parseInt(jData.cursorIndex));
            storage.setVolatileVariable(INDEX_CUR_03, parseInt(offsetCursor));
            //当离开首页时记录banner图片的当前的索引
            storage.setVolatileVariable('bannerShowId', parseInt(jData.bannerImageIndex));
            //当离开首页时,上报当前显示广告的时间
            if (jData.titleCursorIndex === 0) {
                common.bannerHideTime = new Date();
                var switchTime = common.getBannerImgChanngeTime();
                if (common.bannerShowTime() && common.bannerHideTime) {
                    common.bannerTimeDiff = common.bannerHideTime.getTime() - common.bannerShowTime().getTime();
                    if (common.bannerTimeDiff < switchTime) {
                        adv.reportAdvStatistic(common.advImgId[jData.bannerImageIndex],
                            common.bannerTimeDiff);
                    }
                }
            }

            //记录离开首页时精彩推荐的焦点位置和栏目名称
            if (twoModelDetail.advTag !== 'undefined' && twoModelDetail.advTag === 'adv') {
                //精彩推荐下的栏目上报
                apk.reportColumnStat(twoModelDetail.delfaultName, 1);
                if (!isNaN(twoModelDetail.sortNum) && twoModelDetail.sortNum !== '' && twoModelDetail.sortNum !== 'undefined') {
                    storage.setVolatileVariable('sortNum', parseInt(twoModelDetail.sortNum));
                }
            }
            // storage.setVolatileVariable(INDEX_CUR_04, parseInt(showModeColMax));
            // storage.setVolatileVariable(INDEX_CUR_05, baseIndexArr[jData.titleCursorIndex][logicIndex].name);
            // storage.setVolatileVariable(INDEX_CUR_06, baseIndexArr[jData.titleCursorIndex].length);
            // storage.setVolatileVariable(INDEX_CUR_07, mermoryCursor);
        };

        function showIcon(cloumn) {
            if(cloumn.length<=6){
                $(".down").hide();
                $(".upward").hide();
            }else{
                if(offsetCursor==0){
                    $(".upward").hide();
                    $(".down").show();
                }else{
                    $(".upward").show();
                    $(".down").hide();
                }
            }
        }

        /**
         * [movieRecomendShow 判断影片模块是否需要推荐]
         * @return 返回是否需要推荐true/false
         */
        function movieRecomendShow() {
            for (var i = 0; i < jData.firstNavData.length; i++) {
                if (jData.firstNavData[i].key && jData.firstNavData[i].key !== '') {
                    if (jData.firstNavData[i].key === 'vod') {
                        if (tools.isNeedRecommend(jData.firstNavData[i].name)) {
                            $(".nav-one-movielogo").css('display', 'block');
                            return;
                        } else {
                            $(".nav-one-movielogo").css('display', 'none');
                            return;
                        }
                    }
                }
            }
        }

        /**
         * [modelRecommendDis 取消客房模块推荐角标]
         * @return 返回是否需要推荐true/false
         */
        function modelRecommendDis() {
            for (var i = 0; i < jData.firstNavData.length; i++) {
                if (jData.firstNavData[i].key && jData.firstNavData[i].key === 'vod') {
                    tools.cancelRecommend(jData.firstNavData[i].name);
                }
            }

        }
        /**
         * [registerFunction 注册juicer必须的方法]
         */
        function registerFunction() {
            //从新创建的的数组中获取指定的公告内容
            var getCurNote = function(noteObj) {
                return '<div>' + noteObj.zhArr[jData.contentBodyObj.cursorIndex - 1] + '</div>';
            };

            var computeTitleData = function(data) {
                if (data.name) {
                    // return data.name;
                    return tools.ellipsisNameLongerText(data.name, 'nav-small', 'nav-text');
                } else {
                    // return data;
                    return tools.ellipsisNameLongerText(data, 'nav-small', 'nav-text');
                }
            };


            var ellipsisText = function(data) {
                return tools.ellipsisNameLongerText(data, 'child-box-small', 'child-box');
            };


            //判断精彩推荐是否需要角标

            var advShow = function(data) {
                if (tools.isNeedRecommend(data)) {
                    return 'block';
                } else {
                    return 'none';
                }
            }



            juicer.register('getCurNote', getCurNote);
            juicer.register('ellipsisText', ellipsisText);
            juicer.register('computeTitleData', computeTitleData);
            juicer.register('advShow', advShow);
        }

        // ===== 渲染实现方法 start=====
        /**
         * [renderContent 渲染导航页面的详细内容方法]
         */
        function renderContent(isBack) {
            console.log("渲染页面");
            // setTimeout(
            // function() {
            //     // $('header').show();
            //     // $('nav').show();
            //     $('header').css('opacity', '1');
            //     $('nav').css('opacity', '1');
            // }, 30);
            if(jData.showSubMenuArr){
                // alert("当前数据-》"+jData.showSubMenuArr);
                $('#nav').html(tplContent.render(jData));
                showIcon(datas);
            }
            var indexName = storage.getPersistVariable("indexName");

            //渲染之后加载dom节点信息
            initDomInfo();
            // setTitleCursor();
            if (!isBack) {
                setTimeout(function() {
                    // 异步注册按键事件
                    globalKeyDown(keyhandle);
                    // renderBanner();
                    // alert("加载banner结束")
                    common.loadBoard(renderNote);
                }, 60);
            }
            setSubMenuCursor();

            keyDownLock = false;

            //设置影片推荐
            // movieRecomendShow();

            //设置精彩推荐一级角标
            // advFirstRecommend();

            //防止按键锁没有解开卡死界面
            setTimeout(function() {
                keyDownLock = false;
            }, 4000);

        }

        /**
         * [renderSubMenu 渲染二级菜单]
         */
        function renderSubMenu() {
            var columns = indexConfig.dataLists[jData.titleCursorIndex].showDatas;
            if (columns && columns.length > 0 && columns[0].model !== 'banner') {
                jData.showSubMenuArr = columns.slice(offsetCursor, offsetCursor + SHOW_SUB_MEUN_LENGTH);
                jData.isHasOverModel = (offsetCursor + SHOW_SUB_MEUN_LENGTH < columns.length - 1);
                $('#content_' + jData.titleCursorIndex).html(tplContent.render(jData));
                domSubMenuArry = $('#content_' + jData.titleCursorIndex + ' .text-box > div > .child-text-box');
            } else {
                $('#content_' + jData.titleCursorIndex).html('');
                jData.cursorIndex = -1;
            }

            //立即将最后一次获取的未读消息数渲染界面
            showUnreadMsgCount(
                storage.getVolatileVariable("sys.wpkg.mail.unreadCount", 0));
            //延迟一会再向服务器请求最新的未读消息数
            setTimeout(function() {
                if (new Date().getTime() - parseInt(storage.getVolatileVariable(
                    "sys.wpkg.mail.fetchUnreadCntTime", '0')) >= 6000)
                    common.fetchUnreadMsgCount(showUnreadMsgCount);
                var handler = null;
                common.newMessage(function() { //注册新消息回调
                    if (handler !== null)
                        clearTimeout(handler);
                    handler = setTimeout(function() {
                        common.fetchUnreadMsgCount(showUnreadMsgCount);
                    }, 3000);
                });
            }, 3000);
        }

        function sollName() {
            // $(domSubMenuArry).eq(jData.cursorIndex).
            // html(tools.scorllNameLonger(
            //     jData.showSubMenuArr[jData.cursorIndex].name, 'child-box-small', '.active .child-text-box'
            // ));

        }

        function setNavactiveImg() {
            var columnName = '';
            if (jData.firstNavData[jData.titleCursorIndex].name && jData.firstNavData[jData.titleCursorIndex].name !== '') {
                columnName = jData.firstNavData[jData.titleCursorIndex].name;
            } else {
                columnName = jData.firstNavData[jData.titleCursorIndex];
            }

            $(domTitleList[jData.titleCursorIndex]).children('div:eq(1)').children('div:last-child').
            html(tools.ellipsisNameLongerText(columnName, 'nav-size', 'activeFlag .nav-text'));
        }



        /**
         * [ellipsisLableText 如果显示的文件超过最大的显示区域进行剪切]
         * @return {[type]} [description]
         */
        function ellipsisSubText() {
            // $(domSubMenuArry).eq(jData.cursorIndex).
            // html(tools.ellipsisNameLongerText(
            //     jData.showSubMenuArr[jData.cursorIndex].name, 'child-box-small', 'child-text-box'));
        }

        /**
         * [turnPicReport 上一张轮播图片的上报-----实为setBannerDotsCursor方法中的拆分，因common中上报和添加焦点索引必须分开]
         */
        function turnPicReport() {
            if (common.advImgId[jData.bannerImageIndex]) {
                adv.reportAdvStatistic(common.advImgId[jData.bannerImageIndex],
                    common.getBannerImgChanngeTime());
            }
        }

        /**
         * [addCursorToPic 图片轮播后，添加索引焦点-----实为setBannerDotsCursor方法中的拆分，因common中上报和添加焦点索引必须分开]
         */
        function addCursorToPic() {
            $(domCurBanner).removeClass(ACTVIE);
            $(domCurBanner).eq(jData.bannerImageIndex).addClass(ACTVIE);
        }

        /**
         * [renderBanner 绘制banner图片内容]
         */
        function renderBanner() {
            var bannerShowId = parseInt(storage.getVolatileVariable('bannerShowId'));
            if (!isNaN(bannerShowId) && bannerShowId !== undefined) {
                bannerShowId = bannerShowId + 1;
                // alert("bannerImageUrlArr==>"+JSON.stringify(bannerImageUrlArr))
                if (bannerShowId <= bannerImageUrlArr.length - 1) {
                    jData.bannerImageIndex = bannerShowId;
                } else {
                    jData.bannerImageIndex = 0;
                }
            }

            $('#banner').html(tplBanner.render(indexConfig.dataLists[0].datas[0]));
            initDomInfo();
            common.getCursorTime();
            domBannerLayerOne.css({
                'background-image': 'url(' + bannerImageUrlArr[jData.bannerImageIndex] + ')',
            });
            domBannerLayerOne.addClass('banner-fadein');
            //如果bannerImageUrlArr的长度大于1需要切换图片，如果就一张则不需要切换
            if (bannerImageUrlArr.length > 1) {
                if (jData.bannerImageIndex === bannerImageUrlArr.length - 1) {
                    domBannerLayerTwo.css({
                        'background-image': 'url(' + bannerImageUrlArr[0] + ')',
                    });
                } else {
                    domBannerLayerTwo.css({
                        'background-image': 'url(' + bannerImageUrlArr[jData.bannerImageIndex + 1] + ')',
                    });
                }
                common.startChangeBannerTime(domBannerLayerOne, domBannerLayerTwo, turnPicReport, addCursorToPic, true);
                //下面注销掉的代码的调用，就相当于上报了两次，是错误的
                // setBannerDotsCursor();
                addCursorToPic();
            } else {
                $(domCurBanner).hide();
                common.startChangeBannerTime(domBannerLayerOne, domBannerLayerTwo, turnPicReport, addCursorToPic, true);
            }
        }

        /**
         * [advFirstRecommend 计算精彩推荐二级栏目被推荐条数]
         */
        function advFirstRecommend() {
            for (var i = 0; i < indexConfig.dataLists.length; i++) {
                if (indexConfig.dataLists[i].showDatas && indexConfig.dataLists[i].showDatas !== '') {
                    for (var j = 0; j < indexConfig.dataLists[i].showDatas.length; j++) {
                        if (indexConfig.dataLists[i].showDatas[j].advTag && indexConfig.dataLists[i].showDatas[j].advTag === 'adv') {
                            if (tools.isNeedRecommend(indexConfig.dataLists[i].showDatas[j].name)) {
                                advRecommendNum++;
                            }
                        }
                    }
                }
            }

            if (advRecommendNum === 0) {
                $(".nav-one-advlogo").css('display', 'none');
            } else {
                $(".nav-one-advlogo").css('display', 'block');
            }
        }



        /**
         * [showUnreadMsgCount 计算未读客房消息的条数]
         */
        function showUnreadMsgCount(num) {
            var firstReadOut = -1;

            for (var i = 0; i < indexConfig.dataLists.length; i++) {
                if (indexConfig.dataLists[i].showDatas && indexConfig.dataLists[i].showDatas !== '') {
                    for (var j = 0; j < indexConfig.dataLists[i].showDatas.length; j++) {
                        if (indexConfig.dataLists[i].showDatas[j].key === 'eMail') {
                            firstReadOut = i;
                        }
                    }
                }
            }

            if (num === 'undefined' || num <= 0) {
                $('.unread-img').css('display', 'none');

                $('#nav ul li').eq(firstReadOut).children('div:eq(1)').children(':first-child').css('display', 'none');

            } else {
                $('.unread-img').show();
                var Valstr = '' + (Math.min(num, 10) - 1) * -34 + '' + "px" + " " + '0';
                $('.unread-img').css('background-position', Valstr);
                $('#nav ul li').eq(firstReadOut).children('div:eq(1)').children(':first-child').css('display', 'block');
            }
            storage.setVolatileVariable("sys.wpkg.mail.unreadCount", num);
            storage.setVolatileVariable("sys.wpkg.mail.fetchUnreadCntTime", new Date().getTime());
        }


        /**
         * [renderAlertBox 渲染弹出框的代码]
         */
        function renderAlertBox() {
            domBulletin.html(tplBulletin.render(jData));
            domBulletin.addClass('show-bulletin');

            if (jData.showBox === 1) {
                domAlertBoxList = $('.botton');
            }
        }

        /**
         * [setBannerDotsCursor 设置当前banner图片的点的焦点]
         */
        function setBannerDotsCursor() {
            $(domCurBanner).removeClass(ACTVIE);
            $(domCurBanner).eq(jData.bannerImageIndex).addClass(ACTVIE);
            if (common.advImgId[jData.bannerImageIndex]) {
                console.log('===上报bannner广告===' + common.advImgId[jData.bannerImageIndex]);
                adv.reportAdvStatistic(common.advImgId[jData.bannerImageIndex],
                    common.getBannerImgChanngeTime());
            }
        }


        /**
         * [checkSubListLength 检查当前的数组的长度,如果为0返回false, >0 返回 true]
         * @return {[bool]} [如果为0返回false, >0 返回 true]
         */
        function checkSubListLength() {
            var columns = indexConfig.dataLists[jData.titleCursorIndex].showDatas;
            if (columns && columns.length > 0) {
                return true;
            } else {
                return false;
            }
        }

        /**
         * [setTitleCursor 设置一级导航焦点]
         */
        function setTitleCursor() {
            var columnName = '';
            if (jData.firstNavData[jData.titleCursorIndex].name && jData.firstNavData[jData.titleCursorIndex].name !== '') {
                columnName = jData.firstNavData[jData.titleCursorIndex].name;
            } else {
                columnName = jData.firstNavData[jData.titleCursorIndex];
            }

            $(domTitleList).removeClass(SUB_ACTIVE);
            $(domTitleList).eq(jData.titleCursorIndex).addClass(SUB_ACTIVE);

            $(domTitleList[jData.titleCursorIndex]).children('div:eq(1)').children('div:last-child').
            html(tools.scorllNameLonger(columnName, 'nav-size', '.activeFlag .nav-text'));

            $('.sub').hide();
            $('.activeFlag .sub').show();
        }

        /**
         * [setSubMenuCursor 设置二级菜单的光标]
         */
        function setSubMenuCursor() {
            curIndexList=$(".text-box .child-box");
            curIndexList.eq(jData.curIndex_s).addClass(ACTVIE).siblings(curIndexList).removeClass(ACTVIE);
            if (jData.curIndex_s !== -1) {
                sollName();
            }
        }

        /**
         * [setAlertBoxCursor 设置弹出框的焦点]
         */
        function setAlertBoxCursor() {
            domAlertBoxList.removeClass(ACTVIE);
            $(domAlertBoxList[jData.alertBox.cursorIndex]).addClass(ACTVIE);
        }

        /**
         * [setSubMenuTop 设置二级菜单的高度]
         */
        function setSubMenuTop() {
            // $(domScreenLayer).show();
            // $('#content_0').hide();
            // $('#content_1').hide();
            // var top = INIT_SUB_HEIGHT + jData.titleCursorIndex * PER_LINE_HEIGHT;
            // $(domScreenLayer).css('top', top + 'px');
        }

        /**
         * [initDomInfo 初始化dom节点信息]
         */
        function initDomInfo() {

            domSubMenuArry = $('#content_' + jData.titleCursorIndex + ' .text-box > div > .child-text-box');
            domScreenLayer = $('#content_' + jData.titleCursorIndex);
            domBannerLayerOne = $('.bannerLayerOne');
            domBannerLayerTwo = $('.bannerLayerTwo');
        }

        // ===== 渲染实现方法 end=====

        // ===== 公告板方法集 start=====
        /**
         * [renderNote 渲染公告内容]
         */
        function renderNote() {
            renderAlertBox();

            var contentHeight = $('#index_con').height(),
                p = $('#index_con div').find('p'),
                tempHeight = 0, //计算并保存内容高度的变量
                temp4 = 0,
                temp1,
                temp2,
                temp3;
            noticeScrollHeight = [];

        }

        // ===== 公告板方法集 end=====

        //===== 焦点移动实现方法 start=====
        /**
         * [keyUp 向上移动焦点的方法逻辑]
         */
        function keyUp() {
            if(jData.curIndex_s>1){
                jData.curIndex_s-=2;
                setSubMenuCursor();
                return;
            }else if(offsetCursor==1&&jData.curIndex_s<2){
                jData.curIndex_s+=4;
                offsetCursor=0;
                var dataList=datas;
                jData.showSubMenuArr=dataList.slice(offsetCursor*6,datas.length);
                for (var i = 0; i < jData.showSubMenuArr.length; i++) {
                    jData.showIndexIcon[i]=jData.showSubMenuArr[i].src;
                }
                $('#nav').html(tplContent.render(jData));
                setSubMenuCursor();
            }
            showIcon(datas);
        }

        /**
         * [keyDown 向下移动焦点的方法逻辑]
         */
        function keyDown() {
             // alert("off->"+offsetCursor+", datas->"+datas.length+", jdata->"+jData.curIndex_s);
            if(datas.length<=12){
                if(offsetCursor==0&&jData.curIndex_s<4&& datas.length>2){
                    jData.curIndex_s+=2;
                    if(jData.curIndex_s<datas.length){
                        setSubMenuCursor();
                    }else{
                        jData.curIndex_s-=1;
                        setSubMenuCursor();
                    }
                } else if(datas.length>6 && offsetCursor==0 && jData.curIndex_s>3){
                    offsetCursor=1;
                    jData.curIndex_s=0;
                    var dataList=datas;
                    jData.showSubMenuArr=dataList.slice(offsetCursor*6,datas.length);
                    for (var i = 0; i < jData.showSubMenuArr.length; i++) {
                        jData.showIndexIcon[i]=jData.showSubMenuArr[i].src;
                    }
                    $('#nav').html(tplContent.render(jData));
                    setSubMenuCursor();
                }else if(offsetCursor==1 &&datas.length-6>2&& jData.curIndex_s<datas.length-6){
                    jData.curIndex_s+=2;
                    if(jData.curIndex_s<datas.length-6){
                        setSubMenuCursor();
                    }else{
                        jData.curIndex_s-=2;
                    }
                }
                showIcon(datas);
            }else{
                alert("栏目超出12个，不能操作，请删除多余栏目");
            }
        }

        /**
         * [keyRight 向右移动焦点的方法逻辑]
         */
        function keyRight() {
            // alert("off->"+offsetCursor+", datas->"+datas.length+", jdata->"+jData.curIndex_s);
            if(datas.length<=6){
                if(jData.curIndex_s<datas.length-1&&datas.length>1){
                    jData.curIndex_s++;
                    setSubMenuCursor();
                    showIcon(datas);
                }
            }else if(datas.length>6){
                if(offsetCursor==0&&jData.curIndex_s<5){
                    jData.curIndex_s++;
                    setSubMenuCursor();
                    showIcon(datas);
                    return;
                }else if(offsetCursor==0&&jData.curIndex_s==5){
                    jData.curIndex_s=0;
                    offsetCursor=1;
                    var dataList=datas;
                    jData.showSubMenuArr=dataList.slice(offsetCursor*6,datas.length);
                    for (var i = 0; i < jData.showSubMenuArr.length; i++) {
                        jData.showIndexIcon[i]=jData.showSubMenuArr[i].src;
                    }
                    // alert("show->"+JSON.stringify(jData.showSubMenuArr));
                    $('#nav').html(tplContent.render(jData));
                    showIcon(datas);
                    setSubMenuCursor();
                    return;
                }else if(offsetCursor==1&&jData.curIndex_s<jData.showSubMenuArr.length-1){
                    jData.curIndex_s++;
                    setSubMenuCursor();
                    showIcon(datas);
                }
            }
        }

        /**
         * [keyLeft 向左移动焦点的方法逻辑]
         */
        function keyLeft() {
            if(datas.length<=6){
                if(jData.curIndex_s>0){
                    jData.curIndex_s--;
                    setSubMenuCursor();
                }
                showIcon(datas);
            }else if(datas.length>6){
                if(jData.curIndex_s>0){
                    jData.curIndex_s--;
                    setSubMenuCursor();
                    showIcon(datas);
                    return;
                }else if(offsetCursor==1&&jData.curIndex_s==0){
                    jData.curIndex_s=5;
                    offsetCursor=0;
                    var dataList=datas;
                    jData.showSubMenuArr=dataList.slice(offsetCursor*6,datas.length);
                    for (var i = 0; i < jData.showSubMenuArr.length; i++) {
                        jData.showIndexIcon[i]=jData.showSubMenuArr[i].src;
                    }
                    $('#nav').html(tplContent.render(jData));
                    showIcon(datas);
                    setSubMenuCursor();
                    return;
                }
            }
        }
        //===== 焦点移动实现方法 end=====

        /**
         * [enterykeyLogic 进入二级页面的交互逻辑]
         */
        function enterykeyLogic() {
            requirejs(['progObj'],
                function(progObj) {
                    var columns = jData.showSubMenuArr[jData.curIndex_s];
                    if (columns  && columns.model !== 'banner') {
                        //url为''时显示功能不可用
                        if (!columns.url) {
                            apk.jsShowAlert(GL.INDEX_DEVLEP_INFO);
                            return;
                        }

                        //精彩推荐进入二级取消推荐角标
                        if (columns.advTag && columns.advTag === 'adv') {
                            tools.cancelRecommend(columns.name);
                        }
                        storage.setVolatileVariable("curindex_s",JSON.stringify(jData.curIndex_s));
                        storage.setVolatileVariable("offsetCursor",JSON.stringify(offsetCursor));
                        progObj.isActiveHasData(columns, columns.url, true);
                    }
                });
        }

        /**
         * [keyhandle 导航页面的按键交互实现逻辑]
         */
        function keyhandle(keycode) {
            //$(domScreenLayer).hide();
            requirejs(['keyCode'], function(kc) {

                if (keyDownLock) {
                    return;
                }

                if ((keycode >= kc.KEY_CHARSET_0 && keycode <= kc.KEY_CHARSET_9) &&
                    jData.showBox !== 1) {
                    //直播被云端禁止,按键无法进入直播
                    if (apk.isModuleEnable("dvb") !== true) {
                        apk.jsShowAlert(GL.ERROR_CONTENT);
                        return;
                    }
                    jData.showBox = 1;
                    renderAlertBox();
                    return;
                }

                switch (keycode) {
                    case kc.KEY_UP:

                        if (jData.showBox === 1) {
                            jData.alertBox.cursorIndex = 0;
                            setAlertBoxCursor();
                            return;
                        }
                        if (jData.showBox === 0) {
                            // common.initNoticePrevPage(renderNote);
                            return;
                        }
                        keyUp();
                        $('.nav-animation').addClass('nav-animation1');
                        $('.content-box-hide').addClass('animationbox');
                        break;

                    case kc.KEY_DOWN:

                        if (jData.showBox === 1) {
                            jData.alertBox.cursorIndex = 1;
                            setAlertBoxCursor();
                            return;
                        }
                        if (jData.showBox === 0) {
                            // common.initNoticeNextPage(noticeCountPage, renderNote);
                            return;
                        }
                        keyDown();
                        $('.nav-animation').addClass('nav-animation1');
                        $('.content-box-hide').addClass('animationbox');
                        break;


                    case kc.KEY_LEFT:

                        if (jData.showBox === 1) {
                            jData.alertBox.cursorIndex = 0;
                            setAlertBoxCursor();
                            return;
                        }
                        if (jData.showBox === 0) {
                            common.initNoticePrevItem(renderNote);
                            return;
                        }
                        keyLeft();
                        $('.nav-animation').addClass('nav-animation1');
                        $('.content-box-hide').removeClass('animationbox');
                        break;

                    case kc.KEY_RIGHT:

                        if (jData.showBox === 1) {
                            jData.alertBox.cursorIndex = 1;
                            setAlertBoxCursor();
                            return;
                        }
                        if (jData.showBox === 0) {
                            common.initNoticeNextItem(renderNote);
                            return;
                        }
                        keyRight();
                        $('.nav-animation').addClass('nav-animation1');
                        $('.content-box-hide').removeClass('animationbox');
                        break;

                    case kc.KEY_ENTER:
                        if (jData.showBox === 1) {
                            if (jData.alertBox.cursorIndex) {
                                jData.showBox = 2;

                                domBulletin.removeClass('show-bulletin');
                                jData.alertBox.cursorIndex = 0;
                                renderAlertBox();
                            } else {
                                requirejs(['url'], function(url) {
                                    window.location.href = url.DVB_PAGE_PATH;
                                });
                            }
                            return;
                        }
                        if (jData.showBox === 0) {
                            jData.showBox = 2;
                            domBulletin.removeClass('show-bulletin');
                            renderAlertBox();
                            return;
                        }
                        if (enterLock) {
                            enterLock = false;
                            enterykeyLogic();
                            setTimeout(function(){
                                enterLock = true;
                            },2000);
                        }
                        break;

                    case kc.KEY_BACKSPACE:
                        window.location.href = '../index.html';
                        break;
                    case kc.KEY_MENU:
                        if (apk.isModuleEnable('vod')) {
                            // tools.loadUrl(url.VOD_PAGE_PATH);
                            return;
                        }
                        break;
                }

                if (!keyDownLock) {
                    keyDownLock = true;
                    setTimeout(function() {
                        keyDownLock = false;
                    }, 200);
                }

            });
        }

    });