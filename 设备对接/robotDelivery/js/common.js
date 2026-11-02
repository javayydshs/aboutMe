/**
 * @20170401
 * @qiugc
 * @导航页面公用的方法集合
 */
/* globals requirejs */

define(['apkGlobalStatic',
        'globalStatic',
        'juicerData',
        'indexConfig',
        'indexText',
        'parseWeather',
        'columnName',
        'url',
    ],

    function(agbs, GS, jData, indexConfig, GL, parseWeather, ColumnName,URL) {

        //常量声明
        var MEUN_MAX_LENGTH = 5; //允许的一级栏目的名称个数
        var PORTAL_ADV = 5; //index页面广告

        var cacheServiceColList = []; //保存在服务器获取的介绍栏目与酒店商城栏目

        //公告板相关的变量
        var bulletinShowAtBootup,
            contentBodyObj = jData.contentBodyObj,
            noteObj = contentBodyObj.noteObj,
            noticeCurrentPage = contentBodyObj.noticeCurrentPage,
            noticeScroll = 0;

        //banner相关的变量
        var bannerShowLayerFlag = 0, //控制双层图层显示与隐藏的开关
            bannerImageUrlArr = [], //
            isBannerShow = true;

        //首页界面上是否有客房消息模块入口
        var bHasMsgColumn = false;
        //首页各一级下所包含二级菜单的json数据
        var menuListStr = '';

        var bannerShowTime,
            bannerHideTime,
            bannerTimeDiff;

        var changeBannerTime;

        //进入首页时的各模块的使能状态
        var isDvbEnable = apk.isModuleEnable('dvb'),
            isVodEnable = apk.isModuleEnable('vod'),
            isMusicEnable = apk.isModuleEnable('music'),
            isRadioEnable = apk.isModuleEnable('radio'),
            isAdvEnable = adv.getEnableFlag();
        var modelSN = apk.getTermModel();
        /* 判断是否为图片类型 */
        function isImgType(url) {
            return url && /\.(webp|jpg|jpeg|jpe|png|bmp|gif|svg)$/i.test(url);
        }

        //将进入子栏目的旋转加载图标生成图片数据并保存到内存中
        //在子栏目中可以直接获取数据并借助canvas使用。
        //优先使用界面素材"加载图标"，其次才是默认的图标。
        //图标高宽固定为100x100像素。
        setTimeout(function() {
            var actImgUrl = './../lib/images/loading.png';
            var bgimages = apk.getWpkgMaterial('加载图标');
            bgimages = bgimages && bgimages !== '' ? $.parseJSON(bgimages) : null;
            var imgUrl = bgimages && bgimages.content ? encodeURI(bgimages.content) : null;
            if (imgUrl && imgUrl !== '') {
                var imgUrlLc = imgUrl.toLowerCase();
                var suffixs = ['.webp', '.jpg', '.jpeg', '.jpe', '.png', '.bmp'];
                for (var idx in suffixs) {
                    if (imgUrlLc.lastIndexOf(suffixs[idx]) ===
                        imgUrlLc.length - suffixs[idx].length) {
                        actImgUrl = apk.getFileUrlPrefix() + imgUrl;
                        break;
                    }
                }
            }

            var lastImgUrl = storage.getVolatileVariable('loadingIconUrl');
            if (actImgUrl === lastImgUrl) {
                return; //加载图片并未变化，无需重复加载
            }

            var img = new Image();
            img.addEventListener('load', function() {
                var canvas = document.createElement('canvas');
                canvas.width = canvas.height = 100;
                var context = canvas.getContext('2d');
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                var pixels = '';
                for (var i = 0; i < imageData.data.length; i++) {
                    if (pixels !== '') pixels += ',';
                    pixels += imageData.data[i];
                }
                storage.setVolatileVariable('loadingIcon', pixels);
                storage.setVolatileVariable('loadingIconUrl', actImgUrl);
            }, false);
            img.src = actImgUrl;
        }, 3000);

        /**
         * [getNewNodeData 获得新的导航栏目阶段数据结构]
         * @return {[type]} [description]
         */
        function getNewNodeData() {
            return {
                id: '', //唯一标识
                key: GS.STATIC, //判断进入二级模块的关键值
                name: '', //显示名字
                src: '', //非焦点图标
                activeSrc: '', //焦点图标
                url: '', //链接地址URL
                maskUrl: '',
                model: 'serverNormal',
                isCount: true, //是否需要上报栏目点击统计
                cName: '', //栏目点击统计上报时给定的栏目名称
                sortKey: 0, //排序值，在同一个显示位置下应按照排序值从大到小排列
                parentName: '', //所属一级栏目的名称
                delfaultName: '', //默认名称，通常只有预制二级栏目才有默认名称，用于通过界面素材修改预制栏目名称、图标、排序等
            };
        }

        /**
         * [changeBannerImage 改变图片显示的逻辑]
         */
        function changeBannerImage(domBannerLayerOne, domBannerLayerTwo) {
            var tempIamgeIndex = jData.bannerImageIndex + 1;
            if (tempIamgeIndex > bannerImageUrlArr.length - 1) {
                tempIamgeIndex = 0;
            }
            if (bannerShowLayerFlag & 1) {
                bannerShowLayerFlag = 0;
                domBannerLayerOne.addClass('banner-fadein');
                domBannerLayerTwo.removeClass('banner-fadein');
                bannerShowTime = new Date();
                domBannerLayerTwo.css({
                    'background-image': 'url("' + bannerImageUrlArr[tempIamgeIndex] + '")',
                });
            } else {
                bannerShowLayerFlag = 1;
                domBannerLayerTwo.addClass('advertising-index');
                domBannerLayerTwo.addClass('banner-fadein');
                domBannerLayerOne.removeClass('banner-fadein');
                bannerShowTime = new Date();
                domBannerLayerOne.css({
                    'background-image': 'url("' + bannerImageUrlArr[tempIamgeIndex] + '")',
                });
            }
        }

        /**
         * [getBannerImgChanngeTime 获取bnner图片切换的时间间隔]
         */
        function getBannerImgChanngeTime() {
            var intervalMs = 3000; //轮播间隔，单位毫秒
            var intervalSec =
                termConfig.getByKey('HotelPoster_SwitchTime');
            if (intervalSec &&
                (intervalSec = intervalSec.trim()) &&
                !isNaN(intervalSec)) {
                intervalSec = parseInt(intervalSec, 10);
                if (intervalSec < 2) intervalSec = 2;
                else if (intervalSec > 60) intervalSec = 60;
                intervalMs = intervalSec * 1000;
            }
            return intervalMs;
        }


        /**
         * [isHasPostion 判断二级栏目的所属的一级标题是不是存在]
         * @param  {[string]}  titleName [一级栏目的名称]
         * @return {Boolean}           [true:存在  false:不存在]      */
        function isHasPostion(titleName) {
            for (var i = 0; i < jData.defFirstNavData.length; i++) {
                if (titleName === jData.defFirstNavData[i]) {
                    return true;
                } else if (titleName === jData.defFirstNavDataNew[i]) {
                    return true;
                }
            }
            return false;
        }

        /**
         * [getFirstNav 获取一级导航]
         * 禁止对栏目包广告下插的一级栏目改名。
         * 对于界面素材中指定的一级栏目序号，是排除掉栏目包广告下插的一级栏目后的序号。
         *
         * [广告包栏目“meta.json”描述文件中的字段定义]
         * "names"，(必须)<对象> 定义栏目的多语种名称，
         *      示例：{"zh_CN":"中文名", "en_US":"英文名"}；
         * "url"，(可选)<字串> 定义栏目入口页面文件的相对路径，
         *      如果未指定则默认使用栏目包内的"index.html"；
         * "src"，(可选)<字串> 定义栏目入口的非焦点图标或图片，
         *      如果未指定则默认使用栏目包内的"img/src.png"；
         * "activeSrc"， (可选)<字串> 定义栏目入口的焦点图片，
         *      如果未指定则默认使用栏目包内的"img/activeSrc.png"，
         *      activeIcon和activeSrc只能二选一，如果同时给定则优先
         *      使用图片activeSrc；
         * "activeIcon"，(可选)<字串> 定义栏目入口的焦点图标，
         *      如果未指定则默认使用栏目包内的"img/activeIcon.png"，
         *      activeIcon和activeSrc只能二选一，如果同时给定则优先
         *      使用图片activeSrc；
         * "model"， (可选)<字串> 定义栏目入口的布局类型，
         *      如果未指定则默认使用非焦点图标/图片的高宽比计算，
         *      如果无法计算失败则采用默认类型"serverNormal"；
         * "sortKey"， (可选)<数字>定义栏目入口模块的排序，最大值为整数正无穷,
         *      最小值为0,并且默认值为0
         */
        function topoClumn() {
            // alert("modelSN->"+modelSN);
            //分配一级模块
            var topoJson = apk.getTopoJson();
            if(topoJson!==null) {
                topoJson = topoJson ? $.parseJSON(topoJson) : topoJson;
                // alert("拓扑数据==》"+JSON.stringify(topoJson));
                console.log("拓扑数据==》"+JSON.stringify(topoJson.childrens));
                //  alert("modelSN->"+modelSN);
                var topoClumn = topoJson.childrens;
                if (topoClumn!=null) {
                    jData.firstNavData = new Array(topoClumn.length);
                    indexConfig.dataLists = new Array(topoClumn.length)
                    // alert("jData.firstNavData=》"+JSON.stringify(topoClumn.length))
                    // jData.defFirstNavData=new Array(topoClumn.length);
                    // jData.defFirstNavDataNew=new Array(topoClumn.length);
                    bHasMsgColumn = false;
                    menuListStr = '';
                    for (var i = 0; i < topoClumn.length; i++) {
                        // alert("topoClumn==>"+JSON.stringify(topoClumn[i]));
                        var name = JSON.parse(topoClumn[i].name);
                        if (name && topoClumn[i].icon && (topoClumn[i].icon = topoClumn[i].icon.replace(/^\s+|\s+$/g, '')) &&
                            isImgType(topoClumn[i].icon)) {
                            // alert("当前图片==》"+JSON.stringify(topoClumn[i].icon))
                            jData.firstNavData[i] = name[Config.LANGUAGE_CODE];
                            // jData.defFirstNavData[i]=name[Config.LANGUAGE_CODE];
                            // jData.defFirstNavDataNew[i]=name[Config.LANGUAGE_CODE];

                            if (topoClumn[i].icon.indexOf('www') !== -1) {
                                jData.firstNavIcon[i] = agbs.LOCATION_MEDIA_PORT+topoClumn[i].icon;
                            } else {
                                var icon = topoClumn[i].icon.slice(1);
                                // alert("当前图标路径==》"+JSON.stringify(icon))
                                jData.firstNavIcon[i] = URL.GET_ICON + icon;
                            }
                            if (topoClumn[i].mask.indexOf('www') !== -1) {
                                jData.firstNavMask[i] = agbs.LOCATION_MEDIA_PORT+topoClumn[i].mask;
                            } else {
                                var mask = topoClumn[i].mask.slice(1);
                                // alert("当前图标路径==》"+JSON.stringify(icon))
                                jData.firstNavMask[i] = URL.GET_ICON + mask;
                            }

                        }
                        var obj = {
                            //焦点在一级菜单切换的焦点默认值
                            sreenDefaultCursor: 1,
                            //焦点在一级菜单切换的焦点默认值
                            leftDefaultCursor: 4,
                            //焦点在一级菜单切换的焦点默认值
                            rightDefaultCursor: 1,
                            //是不是有的广告模块
                            isHasBanner: true,

                            //经过服务器修改与排序,添加栏目广告等二级模块之后需要显示在页面上的模块数组
                            showDatas: [],
                            datas: []
                        }
                        indexConfig.dataLists[i] = obj;
                        if (!topoClumn[i].childrens) {
                            var dataObj = getNewNodeData();
                            dataObj.id = topoClumn[i].ident;
                            dataObj.key = topoClumn[i].ident;
                            dataObj.sortKey = topoClumn[i].sortKey;
                            if(topoClumn[i].icon.indexOf("8181")!=-1){
                                dataObj.src = topoClumn[i].icon;
                                dataObj.activeSrc =topoClumn[i].icon;
                            }else{
                                dataObj.src = agbs.LOCATION_MEDIA_PORT + topoClumn[i].icon;
                                dataObj.activeSrc = agbs.LOCATION_MEDIA_PORT + topoClumn[i].icon;
                            }
                            if (topoClumn[i].url.indexOf("www") !== -1) {
                                dataObj.url = agbs.LOCATION_MEDIA_PORT + topoClumn[i].url
                            } else {
                                if (modelSN && /^99/.test(modelSN)) {
                                    dataObj.url = GS.BASE_TCL_PATH + topoClumn[i].url;
                                } else {
                                    dataObj.url = GS.BASE_PATH + topoClumn[i].url;
                                }

                            }

                            dataObj.model = "normal";
                            dataObj.name = name[Config.LANGUAGE_CODE];
                            dataObj.cName = name[Config.LANGUAGE_CODE];
                            dataObj.delfaultName = name[Config.LANGUAGE_CODE];
                            dataObj.parentName = name[Config.LANGUAGE_CODE];
                            jData.firstNavData[i] = dataObj;

                            indexConfig.dataLists[i].showDatas.push(dataObj);


                        } else {
                            //二级栏目模块
                            var childrens = topoClumn[i].childrens;
                            // alert("当前二级模块===》"+JSON.stringify(childrens))
                            for (var j = 0; j < childrens.length; j++) {
                                var erName = JSON.parse(childrens[j].name);
                                var dataObj = getNewNodeData();
                                dataObj.id = childrens[j].ident;
                                dataObj.key = childrens[j].ident;
                                dataObj.sortKey = childrens[j].sortKey;
                                if(childrens[j].icon.indexOf("8181")!=-1){
                                    dataObj.src = childrens[j].icon;
                                }else{
                                    if(childrens[j].icon.indexOf("www")!=-1){
                                        dataObj.src = agbs.LOCATION_MEDIA_PORT  + childrens[j].icon;
                                    }else{
                                        dataObj.src = URL.GET_ICON  + childrens[j].icon.slice(1);
                                    }
                                }
                                dataObj.activeSrc = "";
                                if (childrens[j].url.indexOf("www") !== -1) {
                                    dataObj.url = agbs.LOCATION_MEDIA_PORT + childrens[j].url;
                                } else {
                                    if (modelSN && /^99/.test(modelSN)) {
                                        dataObj.url = GS.BASE_TCL_PATH + childrens[j].url;
                                    } else {
                                        dataObj.url = GS.BASE_PATH + childrens[j].url;
                                    }
                                }

                                dataObj.model = "normal";
                                dataObj.name = erName[Config.LANGUAGE_CODE];
                                dataObj.cName = erName[Config.LANGUAGE_CODE];
                                dataObj.delfaultName = erName[Config.LANGUAGE_CODE];
                                dataObj.parentName = name[Config.LANGUAGE_CODE];
                                // dataObj.class='c' + i + '-' + j;
                                // alert("456");
                                // alert("数组==》"+JSON.stringify(indexConfig.dataLists));
                                // indexConfig.dataLists[i].push(showDatas);
                                // alert("123");
                                indexConfig.dataLists[i].showDatas.push(dataObj);
                                // alert("当前数据=》"+indexConfig.dataLists[i].showDatas);
                                // alert("当前数据=》"+JSON.stringify(indexConfig.dataLists[i].showDatas));
                                indexConfig.dataLists[i].showDatas[j]['class'] = 'c' + i + '-' + j;
                                if (childrens[j].ident === GS.E_MAIL) {
                                    bHasMsgColumn = true;
                                }

                                //如果没有的链接pms酒馆系统 不需要显示观影记录模块
                                if (childrens[j].ident === GS.HISTORY && apk.isHasPmsConn && !apk.isHasPmsConn()) {
                                    //不显示观影记录入口
                                    continue;
                                }
                            }
                        }
                        indexConfig.serverDataLists.push(JSON.stringify(indexConfig.dataLists[i].showDatas))
                        menuListStr += JSON.stringify(indexConfig.dataLists[i].showDatas);
                    }
                    menuListStr = '[' + menuListStr + ']';
                    menuListStr = '[' + indexConfig.serverDataLists + ']';
                    storage.setVolatileVariable('menuList', menuListStr);
                }
            }
        }
        function getIntroductionCol(){
            cacheServiceColList = [];
            var columnStr = apk.getWpkgTempColumnList();
            if (columnStr) {
                console.log("后台apk请求的数据==》"+JSON.stringify(columnStr))
                var columnList = ((columnStr && columnStr !== '[]') ?
                    $.parseJSON(columnStr) : null);
                 // alert("后台apk请求的数据==》"+JSON.stringify(columnList))
                if(indexConfig.dataLists) {
                    for (var i = 0; i < indexConfig.dataLists.length; i++) {
                        var showDatas = indexConfig.dataLists[i].showDatas;
                        // alert("当前一级栏目下的二级数据-》"+JSON.stringify(showDatas))
                        if (showDatas) {
                            for (var j = 0; j < showDatas.length; j++) {
                                if (columnList && columnList.length > 0) {
                                    for (var k = 0; k < columnList.length; k++) {
                                        var colName = columnList[k].colNames;
                                        // console.log("二级栏目名称-》"+JSON.stringify(colName[Config.LANGUAGE_CODE]))
                                        if (showDatas[j].name === colName[Config.LANGUAGE_CODE]) {
                                            showDatas[j].model = getModelByRatio(
                                                columnList[k].iconWidthPix, columnList[k].iconHeightPix);
                                            showDatas[j].src = storage.getCacheFile(agbs.LOCATION_MEDIA_PORT + columnList[k].iconUrl);
                                            showDatas[j].activeIcon = storage.getCacheFile(agbs.LOCATION_MEDIA_PORT + columnList[k].icon1Url);
                                            showDatas[j].key = GS.STATIC;
                                            showDatas[j].url = showDatas[j].url + '?colId=' + columnList[k].id;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            // alert("改变后数据==》"+JSON.stringify(indexConfig.dataLists))
        }
        function getFirstNav() {
            //根据界面素材修正预制一级导航的名称和图标
            for (var i = 1; i < MEUN_MAX_LENGTH; i++) {
                //依据界面素材修正一级栏目名称
                var colName = apk.getWpkgMaterial('一级栏目名称-' + i);
                colName = colName ? $.parseJSON(colName) : colName;
                if (colName && colName.type === 0 && colName.content &&
                    (colName.content = colName.content.replace(/^\s+|\s+$/g, ''))) {
                    jData.firstNavData[i - 1] = colName.content;
                    if (Config.LANGUAGE_CODE === 'zh_CN') {
                        jData.defFirstNavData[i - 1] = colName.content;
                        jData.defFirstNavDataNew[i - 1] = colName.content;
                    }
                }

                //依据界面素材修正一级栏目图标
                var colIcon = apk.getWpkgMaterial('一级栏目图标-' + i);
                colIcon = colIcon ? $.parseJSON(colIcon) : null;
                if (colIcon && colIcon.type === 1 && colIcon.content &&
                    (colIcon.content = colIcon.content.replace(/^\s+|\s+$/g, '')) &&
                    isImgType(colIcon.content)) {
                    jData.firstNavIcon[i - 1] = agbs.LOCATION_MEDIA_PORT + colIcon.content;
                }

                //如果当前界面语种不是中文，则需要额外借助界面素材获取一级栏目的中文名称修正
                if (Config.LANGUAGE_CODE !== 'zh_CN') {
                    var colCnName = apk.getWpkgMaterial('一级栏目名称-' + i, 'zh_CN');
                    colCnName = colCnName ? $.parseJSON(colCnName) : null;
                    if (colCnName && colCnName.type === 0 && colCnName.content &&
                        (colCnName.content = colCnName.content.replace(/^\s+|\s+$/g, ''))) {
                        jData.defFirstNavData[i - 1] = colCnName.content;
                        jData.defFirstNavDataNew[i - 1] = colCnName.content;
                    }
                }
            }

            //如有广告栏目包，则需要增加对应的一级导航，并实例化这些栏目
            if (isAdvEnable &&
                adv.getAdvMaterialCount &&
                adv.getAdvMaterialByIndex &&
                adv.getColPkgEntryInfo) {
                var advCount = adv.getAdvMaterialCount(1);
                if (advCount > 0) {
                    var advFirstNavIndex = 2; //广告一级栏目的插入位置（从1开始计算）
                    var firstNavObj = null;
                    for (var i = 0; i < advCount; i++) {
                        var advDesc = adv.getAdvMaterialByIndex(1, i);
                        advDesc = advDesc ? $.parseJSON(advDesc) : null;
                        if (!advDesc || !advDesc.advId) continue;
                        var advInfo = adv.getColPkgEntryInfo(advDesc.advId);
                        advInfo = advInfo ? $.parseJSON(advInfo) : null;
                        if (!advInfo || !advInfo.dirPath || !advInfo.meta) continue;
                        var advMeta = advInfo.meta;

                        //栏目包入口页
                        if (!advMeta.url)
                            advMeta.url = 'index.html';
                        if (advMeta.url.indexOf("http://") < 0 &&
                            advMeta.url.indexOf("https://") < 0) { //本地文件
                            advMeta.url = advInfo.dirPath +
                                (advMeta.url.charAt(0) == '/' ? '' : '/') +
                                advMeta.url;
                            if (!storage.isFileExist(advMeta.url))
                                continue; //文件必须存在
                        }

                        //栏目非焦点图标或图片
                        if (!advMeta.src)
                            advMeta.src = 'img/src.png';
                        if (advMeta.src.indexOf("http://") < 0 &&
                            advMeta.src.indexOf("https://") < 0) { //本地文件
                            advMeta.src = advInfo.dirPath +
                                (advMeta.src.charAt(0) == '/' ? '' : '/') +
                                advMeta.src;
                            if (!storage.isFileExist(advMeta.src))
                                continue; //文件必须存在
                        }

                        //栏目焦点图标
                        if (!advMeta.activeIcon)
                            advMeta.activeIcon = 'img/activeIcon.png';
                        if (advMeta.activeIcon.indexOf("http://") < 0 &&
                            advMeta.activeIcon.indexOf("https://") < 0) { //本地文件
                            advMeta.activeIcon = advInfo.dirPath +
                                (advMeta.activeIcon.charAt(0) == '/' ? '' : '/') +
                                advMeta.activeIcon;
                            if (!storage.isFileExist(advMeta.activeIcon))
                                advMeta.activeIcon = ''; //如果文件不存在则需将值清除
                        }

                        //栏目焦点图片
                        if (!advMeta.activeSrc)
                            advMeta.activeSrc = 'img/activeSrc.png';
                        if (advMeta.activeSrc.indexOf("http://") < 0 &&
                            advMeta.activeSrc.indexOf("https://") < 0) { //本地文件
                            advMeta.activeSrc = advInfo.dirPath +
                                (advMeta.activeSrc.charAt(0) == '/' ? '' : '/') +
                                advMeta.activeSrc;
                            if (!storage.isFileExist(advMeta.activeSrc))
                                advMeta.activeSrc = ''; //如果文件不存在则需将值清除
                        }

                        //栏目名称，包括显示名称和统计上报名称
                        if (advMeta.names) { //优先取“names”字段定义的多语种栏目名称
                            var dstLangs = null; //语种匹配数组，按匹配程度从高到低排列
                            if (Config.LANGUAGE_CODE == 'zh_CN')
                                dstLangs = ['zh_CN', 'zh_TW', 'en_US', 'en_UK'];
                            else if (Config.LANGUAGE_CODE == 'zh_TW')
                                dstLangs = ['zh_TW', 'zh_CN', 'en_US', 'en_UK'];
                            else if (Config.LANGUAGE_CODE == 'en_US')
                                dstLangs = ['en_US', 'en_UK', 'zh_CN', 'zh_TW'];
                            else if (Config.LANGUAGE_CODE == 'en_UK')
                                dstLangs = ['en_UK', 'en_US', 'zh_CN', 'zh_TW'];
                            else
                                dstLangs = [Config.LANGUAGE_CODE, 'en_US', 'en_UK', 'zh_CN', 'zh_TW'];
                            for (var k = 0; k < dstLangs.length; k++)
                                if (advMeta.names[dstLangs[k]]) {
                                    advMeta.name = advMeta.names[dstLangs[k]];
                                    break;
                                }
                            if (!advMeta.name) continue; //必须有栏目名称
                            advMeta.cName = (advMeta.names['zh_CN'] ? advMeta.names['zh_CN'] :
                                (advMeta.names['zh_TW'] ? advMeta.names['zh_TW'] : advMeta.name));
                        } else if (advMeta.zName &&
                            Config.LANGUAGE_CODE !== 'zh_CN') { //name给定中文名、zName给定英文名
                            if (!advMeta.name) continue; //必须有栏目名称
                            advMeta.cName = advMeta.name;
                            advMeta.name = advMeta.zName;
                        } else {
                            if (!advMeta.name) continue; //必须有栏目名称
                            advMeta.cName = advMeta.name;
                        }

                        //如果没有给定model或值非法则使用默认值
                        if (!advMeta.model || advMeta.model === 'normal') {
                            advMeta.model = 'serverNormal';
                        }

                        //在一级导航数组中插入广告栏目包的一级栏目数据
                        if (!firstNavObj) {
                            jData.firstNavData.splice(advFirstNavIndex - 1, 0, GL.INDEX_RECOMMEND);
                            jData.firstNavIcon.splice(advFirstNavIndex - 1, 0, -300);
                            jData.defFirstNavData.splice(advFirstNavIndex - 1, 0, '精彩推荐-迪威575333');
                            jData.defFirstNavDataNew.splice(advFirstNavIndex - 1, 0, '精彩推荐-迪威575333');
                            indexConfig.dataLists.splice(advFirstNavIndex - 1, 0, (firstNavObj = {
                                sreenDefaultCursor: 1,
                                leftDefaultCursor: 2,
                                rightDefaultCursor: 1,
                                isHasBanner: false,
                                showDatas: [],
                                datas: [],
                            }));
                        }

                        //将广告栏目加入到所属的一级导航下
                        advMeta.id = "adv-" + advDesc.advId;
                        advMeta.sortNum = i;
                        advMeta.advTag = 'adv';
                        advMeta.key = GS.STATIC;
                        advMeta.sortKey = advMeta.sortKey ? advMeta.sortKey : 0;
                        advMeta.name = advMeta.name ? advMeta.name : '';
                        advMeta.cName = advMeta.cName ? advMeta.cName : ''
                        advMeta.isCount = advMeta.cName ? true : false;
                        advMeta.delfaultName = advMeta.cName;
                        advMeta.parentName = jData.defFirstNavData[advFirstNavIndex - 1];
                        firstNavObj.datas.push(advMeta);
                    }

                    //冒泡排序所有的sortkey
                    if (firstNavObj && firstNavObj !== null) {
                        var bubbleLength = firstNavObj.datas.length;
                        do {
                            var bubbleBool = false;
                            var bubbleValue = '';
                            for (var i = 1; i < bubbleLength; i++) {
                                if (firstNavObj.datas[i].sortKey > firstNavObj.datas[i - 1].sortKey) {
                                    bubbleValue = firstNavObj.datas[i];
                                    firstNavObj.datas[i] = firstNavObj.datas[i - 1];
                                    firstNavObj.datas[i - 1] = bubbleValue;
                                    bubbleBool = true;
                                }
                            }
                            bubbleLength--;
                        } while (bubbleBool)
                    }

                }
            }
        }


        /**
         * [judgeMeunNameChange 默认直播(0)还是点播(1)]
            @defHomeFocusPosi: 默认焦点位置：0，影片点播（默认）； 1，频道直播
            @titleCursorIndex: 直播点播的索引值
            @renderContent:渲染导航页面的详细内容方法
         */
        function judgeMeunNameChange(defHomeFocusPosi, renderContent) {
            //确定默认焦点应该落在的位置
            var dstCursorIndex = jData.titleCursorIndex;
            if (defHomeFocusPosi === '1') { //默认焦点应该为直播
                //无论直播或点播是否使能，都应该将焦点移动到位置0上
                dstCursorIndex = 0;
            } else { //默认焦点应该为点播
                if (isVodEnable) { //点播使能
                    if (isDvbEnable) { //直播使能
                        dstCursorIndex = 1;
                    } else { //直播禁止
                        dstCursorIndex = 0;
                    }
                } else { //点播禁止
                    dstCursorIndex = 0;
                }
            }

            //焦点需要变化，立即切换焦点显示
            if (jData.titleCursorIndex !== dstCursorIndex) {
                jData.titleCursorIndex = dstCursorIndex;
                renderContent(true);
            }
        }


        /**
         * [getReserveColumn 获取预制栏目]
         * @return {[type]} [description]
         */
        function getReserveColumn() {
            for (var i = 0; i < indexConfig.dataLists.length; i++) {
                var firstNav = indexConfig.dataLists[i];
                for (var j = 0; j < firstNav.datas.length; j++) {
                    var column = firstNav.datas[j];

                    //将后台配置不支持的模块给剔除掉
                    if (!isDvbEnable && column.delfaultName ===
                        ColumnName.columnName[ColumnName.luangageCodeIndex].liveTV) {
                        continue; //隐藏直播栏目
                    } else if (!isVodEnable && column.delfaultName ===
                        ColumnName.columnName[ColumnName.luangageCodeIndex].movie) {
                        continue; //隐藏影片栏目
                    } else if (!isVodEnable && column.delfaultName ===
                        ColumnName.columnName[ColumnName.luangageCodeIndex].history) {
                        continue; //隐藏影片观影记录栏目
                    } else if (!isMusicEnable && column.delfaultName ===
                        ColumnName.columnName[ColumnName.luangageCodeIndex].music) {
                        continue; //隐藏音乐栏目
                    } else if (!isRadioEnable && column.delfaultName ===
                        ColumnName.columnName[ColumnName.luangageCodeIndex].radio) {
                        continue; //隐藏广播栏目
                    }

                    column.parentName = jData.defFirstNavData[i];
                    if (column.model !== 'banner')
                        column = getReserveColumnProperty(column);
                    if (column && column.parentName) {
                        jData.allModeArr.push(column);
                    }
                }
            }
        }


        /**
         * [getReserveColumnProperty description]
         * @param  {[type]} data [description]
         * @return {[经过计算之后替换之后的模块属性的栏目]}      [description]
         */
        function getReserveColumnProperty(data) {
            if (data && data.delfaultName) {
                //对于预制栏目（除了直播、影片、音乐、游戏外），需要根据界面素材
                //获取用户指定的一级入口、排序。
                //但对于被排除的几个预制栏目，意味着不允许用户修改入口和排序。
                if (data.sortKey < 0x7FFFFFFF - 4) {
                    //获取新的排序值
                    var sSortKey = apk.getWpkgMaterial(data.delfaultName + '-排序');
                    sSortKey = sSortKey ? $.parseJSON(sSortKey) : null;
                    if (sSortKey && sSortKey.type === 0 && sSortKey.content &&
                        (sSortKey.content = sSortKey.content.replace(/^\s+|\s+$/g, ''))) {
                        data.sortKey = parseInt(sSortKey.content, 10);
                    }

                    //获取新的一级入口名称
                    var sTitleName = apk.getWpkgMaterial(data.delfaultName + '-入口');
                    sTitleName = sTitleName ? $.parseJSON(sTitleName) : null;
                    if (sTitleName && sTitleName.type === 0 && sTitleName.content &&
                        (sTitleName.content = sTitleName.content.replace(/^\s+|\s+$/g, ''))) {
                        data.parentName = '';
                        for (var i = 0; i < jData.defFirstNavData.length; i++) {
                            if (sTitleName.content === jData.defFirstNavData[i]) {
                                data.parentName = sTitleName.content;
                                break;
                            } else if (sTitleName.content === jData.defFirstNavDataNew[i]) {
                                data.parentName = sTitleName.content;
                                break;
                            }
                        }
                    }
                }

                //根据界面素材修正栏目名称
                var sName = apk.getWpkgMaterial(data.delfaultName + '-名称');
                sName = sName ? $.parseJSON(sName) : null;
                if (sName && sName.type === 0 && sName.content &&
                    (sName.content = sName.content.replace(/^\s+|\s+$/g, ''))) {
                    data.name = data.cName = sName.content;
                }

                //如果当前语种非中文，则需要额外按照中文获取上报栏目名称
                //如果没有中文名称则需要使用默认名称
                if (Config.LANGUAGE_CODE !== 'zh_CN') {
                    data.cName = data.delfaultName;
                    var sCName = apk.getWpkgMaterial(data.delfaultName + '-名称', 'zh_CN');
                    sCName = sCName ? $.parseJSON(sCName) : null;
                    if (sCName && sCName.type === 0 && sCName.content &&
                        (sCName.content = sCName.content.replace(/^\s+|\s+$/g, ''))) {
                        data.cName = sCName.content;
                    }
                }
            }
            return data;
        }


        function getModelByRatio(width, height) {
            //注意，本方法判断标准中的所涉及的阈值不可被随意修改，
            //必须和酒店端操作说明保持完全一致！！！
            if (width / height >= 1.2) {
                return 'serverWide';
            } else if (width / height <= 0.8) {
                return 'serverHigh';
            } else if (width <= 250 && height <= 250) {
                return 'serverNormal';
            } else {
                return 'serverBig';
            }
        }

        /**
         * [getIntroductionColumn 获取介绍类栏目]
         */
        function getIntroductionColumn() {
            cacheServiceColList = [];
            var columnStr = apk.getWpkgTempColumnList();
            var columnList = ((columnStr && columnStr !== '[]') ?
                $.parseJSON(columnStr) : null);
            if (columnList && columnList.length > 0) {
                for (var i = 0; i < columnList.length; i++) {
                    var column = columnList[i];
                    if (!column) continue;
                    if (!column.iconUrl || !column.icon1Url ||
                        !isImgType(column.iconUrl) ||
                        !isImgType(column.icon1Url))
                        continue;

                    //如果栏目指定的插入位置（一级栏目）不存在，着应该直接忽略该栏目
                    if (!isHasPostion(column.position))
                        continue;

                    var dataObj = getNewNodeData();
                    dataObj.id = column.id;
                    dataObj.sortKey = column.sortKey;
                    dataObj.model = getModelByRatio(
                        column.iconWidthPix, column.iconHeightPix);
                    dataObj.name = column.colNames[Config.LANGUAGE_CODE];
                    dataObj.cName = (column.colNames.zh_CN ?
                        column.colNames.zh_CN : column.colNames[Config.LANGUAGE_CODE]);
                    dataObj.delfaultName = (column.colNames.zh_CN ?
                        column.colNames.zh_CN : column.colNames[Config.LANGUAGE_CODE]);
                    dataObj.src = storage.getCacheFile(agbs.LOCATION_MEDIA_PORT + column.iconUrl);
                    dataObj.activeSrc = storage.getCacheFile(agbs.LOCATION_MEDIA_PORT + column.icon1Url);
                    dataObj.parentName = column.position;

                    //模块的链接URL
                    if (column.templateId === 3) { //外联模板
                        var colJsonData = apk.getWpkgTempColData(column.id);
                        var colData = colJsonData ? $.parseJSON(colJsonData) : null;
                        if (colData && colData.colUrl &&
                            (colData.colUrl = colData.colUrl.replace(/^\s+|\s+$/g, '')) &&
                            (colData.colUrl.indexOf('http://') === 0 || colData.colUrl.indexOf('https://') === 0)
                        ) {
                            dataObj.url = colData.colUrl;
                            dataObj.url += ((dataObj.url.indexOf('?') < 0) ? '?' : '&');
                            dataObj.url += ('vender=luan' + '&hotelId=' + apk.getHotelId() +
                                '&termSn=' + apk.getTermSn() + '&termModel=' + apk.getTermModel() +
                                '&roomNum=' + apk.getRoomNumEx() + '&posiCode=' + apk.getPosiCode() +
                                '&langCode=' + Config.LANGUAGE_CODE);
                        }
                    } else { //其它模板
                        dataObj.url = agbs.LOCATION_MEDIA_PORT + column.indexUrl +
                            '?colId=' + column.id;
                    }

                    if (apk.getHotelId() === 1020) { //“上海水月周庄铂尔曼酒店”项目
                        var downInsertNameZhArr = ['酒店频道', '酒店促销']; //限定后台下插介绍类的名字
                        var downInsertNameEsArr = ['Hotel Introduction', 'Hotel Promotion']; //限定后台下插介绍类的名字
                        var nameArr = (Config.LANGUAGE_CODE === "zh_CN" ? downInsertNameZhArr :
                            (Config.LANGUAGE_CODE === "en_US" ? downInsertNameEsArr : null));
                        if (nameArr) {
                            if (dataObj.name === nameArr[0]) {
                                indexConfig.diyFistMenu[0].data = {};
                                indexConfig.diyFistMenu[0].data = dataObj;
                            } else if (dataObj.name === nameArr[1]) {
                                indexConfig.diyFistMenu[1].data = {};
                                indexConfig.diyFistMenu[1].data = dataObj;
                            } else {
                                jData.allModeArr.push(dataObj);
                            }
                        }
                    } else { //公版处理（适用其它项目）
                        // alert("dataObj===>"+JSON.stringify(dataObj))
                        jData.allModeArr.push(dataObj);
                    }
                }
            }
        }

        function getShoppingCol() {
            var columnStr = shopping.getTypeList();
            if(columnStr) {
                var columnList = ((columnStr && columnStr !== '[]') ?
                    $.parseJSON(columnStr) : null);
                // alert("商城分类==》"+JSON.stringify(columnList))
                if(indexConfig.dataLists) {
                    for (var i = 0; i < indexConfig.dataLists.length; i++) {
                        var showDatas = indexConfig.dataLists[i].showDatas;
                        if (showDatas) {
                            for (var j = 0; j < showDatas.length; j++) {
                                if (columnList && columnList.length > 0) {
                                    for (var k = 0; k < columnList.length; k++) {
                                        // alert("当前数据=》"+JSON.stringify(columnList[k]));
                                        var colName = columnList[k].name;
                                        // alert("当前数据2=》"+JSON.stringify(colName[Config.LANGUAGE_CODE]));
                                        if (showDatas[j].name === colName[Config.LANGUAGE_CODE]) {
                                            showDatas[j].id = columnList[k].id;
                                            showDatas[j].model = getModelByRatio(columnList[k].posterWidthPix, columnList[k].posterHeightPix);
                                            showDatas[j].src = storage.getCacheFile(agbs.LOCATION_MEDIA_PORT + (columnList[k].poster ? columnList[k].poster : ""));
                                            showDatas[j].activeSrc = storage.getCacheFile(agbs.LOCATION_MEDIA_PORT + (columnList[k].poster ? columnList[k].poster1 : ""));
                                            showDatas[j].key = GS.STATIC;
                                            showDatas[j].url = agbs.LOCATION_MEDIA_PORT + columnList[k].indexUrl +
                                                '?colId=' + columnList[k].id;
                                        }
                                    }
                                }
                            }
                        }

                    }
                }
            }
        }
        /**
         * [getShoppingColumn 获取商城分类栏目]
         */
        function getShoppingColumn() {
            cacheServiceColList = [];
            var columnStr = shopping.getTypeList();
            var columnList = ((columnStr && columnStr !== '[]') ?
                $.parseJSON(columnStr) : null);
            if (columnList && columnList.length > 0) {
                for (var i = 0; i < columnList.length; i++) {
                    var column = columnList[i];
                    if (!column) continue;
                    if (!column.poster || !column.poster1 ||
                        !isImgType(column.poster) ||
                        !isImgType(column.poster1))
                        continue;

                    //如果栏目指定的插入位置（一级栏目）不存在，着应该直接忽略该栏目
                    if (!isHasPostion(column.position))
                        continue;

                    var dataObj = getNewNodeData();
                    dataObj.id = column.id;
                    dataObj.sortKey = column.sortKey;
                    dataObj.model = getModelByRatio(
                        column.posterWidthPix, column.posterHeightPix);
                    dataObj.name = column.name[Config.LANGUAGE_CODE];
                    dataObj.cName = (column.name.zh_CN ?
                        column.name.zh_CN : column.name[Config.LANGUAGE_CODE]);
                    dataObj.delfaultName = (column.name.zh_CN ?
                        column.name.zh_CN : column.name[Config.LANGUAGE_CODE]);
                    dataObj.src = storage.getCacheFile(agbs.LOCATION_MEDIA_PORT + column.poster);
                    dataObj.activeSrc = storage.getCacheFile(agbs.LOCATION_MEDIA_PORT + column.poster1);
                    dataObj.parentName = column.position;

                    //模块的链接URL
                    dataObj.url = agbs.LOCATION_MEDIA_PORT + '/ShopTemplate/TempPkg/1' +
                        '/terminal/index.html?colId=' + column.id;

                    jData.allModeArr.push(dataObj);
                }
            }
        }

        /**
         * [sortOutColumnToFirstNav 将二级栏目拆分到对应的一级栏目下]
         */
        function sortOutColumnToFirstNav() {
            //对所有二级栏目按照排序键进行排序
            var tempData = null;
            for (var i = 0; i < jData.allModeArr.length; i++) {
                for (var j = 0; j < jData.allModeArr.length - i - 1; j++) {
                    if (jData.allModeArr[j].sortKey < jData.allModeArr[j + 1].sortKey) {
                        tempData = jData.allModeArr[j];
                        jData.allModeArr[j] = jData.allModeArr[j + 1];
                        jData.allModeArr[j + 1] = tempData;
                    }
                }
            }

            //将二级栏目拆分到对应的一级栏目下
            bHasMsgColumn = false;
            menuListStr = '';
            for (var i = 0; i < jData.defFirstNavData.length; i++) {
                for (var j = 0; j < jData.allModeArr.length; j++) {
                    var column = jData.allModeArr[j];
                    if (!column.parentName) continue;
                    if (column.parentName !== jData.defFirstNavData[i] &&
                        column.parentName !== jData.defFirstNavDataNew[i])
                        continue;

                    //记录是否有客房消息模块入口
                    //如果没有客房消息模块入口则无需向后台请求未读消息数
                    if (column.key === GS.E_MAIL) {
                        bHasMsgColumn = true;
                    }

                    //如果没有的链接pms酒馆系统 不需要显示观影记录模块
                    if (column.key === GS.HISTORY && apk.isHasPmsConn && !apk.isHasPmsConn()) {
                        //不显示观影记录入口
                        continue;
                    }

                    column.class = 'c' + i + '-' + indexConfig.dataLists[i].showDatas.length;
                    indexConfig.dataLists[i].showDatas.push(column);
                }
                if (menuListStr.length > 0) menuListStr += ',';
                menuListStr += JSON.stringify(indexConfig.dataLists[i].showDatas);
            }
            menuListStr = '[' + menuListStr + ']';
            // console.log(menuListStr);
            storage.setVolatileVariable('menuList', menuListStr);
        }

        // ===== 公告板方法集 start=====

        /**
         * [initSetNoticeHeight 初始化公告的高度]
         * @return {[type]} [description]
         */
        function initSetNoticeHeight() {
            $('#index_con').css('height',
                jData.contentBodyObj.noticeScrollHeight[noticeCurrentPage - 1] + 'px');
        }

        function initNoticeAnimation() {
            $('#index_con div').css({
                '-webkit-transform': 'translateY(-' + noticeScroll + 'px' +
                    ') translateZ(0)',
                '-webkit-transition': '-webkit-transform 1s ease-in',
            });
        }

        /**
         * [initNoticePrevItem 向右查看下一条内容]
         */
        function initNoticePrevItem(renderNote) {
            contentBodyObj.cursorIndex--;
            if (contentBodyObj.cursorIndex < 1) {
                contentBodyObj.cursorIndex = contentBodyObj.allItemsLength;
            }
            contentBodyObj.noticeCurrentPage = 1;
            noticeCurrentPage = 1;
            noticeScroll = 0;
            renderNote();
        }

        /**
         * [initNoticeNextItem 向左查看上一条内容]
         */
        function initNoticeNextItem(renderNote) {
            contentBodyObj.cursorIndex++;
            if (contentBodyObj.cursorIndex > contentBodyObj.allItemsLength) {
                contentBodyObj.cursorIndex = 1;
            }

            contentBodyObj.noticeCurrentPage = 1;
            noticeCurrentPage = 1;
            noticeScroll = 0;
            renderNote();
        }

        // ===== 公告板方法集 end=====

        return {

            bannerShowTime: function() {
                return bannerShowTime;
            },
            bannerHideTime: bannerHideTime,
            bannerTimeDiff: bannerTimeDiff,

            advImgId: [], //存储广告图片你的id数组
            PORTAL_ADV: 5, //index页面广告
            changeBannerTime: changeBannerTime, //banner轮波计时器
            /**
             * [getNewSubMode 获取最新的二级模块的配置结构]
             * @return 返回栏目数据的版本号
             */
            getNewSubMode: function() {
                var enterTime = new Date().getTime();
                var protoVersion = 2; //缓存数据拓扑结构版本号，每次变更缓存数据结构后均需要递增版本号
                var bNeedRecalculate = true;
                var orgCaching = null,
                    newVersion = null;
                var pmsconn = apk.isHasPmsConn ? apk.isHasPmsConn() : '';
                var CanCacheLayout = adv.getDisplayVersion ? true : false; //旧版本PortalApk缺少接口故因无法获取版本而导致不能使用缓冲
                var Key4LayoutCache = "wpkg.index.layout.cache-" + Config.LANGUAGE_CODE;
                if (CanCacheLayout) {
                    newVersion = '' +
                        '#' + isDvbEnable + //直播栏目是否使能，决定直播栏目入口是否显示
                        '#' + isVodEnable + //影片栏目是否使能，决定影片栏目入口是否显示
                        '#' + isMusicEnable + //音乐栏目是否使能，决定音乐栏目入口是否显示
                        '#' + isRadioEnable + //广播栏目是否使能，决定广播栏目入口是否显示
                        '#' + apk.getWpkgMaterialVersion() + //界面素材数据版本，影响一级&二级预制栏目的名称、排序、和图标
                        '#' + apk.getWpkgTempColumnVersion() + //介绍类栏目数据版本，决定介绍类栏目的个数和参数
                        '#' + shopping.getVersion() + //商城（除订单外）数据版本，决定商城分类栏目的个数和参数
                        '#' + isAdvEnable + //广告是否使能，决定是否可显示动态下发广告栏目
                        '#' + pmsconn +//pms的链接状态
                        '#' + adv.getDisplayVersion(1); //广告数据版本，决定动态下发广告栏目的个数和参数
                    //读取已经缓冲的布局数据，如果存在且版本一致，意味着缓冲有效
                    orgCaching = storage.getVolatileVariable(Key4LayoutCache);
                    orgCaching = orgCaching ? $.parseJSON(orgCaching) : null;
                    if (orgCaching && orgCaching.indexConfig && newVersion &&
                        orgCaching.protoVersion === protoVersion &&
                        orgCaching.version === newVersion)
                        bNeedRecalculate = false;
                }

                var colDataVersion = null;
                if (bNeedRecalculate) { //需要重算首页布局
                    console.log("recalculate layout of index");

                    //依据界面素材修正一级栏目属性
                    topoClumn();
                    console.log("图片数据==》"+JSON.stringify(jData.firstNavIcon));
                    console.log("jdta数据==》"+JSON.stringify(jData.firstNavData));
                    console.log("一级数据==》"+JSON.stringify(indexConfig.dataLists));
                    //      getFirstNav();
                    //获取预制栏目
                    //   getReserveColumn();
                    //获取介绍类栏目
                    getIntroductionCol();
                            // getIntroductionColumn();
                    //获取商城分类栏目
                    getShoppingCol();
                        // getShoppingColumn();
                    //将二级栏目拆分到对应的一级栏目下
                    //   sortOutColumnToFirstNav();
                    //缓存分析之后的数据模块
                    sessionStorage.setItem(GS.INDEX_CONFIG_MODEL, JSON.stringify(indexConfig));

                    //将计算得到的布局数据和版本缓存起来
                    colDataVersion = new Date().getTime() & 0x7FFFFFFF;
                    if (CanCacheLayout) {
                        storage.setVolatileVariable(
                            Key4LayoutCache, JSON.stringify({
                                dataVersion: colDataVersion,
                                protoVersion: protoVersion,
                                version: newVersion,
                                indexConfig: indexConfig,
                                firstNavIcon: jData.firstNavIcon,
                                firstNavMask: jData.firstNavMask,
                                firstNavData: jData.firstNavData,
                                bHasMsgColumn: bHasMsgColumn,
                                menuList: menuListStr,
                            }));
                    }
                } else { //无需重算首页布局
                    console.log("reuse layout caching of index");

                    colDataVersion = orgCaching.dataVersion;
                    $.extend(indexConfig, orgCaching.indexConfig);
                    jData.firstNavIcon = orgCaching.firstNavIcon;
                    jData.firstNavMask=orgCaching.firstNavMask;
                    jData.firstNavData = orgCaching.firstNavData;
                    bHasMsgColumn = orgCaching.bHasMsgColumn;
                    storage.setVolatileVariable('menuList', orgCaching.menuList);
                    sessionStorage.setItem(GS.INDEX_CONFIG_MODEL, JSON.stringify(orgCaching.indexConfig));
                }

                var exitTime = new Date().getTime();
                console.log("refresh layout of index used time: " +
                    (exitTime - enterTime) + ", dataVer=" + colDataVersion);
                return colDataVersion;
            },

            /**
             * [newMessage 当有新消息时候执行的回调]
             */
            newMessage: function(callback) {
                tools.callbackArr[GS.HAVE_NEW_MAIL_CALLBACK] = function() {
                    callback();
                };
            },
            judgeMeunNameChange: function(defHomeFocusPosi, renderContent) {
                return judgeMeunNameChange(defHomeFocusPosi, renderContent);
            },
            /**
             * [photoWallAdv 当显示图片墙时应上报广告]
             */
            photoWallAdv: function() {
                tools.callbackArr[GS.APK_IS_EXIT] = function() {
                    clearInterval(changeBannerTime);

                    //当离开首页时记录banner图片的当前的索引
                    storage.setVolatileVariable('bannerShowId', parseInt(jData.bannerImageIndex));
                }
            },
            bannerStartAdv: function(callback) {
                tools.callbackArr[GS.APK_IS_ENTER] = function() {
                    callback();
                }
            },

            /**
             * [initNoticePrevItem 向右查看下一条内容]
             * @param  {[function]} renderNote [渲染页面公告板的方法]
             */
            initNoticePrevItem: function(renderNote) {
                return initNoticePrevItem(renderNote);
            },

            /**
             * [initNoticeNextItem 向左查看上一条内容]
             * @param  {[function]} renderNote [渲染页面公告板的方法]
             */
            initNoticeNextItem: function(renderNote) {
                return initNoticeNextItem(renderNote);
            },

            initSetNoticeHeight: function() {
                return initSetNoticeHeight();
            },

            /**
             * [initNoticePrevPage 向上翻页]
             * @param  {[function]} renderNote [渲染页面公告板的方法]
             */
            initNoticePrevPage: function(renderNote) {
                if (noticeCurrentPage > 1) {
                    noticeCurrentPage--;
                    noticeScroll -= jData.contentBodyObj.noticeScrollHeight[noticeCurrentPage - 1];
                    initNoticeAnimation();
                    initSetNoticeHeight();
                    $('#curPage').html(noticeCurrentPage);
                } else {
                    if (contentBodyObj.cursorIndex !== 1) {
                        initNoticePrevItem(renderNote);
                    }
                }
            },

            /**
             * [ initNoticeNextPage 向下翻页]
             * noticeCountPage 标识当前的信息一共有多少页
             * @param  {[function]} renderNote [渲染页面公告板的方法]
             */
            initNoticeNextPage: function(noticeCountPage, renderNote) {
                if (noticeCurrentPage < noticeCountPage) {
                    noticeScroll += jData.contentBodyObj.noticeScrollHeight[noticeCurrentPage - 1];
                    noticeCurrentPage++;
                    initNoticeAnimation();
                    initSetNoticeHeight();
                    $('#curPage').html(noticeCurrentPage);
                } else {
                    if (contentBodyObj.cursorIndex !== contentBodyObj.allItemsLength) {
                        initNoticeNextItem(renderNote);
                    }
                }
            },

            /**
             * [startChangeBannerTime 启动banner图片轮播计时器]
             */
            startChangeBannerTime: function(domBannerLayerOne, domBannerLayerTwo, turnPicReport, addCursorToPic, isChangePic) {
                bannerImageUrlArr = indexConfig.dataLists[0].datas[0].imageUrls;
                var switchTime = getBannerImgChanngeTime();

                changeBannerTime = setInterval(function() {
                    //应该先上报上一张图片，然后再轮播显示新的图片;不能在索引改变后上报
                    turnPicReport();
                    if (jData.bannerImageIndex < 0) {
                        jData.bannerImageIndex = 0;
                    } else {
                        jData.bannerImageIndex = ((jData.bannerImageIndex + 1) % bannerImageUrlArr.length);
                    }
                    changeBannerImage(domBannerLayerOne, domBannerLayerTwo);
                    addCursorToPic();
                }, switchTime);

                if (isChangePic) {
                    var tempTime = (bannerImageUrlArr.length) * switchTime;
                    setTimeout(function() {
                        $('#banner').hide();
                        isBannerShow = false;
                        clearInterval(changeBannerTime);
                    }, tempTime);
                }
            },

            getBannerImgChanngeTime: function() {
                return getBannerImgChanngeTime();
            },

            getCursorTime: function() {
                bannerShowTime = new Date();
            },

            /**
             * [enterykeyLogic 按确认键 进入二级模块的与判断逻辑处理]
             * @param  {[int]} offsetCursor [滚动的偏移量]
             */
            enterykeyLogic: function(offsetCursor) {
                requirejs(['progObj'],
                    function(progObj) {
                        var twoModelDetail = indexConfig.dataLists[jData.titleCursorIndex].
                        showDatas[jData.cursorIndex + offsetCursor];
                        //url为''时显示功能不可用
                        if (!twoModelDetail.url) {
                            apk.jsShowAlert(GL.INDEX_DEVLEP_INFO);
                            return;
                        }

                        progObj.isActiveHasData(twoModelDetail, twoModelDetail.url, true);
                    });
            },

            /**
             * [fetchUnreadMsgCount 获取服务器的未读消息个数]
             */
            fetchUnreadMsgCount: function(callback) {
                if (bHasMsgColumn) {
                    $.ajax({
                        url: apk.getUrlPrefix() + "/LocalServer/MPIPTV/API/V001R001" +
                            "/Mail/getUnreadMailCount?TermId=" + apk.getTermId(),
                        type: 'GET',
                        dataType: 'jsonp',
                        jsonp: 'Callback',
                        success: function(unread_data) {
                            var unreadCount = ((unread_data &&
                                    !isNaN(unread_data.Value)) ?
                                parseInt(unread_data.Value) : 0);
                            if (unreadCount < 0) unreadCount = 0;
                            storage.setVolatileVariable("sys.wpkg.mail.unreadCount", '' + unreadCount);
                            callback(unreadCount);
                        },
                    });
                }
            },

            /**
             * [loadBoard 加载公告板的方法]
             * @return {[type]} [description]
             */
            loadBoard: function(renderNote) {

                if (storage.getVolatileVariable('Portal.ProcShowBulletinAtBootup', '0') === '0') {
                    // apk.homeKey();
                    storage.setVolatileVariable('Portal.ProcShowBulletinAtBootup', '1');

                    jData.showBox = 2;
                    bulletinShowAtBootup = termConfig.getByKeyEx('BulletinShowAtBootup', '0'); //0：不显示，1：每次上线都显示，2：首次上线显示
                    // alert("bulletinShowAtBootup==>"+JSON.stringify(bulletinShowAtBootup))
                    if (bulletinShowAtBootup === '1' ||
                        (bulletinShowAtBootup === '2' &&
                            apk.getOnlineCount() <= 1)) {
                        var bulletinStr = apk.getBulletinBoardList(
                            Config.LANGUAGE_CODE ? Config.LANGUAGE_CODE : 'zh_CN');
                        // alert("是否显示==》"+JSON.stringify(bulletinStr))
                        if (bulletinStr && bulletinStr !== '[]') {
                            var bulletinList = $.parseJSON(bulletinStr);
                            if (bulletinList && bulletinList.length > 0) {
                                for (var i = 0; i < bulletinList.length; i++)
                                    noteObj.zhArr.push(bulletinList[i].content);
                                contentBodyObj.allItemsLength = noteObj.zhArr.length;
                                jData.showBox = 0;
                                renderNote(); //显示公告板
                            }
                        }
                    }
                }
            }
        };
    });