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
  baseUrl: "../lib/js/common",
  paths: {
    jquery: "../pulgin/jquery",
    juicer: "../pulgin/juicer",
    //  'header': './../../header/elderberry/elderberry-header',
    indexConfig: "./logic/indexConfig",
    juicerData: "../../../robotDelivery/js/juicerData",
    parseWeather: "../../../robotDelivery/js/parseWeather",
    weatherData: "../../../robotDelivery/js/weatherData",
    sort: "../../../robotDelivery/js/sort",
    common: "../../../robotDelivery/js/common",
    indexText: "../../../robotDelivery/js/index-" + Config.LANGUAGE_CODE,
  },

  //加载css文件需要的配置
  map: {
    "*": {
      css: "../pulgin/css",
    },
  },

  shim: {
    //   header: ['css!./../../header/elderberry/headerCss.css'],
    juicer: {
      exports: "juicer",
    },
  },
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
       // 'header'
    ],

    function (juicer, $, globalKeyDown, indexConfig, jData, GS, agbs, GL, url, common, aTools) {

        //导航页常量值定义
        var INDEX_CUR_01 = 'indexCur01', //记录首页一级菜单的位置的key值
            INDEX_CUR_02 = 'screenCursor', //记录首页二级菜单的位置的key值
            INDEX_CUR_03 = 'indexCur03', //记录首页二级菜单的偏移位置的key值

            SHOW_SUB_MEUN_LENGTH = 7, //允许的二级菜单最大长度

            INIT_SUB_HEIGHT = 7, //初始的二级菜单的高度

            PER_LINE_HEIGHT = 100, //二级菜单移动一行的距离

            ACTVIE = 'active', //焦点的样式类名

            ANIMATION_CSS = 'active animation', //焦点的样式类名动画

            SUB_ACTIVE = 'activeFlag', // 标识性的焦点类名

            ANIMATION_ACTIVEFLAG_CSS = 'activeFlag animation'; //标识性的焦点类名动画

        var tplFirstNav = juicer('#topMenuTemplate'),
            tplBulletin = juicer('#bulletinTemplate'),
            tplContent = juicer('#contentTemplate'),
            tplBanner = juicer('#bannerTemplate'),
            footer = juicer('#footerTemplate');


        //定时任务
        var imgInterval=0;

        /**
         * 标识adv二级栏目被推荐
         */
        var advRecommendNum = 0;

        /**
         * 操作页面的dom节点变量
         */
        var domTitleList, //一级标题节点数组
            domSubMenuArry, // 屏幕模块数组
            domContentArry, // 内容模块数组
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
        var vodIsEnable = apk.isModuleEnable('vod');
        var defHomeFocusPosi = termConfig.getByKeyEx("DefHomeFocusPosi", "0"); //值定义： 0，影片点播（默认）； 1，频道直播
        var allowBackToWelcome = termConfig.getByKeyEx("AllowBackToWelcome", "0"); //是否跳转欢迎页 0，不跳转； 1，跳转
        /**
         * [通过自执行函数加载页面的初始数据]
         */
        (function () {
          //二级菜单允许的最大宽度
          tools.ALLOW_NAME_MAX_PX = 206;
          tools.ALLOW_TITLE_MAX_PX = 206;

          //注册juicer的方法
          registerFunction();
          // alert("启动index页面");
          if (
            storage.getVolatileVariable(
              "Portal.ProcShowBulletinAtBootup",
              "0"
            ) === "0"
          ) {
            //每次启动终端后，加载缓存一次portal的背景图片,
            var apkbgimage = apk.getWpkgMaterial("apklaunchimage");
            if (apkbgimage) {
              var imagepath = storage.getCacheFileOfOss(
                $.parseJSON(apkbgimage).content
              );
              if (imagepath != null && imagepath != "") {
                storage.setPersistVariable("apklaunchimage", imagepath);
              }
            }

            try {
              //加载动态设置的背景图片后，再次设置背景透明
              bgMedia.setApkBgTransparent();
              //每次启动终端后，清除第三方应用账号等缓存信息，传入第三方应用的包名
              apk.clearApplicationData("com.ktcp.video");
              apk.clearApplicationData("com.tencent.qqmusictv");
            } catch (e) {}
          }
          var bgImage = apk.getWpkgMaterial("背景图片");
          var bgImgaes = "";
          if (bgImage) {
            bgImgaes = apk.getFileUrlPrefix() + $.parseJSON(bgImage).content;
            // console.log("背景图片-》" + bgImgaes);
          }
          //获取设置当前套系的背景图片
          storage.setVolatileVariable(GS.BG_IMG_PATH, bgImgaes);
          storage.setVolatileVariable(GS.THE_PAGE_KINDEOF, "5");

          //执行插入页头数据的回调方法
          if (tools.callbackArr[GS.BG_IS_SHOW_PIC]) {
            tools.callbackArr[GS.BG_IS_SHOW_PIC]();
          } else {
            tools.SetchangebgPic();
          }

          clearInterval(imgInterval);

          //获取经过计算之后的最新的二级模块应该有的数据
          common.getNewSubMode();
          console.log(
            "indexConfig.dataLists=pre=>" +
              JSON.stringify(indexConfig.dataLists)
          );
          /*if(jData.firstNavData[0].key === 'tv'){
                 indexConfig.dataLists[0].showDatas=indexConfig.dataLists[0].showDatas.slice(1,100);
            }*/

          var colWpkData = apk.getWpkgTempColumnList();

          if (colWpkData) {
            var colWpkList = JSON.parse(colWpkData);
            jData.firstIntroNames = new Array(colWpkList.length);
            jData.firstIntroIcon = new Array(colWpkList.length);
            jData.firstIntroAct = new Array(colWpkList.length);
            colWpkList.forEach((item, index) => {
              if (index > 0) {
                var introName = item.colNames;
                jData.firstIntroNames[index - 1] =
                  introName[Config.LANGUAGE_CODE];
                jData.firstIntroIcon[index - 1] = storage.getCacheFileOfOss(
                  agbs.LOCATION_MEDIA_PORT + item.iconUrl
                );
                jData.firstIntroAct[index - 1] = storage.getCacheFileOfOss(
                  agbs.LOCATION_MEDIA_PORT + item.icon1Url
                );
                jData.firstIntroDatas.push(item);
              }
            });
          }
          
          if (jData.firstIntroDatas.length < 2) {
            jData.firstIntroDatas = [{}, {}];
            jData.firstIntroNames = ['', ''];
            jData.firstIntroIcon = ['', ''];
            jData.firstIntroAct = ['', ''];
          }

          var objBanNull = {
            model: "banner",
            imageUrls: [],
            sortKey: 0x7fffffff,
            parentName: "",
          };
          for (var i = 0; i < jData.firstNavData.length; i++) {
            if (
              jData.firstNavData[i].key &&
              jData.firstNavData[i].key ===
                indexConfig.dataLists[i].showDatas[0].key
            ) {
              indexConfig.dataLists[i].showDatas[0] = objBanNull;
            }
          }
          // console.log(
          //   "indexConfig.dataLists=result=>" +
          //     JSON.stringify(indexConfig.dataLists)
          // );

          //判断是否有需要在一级栏目中进入二级页面的模块
          if (indexConfig.diyFistMenu && indexConfig.diyFistMenu.length > 0) {
            for (var i = 0; i < indexConfig.diyFistMenu.length; i++) {
              if (indexConfig.diyFistMenu[i].type === "change") {
                jData.firstNavData.splice(
                  indexConfig.diyFistMenu[i].pistion,
                  1,
                  indexConfig.diyFistMenu[i].data
                );
                indexConfig.dataLists[
                  indexConfig.diyFistMenu[i].pistion
                ].showDatas = [];
              } else if (indexConfig.diyFistMenu[i].type === "push") {
                jData.firstNavData.splice(
                  indexConfig.diyFistMenu[i].pistion,
                  0,
                  indexConfig.diyFistMenu[i].data
                );
                indexConfig.dataLists[
                  indexConfig.diyFistMenu[i].pistion
                ].showDatas = [];
              }
            }
          }

          //如有首页海报则追加入到首页banner列表中
          var hostPosterList = apk.getHotelPosterList();
          if (hostPosterList && hostPosterList !== "[]") {
            bannerImageUrlArr = $.parseJSON(hostPosterList);
            if (!bannerImageUrlArr) bannerImageUrlArr = [];
          }
          //如有首页广告则追加入到首页banner列表中
          if (adv.getEnableFlag()) {
            var advMaterCount = adv.getAdvMaterialCount(common.PORTAL_ADV);
            if (advMaterCount > 0) {
              for (var i = 0; i < advMaterCount; i++) {
                var advObj = adv.getAdvMaterialByIndex(common.PORTAL_ADV, i);
                advObj = advObj ? $.parseJSON(advObj) : null;
                if (!advObj || !advObj.fileUrl) continue;
                common.advImgId[bannerImageUrlArr.length] = advObj.advId;
                bannerImageUrlArr.push(
                  storage.getCacheFile(
                    agbs.LOCATION_VOD_PORT + "" + advObj.fileUrl
                  )
                );
              }
            }
          }
          //获取二级菜单的焦点记忆
          // alert("INDEX_CUR_02->"+storage.getVolatileVariable(INDEX_CUR_02))
          if (storage.getVolatileVariable(INDEX_CUR_02)) {
            jData.titleCursorIndex = parseInt(
              storage.getVolatileVariable(INDEX_CUR_02)
            );
            // alert("jData.titleCursorIndex->"+jData.titleCursorIndex);
            if (jData.titleCursorIndex === -1) {
              // jData.titleCursorIndex = 0;
              if (defHomeFocusPosi === "1") {
                jData.titleCursorIndex = 0;
              } else if (vodIsEnable === true) {
                jData.titleCursorIndex = 0;
              } else {
                jData.titleCursorIndex = 0;
              }
            } else {
              if (defHomeFocusPosi === "1") {
                jData.titleCursorIndex = parseInt(
                  storage.getVolatileVariable(INDEX_CUR_02)
                );
              } else {
                jData.titleCursorIndex = parseInt(
                  storage.getVolatileVariable(INDEX_CUR_02)
                );
              }
            }
          } else {
            // jData.titleCursorIndex = 0;
            if (defHomeFocusPosi === "1") {
              jData.titleCursorIndex = 0;
            } else if (vodIsEnable === true) {
              jData.titleCursorIndex = 0;
            } else {
              jData.titleCursorIndex = 0;
            }
          }

          //设置banner广告的图片地址
          if (
            indexConfig.dataLists[0] &&
            indexConfig.dataLists[0].datas[0] &&
            indexConfig.dataLists[0].datas[0].imageUrls
          ) {
            indexConfig.dataLists[0].datas[0].imageUrls = bannerImageUrlArr;
          }

          //渲染页面内容
          renderContent(false);

        })();

        //离开首页的时候进行焦点记忆
        window.onbeforeunload = function () {
          storage.setVolatileVariable(
            INDEX_CUR_02,
            JSON.stringify(jData.titleCursorIndex)
          );
          storage.setVolatileVariable(INDEX_CUR_03, parseInt(offsetCursor));
          //当离开首页时记录banner图片的当前的索引
          storage.setVolatileVariable(
            "bannerShowId",
            parseInt(jData.bannerImageIndex)
          );
          //当离开首页时,上报当前显示广告的时间
          if (jData.titleCursorIndex === 0) {
            common.bannerHideTime = new Date();
            var switchTime = common.getBannerImgChanngeTime();
            if (common.bannerShowTime() && common.bannerHideTime) {
              common.bannerTimeDiff =
                common.bannerHideTime.getTime() -
                common.bannerShowTime().getTime();
              if (common.bannerTimeDiff < switchTime) {
                adv.reportAdvStatistic(
                  common.advImgId[jData.bannerImageIndex],
                  common.bannerTimeDiff
                );
              }
            }
          }

          //记录离开首页时精彩推荐的焦点位置和栏目名称
          if (
            twoModelDetail.advTag !== "undefined" &&
            twoModelDetail.advTag === "adv"
          ) {
            //精彩推荐下的栏目上报
            apk.reportColumnStat(twoModelDetail.delfaultName, 1);
            if (
              !isNaN(twoModelDetail.sortNum) &&
              twoModelDetail.sortNum !== "" &&
              twoModelDetail.sortNum !== "undefined"
            ) {
              storage.setVolatileVariable(
                "sortNum",
                parseInt(twoModelDetail.sortNum)
              );
            }
          }
          // storage.setVolatileVariable(INDEX_CUR_04, parseInt(showModeColMax));
          // storage.setVolatileVariable(INDEX_CUR_05, baseIndexArr[jData.titleCursorIndex][logicIndex].name);
          // storage.setVolatileVariable(INDEX_CUR_06, baseIndexArr[jData.titleCursorIndex].length);
          // storage.setVolatileVariable(INDEX_CUR_07, mermoryCursor);
        };

        /**
         * [movieRecomendShow 判断影片模块是否需要推荐]
         * @return 返回是否需要推荐true/false
         */
        function movieRecomendShow() {
          for (var i = 0; i < jData.firstNavData.length; i++) {
            if (jData.firstNavData[i].key && jData.firstNavData[i].key !== "") {
              if (jData.firstNavData[i].key === "vod") {
                if (tools.isNeedRecommend(jData.firstNavData[i].name)) {
                  $(".nav-one-movielogo").css("display", "block");
                  return;
                } else {
                  $(".nav-one-movielogo").css("display", "none");
                  return;
                }
              }
            }
          }
        }


        /**
         * [registerFunction 注册juicer必须的方法]
         */
        function registerFunction() {
          //从新创建的的数组中获取指定的公告内容
          var getCurNote = function (noteObj) {
            return (
              "<div>" +
              noteObj.zhArr[jData.contentBodyObj.cursorIndex - 1] +
              "</div>"
            );
          };

          var computeTitleData = function (data) {
            if (data.name) {
              // return data.name;
              return tools.ellipsisNameLongerText(
                data.name,
                "nav-small",
                "nav-text"
              );
            } else {
              // return data;
              return tools.ellipsisNameLongerText(
                data,
                "nav-small",
                "nav-text"
              );
            }
          };

          var ellipsisText = function (data) {
            return tools.ellipsisNameLongerText(
              data,
              "child-box-small",
              "child-box"
            );
          };

          //判断精彩推荐是否需要角标

          var advShow = function (data) {
            if (tools.isNeedRecommend(data)) {
              return "block";
            } else {
              return "none";
            }
          };

          juicer.register("getCurNote", getCurNote);
          juicer.register("ellipsisText", ellipsisText);
          juicer.register("computeTitleData", computeTitleData);
          juicer.register("advShow", advShow);
        }


        // ===== 渲染实现方法 start=====
        /**
         * [renderContent 渲染导航页面的详细内容方法]
         */
        function renderContent(isBack) {
          // console.log("渲染页面");

          $("#nav").html(tplFirstNav.render(jData));
          $("#footer").html(footer.render(jData));

          //渲染之后加载dom节点信息
          initDomInfo();
          initRobotDeliveryGrid();
          // setTitleCursor();
          if (!isBack) {
            setTimeout(function () {
              // 异步注册按键事件
              globalKeyDown(keyhandle);
              // renderBanner();
              // alert("加载banner结束")
              common.loadBoard(renderNote);
            }, 60);
          }

          var termModel = storage.getVolatileVariable("termModel");
          if (termModel === "konka") {

            setTitleCursor();
            // renderSubMenu();
            setSubMenuCursor();
            $("nav").show();
            setTimeout(function () {
              $("header").css("opacity", "1");
              $("nav").css("opacity", "1");
            }, 500);
            keyDownLock = false;
          } else {
            console.log("unknown term model: " + termModel);
          }

          //设置影片推荐
          movieRecomendShow();

          //设置精彩推荐一级角标
          advFirstRecommend();

          //防止按键锁没有解开卡死界面
          setTimeout(function () {
            keyDownLock = false;
          }, 4000);
        }



        /**
         * [advFirstRecommend 计算精彩推荐二级栏目被推荐条数]
         */
        function advFirstRecommend() {
          for (var i = 0; i < indexConfig.dataLists.length; i++) {
            if (
              indexConfig.dataLists[i].showDatas &&
              indexConfig.dataLists[i].showDatas !== ""
            ) {
              for (
                var j = 0;
                j < indexConfig.dataLists[i].showDatas.length;
                j++
              ) {
                if (
                  indexConfig.dataLists[i].showDatas[j].advTag &&
                  indexConfig.dataLists[i].showDatas[j].advTag === "adv"
                ) {
                  if (
                    tools.isNeedRecommend(
                      indexConfig.dataLists[i].showDatas[j].name
                    )
                  ) {
                    advRecommendNum++;
                  }
                }
              }
            }
          }

          if (advRecommendNum === 0) {
            $(".nav-one-advlogo").css("display", "none");
          } else {
            $(".nav-one-advlogo").css("display", "block");
          }
        }



        /**
         * [renderAlertBox 渲染弹出框的代码]
         */
        function renderAlertBox() {
          domBulletin.html(tplBulletin.render(jData));
          domBulletin.addClass("show-bulletin");

          if (jData.showBox === 1) {
            domAlertBoxList = $(".botton");
          }
        }



        /**
         * [setTitleCursor 设置一级导航焦点]
         */
        function setTitleCursor() {
          $(domTitleList).removeClass(SUB_ACTIVE);
          $(domTitleList).eq(jData.titleCursorIndex).addClass(SUB_ACTIVE);
          $(".sub").hide();
          $(".activeFlag .sub").show();
        }

        /**
         * [setSubMenuCursor 设置二级菜单的光标]
         */
        function setSubMenuCursor() {
          $(".activeFlag .child-box").removeClass(ACTVIE);
          $(".activeFlag .child-box")
            .eq(jData.cursorIndex)
            .addClass(ANIMATION_CSS);
        }

        /**
         * [setAlertBoxCursor 设置弹出框的焦点]
         */
        function setAlertBoxCursor() {
          domAlertBoxList.removeClass(ACTVIE);
          $(domAlertBoxList[jData.alertBox.cursorIndex]).addClass(ACTVIE);
        }



        /**
         * [initDomInfo 初始化dom节点信息]
         */
        function initDomInfo() {
          domTitleList = $("#nav li");
          // domSubMenuArry = $('#content_' + jData.titleCursorIndex + ' .text-box > div > .child-text-box');
          // domScreenLayer = $('#content_' + jData.titleCursorIndex);
          domBannerLayerOne = $(".bannerLayerOne");
          domBannerLayerTwo = $(".bannerLayerTwo");
          domBanner = $(".doc-item");
          domCurBanner = domBanner;
          domBulletin = $("#bulletin");
          domHeader = $("header");
          domFooter = $("footer");
        }

        // ===== 渲染实现方法 end=====

        // ===== 公告板方法集 start=====
        /**
         * [renderNote 渲染公告内容]
         */
        function renderNote() {
          renderAlertBox();

          var contentHeight = $("#index_con").height(),
            p = $("#index_con div").find("p"),
            tempHeight = 0, //计算并保存内容高度的变量
            temp4 = 0,
            temp1,
            temp2,
            temp3;
          noticeScrollHeight = [];
        }

        // ===== 公告板方法集 end=====

        /**
         * 送物页物品网格（与 .item-grid 的 flex row + wrap 一致：先行后列，每行 DELIVERY_GRID_COLS 个）
         */
        var DELIVERY_GRID_ROWS = 3,
            DELIVERY_GRID_COLS = 2,
            deliveryFocusIndex = 0,
            deliveryQuantities = [],
            /** 送物页焦点区域：物品网格 | 已选物品列表 | 提交/重选按钮 */
            deliveryFocusZone = "grid",
            deliverySelectedFocusIndex = 0,
            /** 0：提交，1：重选 */
            deliveryActionBtnIndex = 0,
            /** 进入提交/重选区前已选列表焦点，上键返回时恢复 */
            deliverySelectedFocusBeforeActions = 0;

        function getDeliveryItemCards() {
          return $(".item-grid .item-card");
        }

        /** 已选条目：按物品索引升序，与列表 DOM 顺序一致 */
        function getDeliverySelectedEntries() {
          var out = [];
          for (var i = 0; i < deliveryQuantities.length; i++) {
            if (deliveryQuantities[i] > 0) {
              out.push({ gridIndex: i });
            }
          }
          return out;
        }

        /**
         * 从待选网格左列进入已选：焦点落在已选列表中与该行对齐的「靠右」槽位（两列布局下优先右格）。
         */
        function pickSelectedFocusForGridLeftEnter(gridRow) {
          var entries = getDeliverySelectedEntries(),
            n = entries.length;
          if (!n) {
            return 0;
          }
          function listRightIdxForVisualRow(sr) {
            if (2 * sr + 1 < n) {
              return 2 * sr + 1;
            }
            if (2 * sr < n) {
              return 2 * sr;
            }
            return -1;
          }
          var j = listRightIdxForVisualRow(gridRow);
          if (j >= 0) {
            return j;
          }
          var down;
          for (down = gridRow + 1; 2 * down < n; down++) {
            j = listRightIdxForVisualRow(down);
            if (j >= 0) {
              return j;
            }
          }
          var up;
          for (up = gridRow - 1; up >= 0; up--) {
            j = listRightIdxForVisualRow(up);
            if (j >= 0) {
              return j;
            }
          }
          return n - 1;
        }

        /** 已选列表中当前索引是否处于「靠待选一侧」的边缘（右列，或该行仅左格一项） */
        function deliverySelectedIsTowardGridEdge(idx, n) {
          if (n < 1) {
            return false;
          }
          return idx % 2 === 1 || (idx % 2 === 0 && idx + 1 >= n);
        }

        /** 从已选穿回待选：落在与已选视觉行对齐的待选左列格子 */
        function leaveSelectedListToGridLeftColumn(listIdx) {
          var sr = Math.floor(listIdx / 2);
          var gridIdx = deliveryRCToIndex(sr, 0);
          var $cards = getDeliveryItemCards();
          if (gridIdx >= $cards.length) {
            gridIdx = Math.max(0, $cards.length - 1);
          }
          leaveSelectedListToGrid(gridIdx);
        }

        function getDeliveryActionButtons() {
          return $(".btn-container .btn");
        }

        function syncDeliveryFocusVisual() {
          var $cards = getDeliveryItemCards(),
            $rows = $(".selected-items-list .selected-item:not(.empty-hint)"),
            $btns = getDeliveryActionButtons();
          $cards.removeClass(ACTVIE);
          $rows.removeClass(ACTVIE);
          $btns.removeClass(ACTVIE);
          if (deliveryFocusZone === "grid" && $cards.length) {
            $cards.eq(deliveryFocusIndex).addClass(ACTVIE);
          } else if (deliveryFocusZone === "selected" && $rows.length) {
            var si = Math.min(
              deliverySelectedFocusIndex,
              Math.max(0, $rows.length - 1)
            );
            deliverySelectedFocusIndex = si;
            $rows.eq(si).addClass(ACTVIE);
          } else if (deliveryFocusZone === "actions" && $btns.length) {
            var bi = Math.min(
              deliveryActionBtnIndex,
              Math.max(0, $btns.length - 1)
            );
            deliveryActionBtnIndex = bi;
            $btns.eq(bi).addClass(ACTVIE);
          }
        }

        function getDeliveryRoomNumber() {
          var t = ($(".header-bar .roomNum").text() || "").trim();
          var m = t.match(/房间号\s*[:：]\s*(\S+)/);
          return m ? m[1] : "";
        }

        function deliverySelectedCanMoveDown() {
          var entries = getDeliverySelectedEntries(),
            n = entries.length,
            idx = deliverySelectedFocusIndex;
          if (n < 2) {
            return false;
          }
          if (idx + 2 < n) {
            return true;
          }
          if (idx % 2 === 1 && idx + 1 < n) {
            return true;
          }
          return false;
        }

        function deliverySubmitOrder() {
          var payload = (function () {
            var entries = getDeliverySelectedEntries(),
              $cards = getDeliveryItemCards(),
              items = [];
            for (var e = 0; e < entries.length; e++) {
              var gi = entries[e].gridIndex;
              items.push({
                gridIndex: gi,
                name: $cards.eq(gi).find(".item-name").text(),
                quantity: deliveryQuantities[gi],
              });
            }
            return {
              roomNo: getDeliveryRoomNumber(),
              items: items,
            };
          })();
          if (!payload.items.length) {
            apk.jsShowAlert("请先选择物品");
            return;
          }
          var url = termConfig.getByKeyEx("RobotDeliverySubmitUrl", "");
          if (!url) {
            url =
              apk.getUrlPrefix() +
              "/LocalServer/MPIPTV/API/V001R001/RobotDelivery/submitOrder";
          }
          $.ajax({
            url: url,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(payload),
            success: function (res) {
              var ok =
                res &&
                (res.success === true ||
                  res.code === 0 ||
                  res.Code === 0 ||
                  res.result === "ok");
              if (ok) {
                apk.jsShowAlert("提交成功");
                deliveryResetAllQuantities();
              } else {
                apk.jsShowAlert(
                  (res && (res.message || res.msg || res.Message)) ||
                    "提交失败"
                );
              }
            },
            error: function () {
              apk.jsShowAlert("网络异常，提交失败");
            },
          });
        }

        function deliveryResetAllQuantities() {
          var $cards = getDeliveryItemCards();
          for (var i = 0; i < deliveryQuantities.length; i++) {
            deliveryQuantities[i] = 0;
            $cards.eq(i).find(".qty-value").text("0");
          }
          deliveryFocusZone = "grid";
          deliverySelectedFocusIndex = 0;
          deliveryActionBtnIndex = 0;
          deliverySelectedFocusBeforeActions = 0;
          refreshDeliverySelectedList();
        }

        function leaveActionsToSelectedList() {
          var n = getDeliverySelectedEntries().length;
          if (n < 1) {
            deliveryFocusZone = "grid";
            syncDeliveryFocusVisual();
            return;
          }
          deliveryFocusZone = "selected";
          deliverySelectedFocusIndex = Math.min(
            deliverySelectedFocusBeforeActions,
            n - 1
          );
          syncDeliveryFocusVisual();
        }

        function deliveryIndexToRC(i) {
          return {
            row: Math.floor(i / DELIVERY_GRID_COLS),
            col: i % DELIVERY_GRID_COLS,
          };
        }

        function deliveryRCToIndex(row, col) {
          return row * DELIVERY_GRID_COLS + col;
        }

        function initRobotDeliveryGrid() {
          var $cards = getDeliveryItemCards();
          if (!$cards.length) {
            return;
          }
          deliveryQuantities = $cards
            .map(function () {
              var n = parseInt($(this).find(".qty-value").text(), 10);
              return isNaN(n) ? 0 : n;
            })
            .get();
          deliveryFocusIndex = 0;
          deliveryFocusZone = "grid";
          deliverySelectedFocusIndex = 0;
          deliveryActionBtnIndex = 0;
          deliverySelectedFocusBeforeActions = 0;
          syncDeliveryFocusVisual();
          refreshDeliverySelectedList();
        }

        function setDeliveryFocus(idx) {
          var $cards = getDeliveryItemCards(),
            n = $cards.length;
          if (!n) {
            return;
          }
          if (idx < 0 || idx >= n) {
            return;
          }
          deliveryFocusZone = "grid";
          deliveryFocusIndex = idx;
          syncDeliveryFocusVisual();
        }

        function moveDeliveryFocus(dRow, dCol) {
          if (deliveryFocusZone !== "grid") {
            return;
          }
          var $cards = getDeliveryItemCards(),
            n = $cards.length;
          if (!n) {
            return;
          }
          var rc = deliveryIndexToRC(deliveryFocusIndex),
            nrow = rc.row + dRow,
            ncol = rc.col + dCol;
          if (
            nrow < 0 ||
            nrow >= DELIVERY_GRID_ROWS ||
            ncol < 0 ||
            ncol >= DELIVERY_GRID_COLS
          ) {
            return;
          }
          var next = deliveryRCToIndex(nrow, ncol);
          if (next >= n) {
            return;
          }
          setDeliveryFocus(next);
        }

        function deliveryChangeQtyAtIndex(i, delta) {
          var $cards = getDeliveryItemCards();
          if (!$cards.length || i < 0 || i >= $cards.length) {
            return;
          }
          var q = (deliveryQuantities[i] || 0) + delta;
          if (q < 0) {
            q = 0;
          }
          if (q > 99) {
            q = 99;
          }
          deliveryQuantities[i] = q;
          $cards.eq(i).find(".qty-value").text(String(q));
          refreshDeliverySelectedList();
        }

        function deliveryChangeQty(delta) {
          if (deliveryFocusZone !== "grid") {
            return;
          }
          deliveryChangeQtyAtIndex(deliveryFocusIndex, delta);
        }

        function moveDeliverySelectedFocusUp() {
          var entries = getDeliverySelectedEntries(),
            n = entries.length,
            idx = deliverySelectedFocusIndex;
          if (n < 2) {
            return;
          }
          if (idx >= 2) {
            deliverySelectedFocusIndex = idx - 2;
          } else if (idx === 1) {
            deliverySelectedFocusIndex = 0;
          }
          syncDeliveryFocusVisual();
        }

        function moveDeliverySelectedFocusDown() {
          var entries = getDeliverySelectedEntries(),
            n = entries.length,
            idx = deliverySelectedFocusIndex;
          if (n < 2) {
            return;
          }
          if (idx + 2 < n) {
            deliverySelectedFocusIndex = idx + 2;
          } else if (idx % 2 === 1 && idx + 1 < n) {
            deliverySelectedFocusIndex = idx + 1;
          }
          syncDeliveryFocusVisual();
        }

        function leaveSelectedListToGrid(gridIndex) {
          setDeliveryFocus(gridIndex);
        }

        function refreshDeliverySelectedList() {
          var $list = $(".selected-items-list"),
            $cards = getDeliveryItemCards();
          $list.empty();
          var has = false;
          for (var i = 0; i < deliveryQuantities.length; i++) {
            if (deliveryQuantities[i] > 0) {
              has = true;
              var name = $cards.eq(i).find(".item-name").text();
              var qty = deliveryQuantities[i];
              var $row = $("<div/>", {
                class: "selected-item",
                "data-grid-index": String(i),
              });
              $row.append(
                $("<div/>", { class: "selected-item-name", text: name }),
                $("<div/>", { class: "minus" }),
                $("<div/>", { class: "item-qty", text: String(qty) })
              );
              $list.append($row);
            }
          }
          if (!has) {
            $list.append(
              $("<div/>", { class: "selected-item empty-hint" }).text("暂无已选物品")
            );
            deliveryFocusZone = "grid";
            deliverySelectedFocusIndex = 0;
            deliveryActionBtnIndex = 0;
            deliverySelectedFocusBeforeActions = 0;
          } else if (deliveryFocusZone === "selected") {
            var cnt = getDeliverySelectedEntries().length;
            if (deliverySelectedFocusIndex >= cnt) {
              deliverySelectedFocusIndex = Math.max(0, cnt - 1);
            }
          }
          syncDeliveryFocusVisual();
        }

        function isDeliveryPageActive() {
          return jData.showBox === 2 && getDeliveryItemCards().length > 0;
        }

        //===== 焦点移动实现方法 start=====
        /**
         * [keyUp 向上移动焦点的方法逻辑]
         */
        function keyUp() {
          if (isDeliveryPageActive()) {
            if (deliveryFocusZone === "actions") {
              leaveActionsToSelectedList();
            } else if (deliveryFocusZone === "selected") {
              moveDeliverySelectedFocusUp();
            } else {
              moveDeliveryFocus(-1, 0);
            }
          }
        }

        /**
         * [keyDown 向下移动焦点的方法逻辑]
         */
        function keyDown() {
          if (isDeliveryPageActive()) {
            if (deliveryFocusZone === "actions") {
              if (deliveryActionBtnIndex < 1) {
                deliveryActionBtnIndex = 1;
                syncDeliveryFocusVisual();
              }
            } else if (deliveryFocusZone === "selected") {
              if (deliverySelectedCanMoveDown()) {
                moveDeliverySelectedFocusDown();
              } else if (getDeliverySelectedEntries().length > 0) {
                deliverySelectedFocusBeforeActions = deliverySelectedFocusIndex;
                deliveryFocusZone = "actions";
                deliveryActionBtnIndex = 0;
                syncDeliveryFocusVisual();
              }
            } else {
              moveDeliveryFocus(1, 0);
            }
          }
        }

        /**
         * [keyRight 向右移动焦点的方法逻辑]
         */
        function keyRight() {
          if (isDeliveryPageActive()) {
            if (deliveryFocusZone === "actions") {
              if (deliveryActionBtnIndex < 1) {
                deliveryActionBtnIndex = 1;
                syncDeliveryFocusVisual();
              } else {
                leaveActionsToSelectedList();
              }
            } else if (deliveryFocusZone === "selected") {
              var entries = getDeliverySelectedEntries(),
                n = entries.length,
                idx = deliverySelectedFocusIndex;
              if (!n) {
                deliveryFocusZone = "grid";
                syncDeliveryFocusVisual();
                return;
              }
              if (idx % 2 === 0 && idx + 1 < n) {
                deliverySelectedFocusIndex = idx + 1;
                syncDeliveryFocusVisual();
              } else if (deliverySelectedIsTowardGridEdge(idx, n)) {
                leaveSelectedListToGridLeftColumn(idx);
              }
            } else {
              moveDeliveryFocus(0, 1);
            }
          }
        }

        /**
         * [keyLeft 向左移动焦点的方法逻辑]
         */
        function keyLeft() {
          if (isDeliveryPageActive()) {
            if (deliveryFocusZone === "actions") {
              if (deliveryActionBtnIndex > 0) {
                deliveryActionBtnIndex = 0;
                syncDeliveryFocusVisual();
              } else {
                leaveActionsToSelectedList();
              }
            } else if (deliveryFocusZone === "selected") {
              var entries = getDeliverySelectedEntries(),
                n = entries.length,
                idx = deliverySelectedFocusIndex;
              if (!n) {
                deliveryFocusZone = "grid";
                syncDeliveryFocusVisual();
                return;
              }
              if (idx % 2 === 1) {
                deliverySelectedFocusIndex = idx - 1;
                syncDeliveryFocusVisual();
              } else {
                leaveSelectedListToGrid(entries[idx].gridIndex);
              }
            } else {
              var entriesG = getDeliverySelectedEntries(),
                rc = deliveryIndexToRC(deliveryFocusIndex);
              if (rc.col === 0 && entriesG.length > 0) {
                deliveryFocusZone = "selected";
                deliverySelectedFocusIndex = pickSelectedFocusForGridLeftEnter(
                  rc.row
                );
                syncDeliveryFocusVisual();
              } else {
                moveDeliveryFocus(0, -1);
              }
            }
          }
        }

        //===== 焦点移动实现方法 end=====

        /**
         * [enterykeyLogic 确认键：当前焦点物品数量 +1（送物页）]
         */
        function enterykeyLogic() {
          if (isDeliveryPageActive()) {
            if (deliveryFocusZone === "actions") {
              if (deliveryActionBtnIndex === 0) {
                deliverySubmitOrder();
              } else {
                deliveryResetAllQuantities();
              }
            } else if (deliveryFocusZone === "selected") {
              var entries = getDeliverySelectedEntries();
              if (!entries.length) {
                deliveryFocusZone = "grid";
                syncDeliveryFocusVisual();
                return;
              }
              var si = Math.min(
                  deliverySelectedFocusIndex,
                  entries.length - 1
                ),
                gi = entries[si].gridIndex;
              deliveryChangeQtyAtIndex(gi, -1);
            } else {
              deliveryChangeQty(1);
            }
          }
        }

        /**
         * [keyhandle 导航页面的按键交互实现逻辑]
         */
        function keyhandle(keycode) {
          //$(domScreenLayer).hide();
          requirejs(["keyCode"], function (kc) {
            if (keyDownLock) {
              return;
            }

            if (
              keycode >= kc.KEY_CHARSET_0 &&
              keycode <= kc.KEY_CHARSET_9 &&
              jData.showBox !== 1
            ) {
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
                if (!isDeliveryPageActive()) {
                  $(".nav-animation").addClass("nav-animation1");
                  $(".content-box-hide").addClass("animationbox");
                }
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
                if (!isDeliveryPageActive()) {
                  $(".nav-animation").addClass("nav-animation1");
                  $(".content-box-hide").addClass("animationbox");
                }
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
                if (!isDeliveryPageActive()) {
                  $(".nav-animation").addClass("nav-animation1");
                  $(".content-box-hide").removeClass("animationbox");
                }
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
                if (!isDeliveryPageActive()) {
                  $(".nav-animation").addClass("nav-animation1");
                  $(".content-box-hide").removeClass("animationbox");
                }
                break;

              case kc.KEY_ENTER:
                if (jData.showBox === 1) {
                  if (jData.alertBox.cursorIndex) {
                    jData.showBox = 2;

                    domBulletin.removeClass("show-bulletin");
                    jData.alertBox.cursorIndex = 0;
                    renderAlertBox();
                  } else {
                    requirejs(["url"], function (url) {
                      window.location.href = url.DVB_PAGE_PATH;
                    });
                  }
                  return;
                }
                if (jData.showBox === 0) {
                  jData.showBox = 2;
                  domBulletin.removeClass("show-bulletin");
                  renderAlertBox();
                  return;
                }

                if (enterLock) {
                  enterLock = false;
                  enterykeyLogic();
                  setTimeout(function () {
                    enterLock = true;
                  }, 200);
                }
                break;

              case kc.KEY_PAGE_UP:
              case 33:
                if (jData.showBox !== 2) {
                  return;
                }
                if (isDeliveryPageActive() && deliveryFocusZone === "grid") {
                  deliveryChangeQty(1);
                }
                break;

              case kc.KEY_PAGE_DOWN:
              case 34:
                if (jData.showBox !== 2) {
                  return;
                }
                if (isDeliveryPageActive() && deliveryFocusZone === "grid") {
                  deliveryChangeQty(-1);
                }
                break;

              case kc.KEY_BACKSPACE:
                clearInterval(imgInterval);
                window.location.href = "../index/index.html";

                break;
              case kc.KEY_MENU:
                if (apk.isModuleEnable("vod")) {
                  // tools.loadUrl(url.VOD_PAGE_PATH);
                  return;
                }
                break;
            }
            var skipArrowKeyLock =
              isDeliveryPageActive() &&
              (keycode === kc.KEY_UP ||
                keycode === kc.KEY_DOWN ||
                keycode === kc.KEY_LEFT ||
                keycode === kc.KEY_RIGHT);
            if (!keyDownLock && !skipArrowKeyLock) {
              keyDownLock = true;
              setTimeout(function () {
                keyDownLock = false;
              }, 200);
            }
          });
        }

    });