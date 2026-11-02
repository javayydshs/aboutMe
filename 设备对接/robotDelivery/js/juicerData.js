/**
 * juicer模式使用的数据结构对象定义
 */
define(['indexText'],

    function(GL) {
        return {

            //导航页的内容光标索引
            cursorIndex: 0,
            //二级栏目index_s焦点下标
            curIndex_s:0,
            //标识首页广告图片的索引
            bannerImageIndex: 0,

            //导航页的页头光标索引
            titleCursorIndex: -1,

            screenCousorIndex: 0,

            wpkgListImg:[],

            logoImg:'',
            //一级导航需要修改的图标地址
            firstNavIcon: [-200, -400, -500, -600],
            firstNavMask: [],
            firstIntroDatas:[],

            //一级导航配置
            firstNavData: [
                GL.INDEX_KEFANG_YULE,
                GL.INDEX_MY_HOTEL,
                GL.INDEX_TRL_HELP,
                GL.INDEX_MORE_SET,
            ],

            //默认的一级导航的名称
            defFirstNavData: [
                '客房娱乐',
                '我的酒店',
                '旅行助手',
                '更多设置'
            ],

            defFirstNavDataNew: [
                '客房娱乐',
                '我的酒店',
                '自助服务',
                '贴心秘书'
            ],

            /**
             * [allModeArr 包含所有模块的数组,没有进行排序的数组]
             */
            allModeArr: [],

            /**
             * [showSubMenuArr 需要在页面显示的二级菜单的数组]
             * @type {Array}
             */
            showSubMenuArr: [],
            showIndexIcon:[],
            showDatas: [],
            /**
             * [isHasOverModel 标识是不是有溢出的二级模块]
             * @type {Boolean}
             */
            isHasOverModel: false,

            /**
             * [showBox 0:显示的弹出框为公告板 1：显示进入直播的询问框]
             */
            showBox: 2,

            /**
             * [alertBox 是否进入直播页面弹出框对象]
             */
            alertBox: {
                cursorIndex: 0,
                alertTextConfig: {
                    popname: GL.POPNAME,
                    popconnect: GL.POPCONNENT,
                    popyes: GL.POPYES,
                    popno: GL.POPNO
                },
            },

            footerBox: {
                cursorIndex: 0,
                footerTextConfig: {
                    indexfooter0: GL.INDEXFOOTER0,
                    indexfooter1: GL.INDEXFOOTER1,
                    indexfooter2: GL.INDEXFOOTER2
                },
            },

            contentBodyObj: {
                cursorIndex: 1,
                allItemsLength: 0,
                noticeCurrentPage: 1,
                noticeCountPage: 0,
                noteObj: {
                    zhArr: [],
                    enArr: []
                },
                noticeScrollHeight: [],
                noticeScroll: 0,

                textConfig: {
                    cancle: GL.NOTICE_RETURN,
                    bulletin: GL.NOTICE_TITLE
                },
                footerTextConfig: {
                    footer0: GL.NOTEFOOTER0,
                    footer1: GL.NOTEFOOTER1,
                    footer2: GL.NOTEFOOTER2,
                    footer3: GL.NOTEFOOTER3,
                    footer4: GL.NOTEFOOTER4,
                    footer5: GL.NOTEFOOTER5,
                    footer6: GL.NOTEFOOTER6,
                    footer7: GL.NOTEFOOTER7,
                    footer8: GL.NOTEFOOTER8,
                    footer9: GL.NOTEFOOTER9,
                }
            },

            //国际化文字配置
            context: {

            }
        };
    });