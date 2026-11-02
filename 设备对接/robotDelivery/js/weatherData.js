/*说明：qiugc 使用的 menuData -- 'id':'#city_0'*/

/*为了方便代码的可读性，zxs 将id改成相应的城市名称 -- 'id':"#beijing"*/

/* 但是后来由于版本变更 hotel/js/common/global-name-zh_CN.js 文件变量名称格式改变，
 * 将全部是大写的城市名称改成了首字母大写其余字母小写，CITY_BEIJING -- CITY_Beijing
 * 导致现在我在原有的对象属性中添加 nameUl 属性，取Upper 和 lower 两个单词的首字母 。
 * 20150807 zxs
 */

define(function () {
    var GL;
    if (Config.LANGUAGE_CODE === 'zh_CN') {
        GL = {
            CITY_Beijing: '北京',
            CITY_Shanghai: '上海',
            CITY_Hangzhou: '杭州',
            CITY_Guangzhou: '广州',
            CITY_Wuhan: '武汉',
            CITY_Nanjing: '南京',
            CITY_Shenzhen: '深圳',
            CITY_Suzhou: '苏州',
            CITY_Xiamen: '厦门',
            CITY_Hefei: '合肥',
            CITY_Changsha: '长沙',
            CITY_Chengdu: '成都',
            CITY_Ningbo: '宁波',
            CITY_Nanchang: '南昌',
            CITY_Chongqing: '重庆',
            CITY_Zhengzhou: '郑州',
            CITY_Wuxi: '无锡',
            CITY_XiAn: '西安',
            CITY_JiNan: '济南',
            CITY_Changzhou: '常州',
            CITY_Fuzhou: '福州',
            CITY_Tianjin: '天津',
            CITY_Qingdao: '青岛',
            CITY_Dongguan: '东莞',
            CITY_Harbin: '哈尔滨',
            CITY_Changchun: '长春',
            CITY_Shenyang: '沈阳',
            CITY_Nanning: '南宁',
            CITY_Xining: '西宁',
            CITY_Sanya: '三亚',
            CITY_Haikou: '海口',
            CITY_Lhasa: '拉萨',
            CITY_Hohhot: '呼和浩特',
            CITY_Urumqi: '乌鲁木齐',
            CITY_Yinchuan: '银川',
            CITY_Lanzhou: '兰州',
            CITY_Guiyang: '贵阳',
            CITY_Kunming: '昆明',
            CITY_Taiyuan: '太原',
            CITY_Shijiazhuang: '石家庄',
            CITY_Taipei: '台北',
            CITY_Hongkong: '香港',
            CITY_Macao: '澳门',
            CITY_Seoul: '首尔',
            CITY_Singapore: '新加坡',
            CITY_Bangkok: '曼谷',
            CITY_NewYork: '纽约',
            CITY_Dubai: '迪拜',
            CITY_Osaka: '大阪',
            CITY_Sydney: '悉尼',
            CITY_Melbourne: '墨尔本',
            CITY_Losangeles: '洛杉矶',
            CITY_KualaLumpur: '吉隆坡',
            CITY_London: '伦敦',
            CITY_Huilingdun: '惠灵顿',
            CITY_Chicago: '芝加哥',
            CITY_Frankfurt: '法兰克福',
            CITY_Washington: '华盛顿',
            CITY_Moscow: '莫斯科',
            CITY_Tokyo: '东京',
            CITY_Munich: '慕尼黑',
            CITY_Boston: '波士顿',
            CITY_LasVegas: '拉斯维加斯',
            CITY_Paris: '巴黎',
            CITY_Vancouver: '温哥华',
            CITY_Kyoto: '京都',
            CITY_SanFrancisco: '旧金山',
            CITY_Wellington: '惠灵顿',
            CITY_Hawaii: '夏威夷',
            CITY_Kiev: '基辅',
            CITY_Cairo: '开罗',
            CITY_Karachi: '卡拉奇',
            CITY_Houston: '休斯顿',
            CITY_RiodeJaneiro: '里约热内卢',
            CITY_Baghdad: '巴格达',
            CITY_NewDelhi: '新德里',
            CITY_Caracas: '加拉加斯',
            CITY_Stockholm: '斯德哥尔摩',
            CITY_Berlin: '柏林',
            CITY_Geneva: '日内瓦',
            CITY_Lisbon: '里斯本',
            CITY_Manila: '马尼拉',
            CITY_Magadan: '马加丹',
            CITY_Alaska: '阿拉斯加',
            CITY_Seattle: '西雅图',
            CITY_Phoenix: '菲尼克斯',
            CITY_Mexico: '墨西哥城',
            CITY_Diego: '圣地亚哥',
            CITY_Dhabi: '阿布扎比',
            CITY_Islamabad: '伊斯兰堡',
            CITY_AlmaAta: '阿拉木图',
            CITY_Dhaka: '达卡',
            CITY_Djakarta: '雅加达',

            WEATHER_0: '晴',
            WEATHER_01: '多云',
            WEATHER_02: '阴',
            WEATHER_03: '阵雨',
            WEATHER_04: '雷阵雨',
            WEATHER_05: '雷阵雨伴有冰雹',
            WEATHER_06: '雨夹雪',
            WEATHER_07: '小雨',
            WEATHER_08: '中雨',
            WEATHER_09: '大雨',
            WEATHER_10: '暴雨',
            WEATHER_11: '大暴雨',
            WEATHER_12: '特大暴雨',
            WEATHER_13: '阵雪',
            WEATHER_14: '小雪',
            WEATHER_15: '中雪',
            WEATHER_16: '大雪',
            WEATHER_17: '暴雪',
            WEATHER_18: '雾',
            WEATHER_19: '冻雨',
            WEATHER_20: '沙尘暴',
            WEATHER_21: '小到中雨',
            WEATHER_22: '中到大雨',
            WEATHER_23: '大到暴雨',
            WEATHER_24: '暴雨到大暴雨',
            WEATHER_25: '大暴雨到特大暴雨',
            WEATHER_26: '小到中雪',
            WEATHER_27: '中到大雪',
            WEATHER_28: '大到暴雪',
            WEATHER_29: '浮尘',
            WEATHER_30: '扬沙',
            WEATHER_31: '沙尘暴',
            WEATHER_32: '强沙尘暴',
            WEATHER_33: '特强沙尘暴',
            WEATHER_34: '轻雾',
            WEATHER_35: '浓雾',
            WEATHER_36: '强浓雾',
            WEATHER_37: '轻微霾',
            WEATHER_38: '轻度霾',
            WEATHER_39: '中度霾',
            WEATHER_40: '重度霾',
            WEATHER_41: '特强霾',
            WEATHER_42: '霰',
            WEATHER_43: '飑线',
            WEATHER_WIND_0: '无风',
            WEATHER_WIND_1: '1级',
            WEATHER_WIND_2: '2级',
            WEATHER_WIND_3: '3级',
            WEATHER_WIND_4: '4级',
            WEATHER_WIND_5: '5级',
            WEATHER_WIND_6: '6级',
            WEATHER_WIND_7: '7级',
            WEATHER_WIND_8: '8级',
            WEATHER_WIND_9: '9级',
            WEATHER_WIND_10: '10级',
            WEATHER_WIND_11: '11级',
            WEATHER_WIND_12: '12级',
            WEATHER_WIND_13: '1~2级',
            WEATHER_WIND_14: '3~4级',
            WEATHER_WIND_15: '5~6级',
            WEATHER_WIND_16: '7~8级',
            WEATHER_WIND_17: '9~10级',
            WEATHER_WIND_18: '11~12级',

            WEATHER_TODAY: '今天',
            WEATHER_AFTER: '明天',
            WEATHER_TOMORROW: '后天',
            WEATHER_SOURCE: '来源于中央气象台',
            WEATHER_DAY: '白天',
            WEATHER_TEMPERATURE_H: '最高气温',
            WEATHER_TEMPERATURE_L: '最低气温',
            WEATHER_WIND: '风力',
            WEATHER_NIGHT: '夜晚',
            WEATHER_HAO: '号',
            WEATHER_SSD: '', //℃
            WEATHER_XYH: '', //<
        };
    } else {
        GL = {
            CITY_Beijing: 'Beijing',
            CITY_Shanghai: 'Shanghai',
            CITY_Hangzhou: 'Hangzhou',
            CITY_Guangzhou: 'Guangzhou',
            CITY_Wuhan: 'Wuhan',
            CITY_Nanjing: 'Nanjing',
            CITY_Shenzhen: 'Shenzhen',
            CITY_Suzhou: 'Suzhou',
            CITY_Xiamen: 'Xiamen',
            CITY_Hefei: 'Hefei',
            CITY_Changsha: 'Changsha',
            CITY_Chengdu: 'Chengdu',
            CITY_Ningbo: 'Ningbo',
            CITY_Nanchang: 'Nanchang',
            CITY_Chongqing: 'Chongqing',
            CITY_Zhengzhou: 'Zhengzhou',
            CITY_Wuxi: 'Wuxi',
            CITY_XiAn: 'Xi\'an',
            CITY_JiNan: 'Ji\'nan',
            CITY_Changzhou: 'Changzhou',
            CITY_Fuzhou: 'Fuzhou',
            CITY_Tianjin: 'Tianjin',
            CITY_Qingdao: 'Qingdao',
            CITY_Dongguan: 'Dongguan',
            CITY_Harbin: 'Harbin',
            CITY_Changchun: 'Changchun',
            CITY_Shenyang: 'Shenyang',
            CITY_Nanning: 'Nanning',
            CITY_Xining: 'Xining',
            CITY_Sanya: 'Sanya',
            CITY_Haikou: 'Haikou',
            CITY_Lhasa: 'Lhasa',
            CITY_Hohhot: 'Hohhot',
            CITY_Urumqi: 'Urumqi',
            CITY_Yinchuan: 'Yinchuan',
            CITY_Lanzhou: 'Lanzhou',
            CITY_Guiyang: 'Guiyang',
            CITY_Kunming: 'Kunming',
            CITY_Taiyuan: 'Taiyuan',
            CITY_Shijiazhuang: 'Shijiazhuang',
            CITY_Taipei: 'Taipei',
            CITY_Hongkong: 'Hongkong',
            CITY_Macao: 'Macao',
            CITY_Seoul: 'Seoul',
            CITY_Singapore: 'Singapore',
            CITY_Bangkok: 'Bangkok',
            CITY_NewYork: 'New York',
            CITY_Dubai: 'Dubai',
            CITY_Osaka: 'Osaka',
            CITY_Sydney: 'Sydney',
            CITY_Melbourne: 'Melbourne',
            CITY_Losangeles: 'Losangeles',
            CITY_KualaLumpur: 'Kuala Lumpur',
            CITY_London: 'London',
            CITY_Chicago: 'Chicago',
            CITY_Frankfurt: 'Frankfurt',
            CITY_Washington: 'Washington',
            CITY_Moscow: 'Moscow',
            CITY_Tokyo: 'Tokyo',
            CITY_Munich: 'Munich',
            CITY_Boston: 'Boston',
            CITY_Huilingdun: 'Huilingdun',
            CITY_LasVegas: 'Las Vegas',
            CITY_Paris: 'Paris',
            CITY_Vancouver: 'Vancouver',
            CITY_Kyoto: 'Kyoto',
            CITY_Seattle: 'Seattle',
            CITY_SanFrancisco: 'San Francisco',
            CITY_Wellington: 'Wellington',
            CITY_Hawaii: 'Hawaii',
            CITY_Kiev: 'Kiev',
            CITY_Cairo: 'Cairo',
            CITY_Karachi: 'Karachi',
            CITY_Houston: 'Houston',
            CITY_RiodeJaneiro: 'Rio de Janeiro',
            CITY_Baghdad: 'Baghdad',
            CITY_NewDelhi: 'New Delhi',
            CITY_Caracas: 'Caracas',
            CITY_Stockholm: 'Stockholm',
            CITY_Berlin: 'Berlin',
            CITY_Geneva: 'Geneva',
            CITY_Lisbon: 'Lisbon',
            CITY_Manila: 'Manila',
            CITY_Magadan: 'Magadan',
            CITY_Alaska: 'Alaska',
            CITY_Phoenix: 'Phoenix',
            CITY_Mexico: 'Mexico',
            CITY_Diego: 'Diego',
            CITY_Dhabi: 'Dhabi',
            CITY_Islamabad: 'Islamabad',
            CITY_AlmaAta: 'AlmaAta',
            CITY_Dhaka: 'Dhaka',
            CITY_Djakarta: 'Djakarta',

            WEATHER_0: 'Sunny',
            WEATHER_01: 'Cloudy',
            WEATHER_02: 'Cloudy',
            WEATHER_03: 'Shower ',
            WEATHER_04: 'Thunder shower',
            WEATHER_05: 'Thunderstorms with hail',
            WEATHER_06: 'Rain and snow',
            WEATHER_07: 'Light rain',
            WEATHER_08: 'Rain',
            WEATHER_09: 'Heavy rain',
            WEATHER_10: 'Heavy rain',
            WEATHER_11: 'Heavy rain',
            WEATHER_12: 'Heavy rain',
            WEATHER_13: 'Snow shower',
            WEATHER_14: 'Slight snow',
            WEATHER_15: 'Snow',
            WEATHER_16: 'Heavy snow',
            WEATHER_17: 'Heavy snow',
            WEATHER_18: 'Fog',
            WEATHER_19: 'Ice rain',
            WEATHER_20: 'Sandstorm',
            WEATHER_21: 'Light rain',
            WEATHER_22: 'Rain',
            WEATHER_23: 'Heavy rain',
            WEATHER_24: 'Heavy rain',
            WEATHER_25: 'Heavy rain',
            WEATHER_26: 'Slight snow',
            WEATHER_27: 'Snow',
            WEATHER_28: 'Heavy snow',
            WEATHER_29: 'Dust',
            WEATHER_30: 'Blowing sand',
            WEATHER_31: 'Sandstorm',
            WEATHER_32: 'Strong sandstorm',
            WEATHER_33: 'Strong sandstorm',
            WEATHER_34: 'Light fog',
            WEATHER_35: 'Fog',
            WEATHER_36: 'Heavy fog',
            WEATHER_37: 'Slight haze',
            WEATHER_38: 'Light haze',
            WEATHER_39: 'Haze',
            WEATHER_40: 'Heavy haze',
            WEATHER_41: 'Heavy haze',
            WEATHER_42: 'Graupel',
            WEATHER_43: 'Squall',

            WEATHER_WIND_0: 'No Wind',
            WEATHER_WIND_1: '1Lv',
            WEATHER_WIND_2: '2Lv',
            WEATHER_WIND_3: '3Lv',
            WEATHER_WIND_4: '4Lv',
            WEATHER_WIND_5: '5Lv',
            WEATHER_WIND_6: '6Lv',
            WEATHER_WIND_7: '7Lv',
            WEATHER_WIND_8: '8Lv',
            WEATHER_WIND_9: '9Lv',
            WEATHER_WIND_10: '10Lv',
            WEATHER_WIND_11: '11Lv',
            WEATHER_WIND_12: '12Lv',
            WEATHER_WIND_13: '1~2Lv',
            WEATHER_WIND_14: '3~4Lv',
            WEATHER_WIND_15: '5~6Lv',
            WEATHER_WIND_16: '7~8Lv',
            WEATHER_WIND_17: '9~10Lv',
            WEATHER_WIND_18: '11~12Lv',

            WEATHER_TODAY: 'Today',
            WEATHER_AFTER: 'Tomorrow',
            WEATHER_TOMORROW: 'Day After Tomorrow',
            WEATHER_SOURCE: 'According to China Central Meteorological Station',
            WEATHER_DAY: 'Day',
            WEATHER_TEMPERATURE_H: 'Hight Temp',
            WEATHER_TEMPERATURE_L: 'Low Temp',
            WEATHER_WIND: 'W',
            WEATHER_NIGHT: 'Night',
            WEATHER_HAO: '.',
            WEATHER_SSD: '', //℃
            WEATHER_XYH: '', //<
        };
    }

    return {
        'menuData': [
            /*============B=============*/
            {
                'id': '#beijing',
                'type': 0,
                'config': 'Beijing',
                'name': GL.CITY_BEIJING,
                'nameUl': GL.CITY_Beijing
            }, {
                'id': '#Bangkok',
                'type': 1,
                'config': 'Bangkok',
                'name': GL.CITY_Bangkok,
                'nameUl': GL.CITY_Bangkok
            }, {
                'id': '#Boston',
                'type': 1,
                'config': 'Boston',
                'name': GL.CITY_Boston,
                'nameUl': GL.CITY_Boston
            },
            /*============C==============*/
            {
                'id': '#changchun',
                'type': 0,
                'config': 'Changchun',
                'name': GL.CITY_CHANGCHUN,
                'nameUl': GL.CITY_Changchun
            }, {
                'id': '#Changzhou',
                'type': 0,
                'config': 'Changzhou',
                'name': GL.CITY_Changzhou,
                'nameUl': GL.CITY_Changzhou
            }, {
                'id': '#chongqing',
                'type': 0,
                'config': 'Chongqing',
                'name': GL.CITY_CHONGQING,
                'nameUl': GL.CITY_Chongqing
            }, {
                'id': '#changsha',
                'type': 0,
                'config': 'Changsha',
                'name': GL.CITY_CHANGSHA,
                'nameUl': GL.CITY_Changsha
            }, {
                'id': '#chengdu',
                'type': 0,
                'config': 'Chengdu',
                'name': GL.CITY_CHENGDU,
                'nameUl': GL.CITY_Chengdu
            }, {
                'id': '#Chicago',
                'type': 1,
                'config': 'Chicago',
                'name': GL.CITY_Chicago,
                'nameUl': GL.CITY_Chicago
            },
            /*============D================*/
            {
                'id': '#Dongguan',
                'type': 0,
                'config': 'Dongguan',
                'name': GL.CITY_Dongguan,
                'nameUl': GL.CITY_Dongguan
            }, {
                'id': '#Dubai',
                'type': 1,
                'config': 'Dubai',
                'name': GL.CITY_Dubai,
                'nameUl': GL.CITY_Dubai
            },
            /*=============F===============*/
            {
                'id': '#fuzhou',
                'type': 0,
                'config': 'Fuzhou',
                'name': GL.CITY_FUZHOU,
                'nameUl': GL.CITY_Fuzhou
            }, {
                'id': '#Frankfurt',
                'type': 1,
                'config': 'Frankfurt',
                'name': GL.CITY_Frankfurt,
                'nameUl': GL.CITY_Frankfurt
            },
            /*=============G===============*/
            {
                'id': '#guangzhou',
                'type': 0,
                'config': 'Guangzhou',
                'name': GL.CITY_GUANGZHOU,
                'nameUl': GL.CITY_Guangzhou
            }, {
                'id': '#guiyang',
                'type': 0,
                'config': 'Guiyang',
                'name': GL.CITY_GUIYANG,
                'nameUl': GL.CITY_Guiyang
            },
            /*==============H==============*/
            {
                'id': '#hongkong',
                'type': 0,
                'config': 'Hongkong',
                'name': GL.CITY_XIANGANG,
                'nameUl': GL.CITY_Hongkong
            }, {
                'id': '#hangzhou',
                'type': 0,
                'config': 'Hangzhou',
                'name': GL.CITY_HANGZHOU,
                'nameUl': GL.CITY_Hangzhou
            }, {
                'id': '#haikou',
                'type': 0,
                'config': 'Haikou',
                'name': GL.CITY_HAIKOU,
                'nameUl': GL.CITY_Haikou
            }, {
                'id': '#hefei',
                'type': 0,
                'config': 'Hefei',
                'name': GL.CITY_HEFEI,
                'nameUl': GL.CITY_Hefei
            }, {
                'id': '#haerbin',
                'type': 0,
                'config': 'Harbin',
                'name': GL.CITY_HAERBIN,
                'nameUl': GL.CITY_Harbin
            }, {
                'id': '#hohhot',
                'type': 0,
                'config': 'Hohhot',
                'name': GL.CITY_HUHEHAOTE,
                'nameUl': GL.CITY_Hohhot
            }, {
                'id': '#huilingdun',
                'type': 1,
                'config': 'huilingdun',
                'name': GL.CITY_Huilingdun,
                'nameUl': GL.CITY_Huilingdun
            },
            /*===========J=================*/
            {
                'id': '#jinan',
                'type': 0,
                'config': 'JiNan',
                'name': GL.CITY_JiNan,
                'nameUl': GL.CITY_JiNan
            },
            /*============K================*/
            {
                'id': '#kunming',
                'type': 0,
                'config': 'Kunming',
                'name': GL.CITY_KUNMING,
                'nameUl': GL.CITY_Kunming
            }, {
                'id': '#KualaLumpur',
                'type': 1,
                'config': 'KualaLumpur',
                'name': GL.CITY_KualaLumpur,
                'nameUl': GL.CITY_KualaLumpur
            }, {
                'id': '#Kyoto',
                'type': 1,
                'config': 'Kyoto',
                'name': GL.CITY_Kyoto,
                'nameUl': GL.CITY_Kyoto
            },
            /*=============L================*/
            {
                'id': '#lanzhou',
                'type': 0,
                'config': 'Lanzhou',
                'name': GL.CITY_LANZHOU,
                'nameUl': GL.CITY_Lanzhou
            }, {
                'id': '#Losangeles',
                'type': 1,
                'config': 'Losangeles',
                'name': GL.CITY_Losangeles,
                'nameUl': GL.CITY_Losangeles
            }, {
                'id': '#lhasa',
                'type': 1,
                'config': 'Lhasa',
                'name': GL.CITY_LASA,
                'nameUl': GL.CITY_Lhasa
            }, {
                'id': '#London',
                'type': 1,
                'config': 'London',
                'name': GL.CITY_London,
                'nameUl': GL.CITY_London
            }, {
                'id': '#LasVegas',
                'type': 1,
                'config': 'LasVegas',
                'name': GL.CITY_LasVegas,
                'nameUl': GL.CITY_LasVegas
            },
            /*===============M=================*/
            {
                'id': '#Melbourne',
                'type': 1,
                'config': 'Melbourne',
                'name': GL.CITY_Melbourne,
                'nameUl': GL.CITY_Melbourne
            }, {
                'id': '#Moscow',
                'type': 1,
                'config': 'Moscow',
                'name': GL.CITY_Moscow,
                'nameUl': GL.CITY_Moscow
            }, {
                'id': '#Munich',
                'type': 1,
                'config': 'Munich',
                'name': GL.CITY_Munich,
                'nameUl': GL.CITY_Munich
            }, {
                'id': '#macao',
                'type': 1,
                'config': 'Macao',
                'name': GL.CITY_AOMEN,
                'nameUl': GL.CITY_Macao
            },
            /*=================N================*/
            {
                'id': '#nanchang',
                'type': 0,
                'config': 'Nanchang',
                'name': GL.CITY_NANCHANG,
                'nameUl': GL.CITY_Nanchang
            }, {
                'id': '#nanning',
                'type': 0,
                'config': 'Nanning',
                'name': GL.CITY_NANNING,
                'nameUl': GL.CITY_Nanning
            }, {
                'id': '#nanjing',
                'type': 0,
                'config': 'Nanjing',
                'name': GL.CITY_NANJING,
                'nameUl': GL.CITY_Nanjing
            }, {
                'id': '#Ningbo',
                'type': 0,
                'config': 'Ningbo',
                'name': GL.CITY_Ningbo,
                'nameUl': GL.CITY_Ningbo
            }, {
                'id': '#NewYork',
                'type': 1,
                'config': 'NewYork',
                'name': GL.CITY_NewYork,
                'nameUl': GL.CITY_NewYork
            },
            /*==============O==================*/
            {
                'id': '#Osaka',
                'type': 1,
                'config': 'Osaka',
                'name': GL.CITY_Osaka,
                'nameUl': GL.CITY_Osaka
            },
            /*================P================*/
            {
                'id': '#Paris',
                'type': 1,
                'config': 'Paris',
                'name': GL.CITY_Paris,
                'nameUl': GL.CITY_Paris
            },
            /*================Q================*/
            {
                'id': '#Qingdao',
                'type': 0,
                'config': 'Qingdao',
                'name': GL.CITY_Qingdao,
                'nameUl': GL.CITY_Qingdao
            },
            /*================S================*/
            {
                'id': '#shenzhen',
                'type': 0,
                'config': 'Shenzhen',
                'name': GL.CITY_Shenzhen,
                'nameUl': GL.CITY_Shenzhen
            }, {
                'id': '#shanghai',
                'type': 0,
                'config': 'Shanghai',
                'name': GL.CITY_SHANGHAI,
                'nameUl': GL.CITY_Shanghai
            }, {
                'id': '#Sanya',
                'type': 0,
                'config': 'Sanya',
                'name': GL.CITY_Sanya,
                'nameUl': GL.CITY_Sanya
            }, {
                'id': '#Suzhou',
                'type': 0,
                'config': 'Suzhou',
                'name': GL.CITY_Suzhou,
                'nameUl': GL.CITY_Suzhou
            }, {
                'id': '#shenyang',
                'type': 0,
                'config': 'Shenyang',
                'name': GL.CITY_SHENYANG,
                'nameUl': GL.CITY_Shenyang
            }, {
                'id': '#shijiazhuang',
                'type': 0,
                'config': 'Shijiazhuang',
                'name': GL.CITY_SHIJIAZHUANG,
                'nameUl': GL.CITY_Shijiazhuang
            }, {
                'id': '#SanFrancisco',
                'type': 1,
                'config': 'SanFrancisco',
                'name': GL.CITY_SanFrancisco,
                'nameUl': GL.CITY_SanFrancisco
            }, {
                'id': '#sydney',
                'type': 1,
                'config': 'Sydney',
                'name': GL.CITY_Sydney,
                'nameUl': GL.CITY_Sydney
            },

            {
                'id': '#Seoul',
                'type': 1,
                'config': 'Seoul',
                'name': GL.CITY_Seoul,
                'nameUl': GL.CITY_Seoul
            }, {
                'id': '#Singapore',
                'type': 1,
                'config': 'Singapore',
                'name': GL.CITY_Singapore,
                'nameUl': GL.CITY_Singapore
            },
            /*===========T==============*/
            {
                'id': '#tianjin',
                'type': 0,
                'config': 'Tianjin',
                'name': GL.CITY_TIANJIN,
                'nameUl': GL.CITY_Tianjin
            }, {
                'id': '#taiyuan',
                'type': 0,
                'config': 'Taiyuan',
                'name': GL.CITY_TAIYUAN,
                'nameUl': GL.CITY_Taiyuan
            }, {
                'id': '#taipei',
                'type': 0,
                'config': 'Taipei',
                'name': GL.CITY_TAIBEI,
                'nameUl': GL.CITY_Taipei
            }, {
                'id': '#Tokyo',
                'type': 1,
                'config': 'Tokyo',
                'name': GL.CITY_Tokyo,
                'nameUl': GL.CITY_Tokyo
            },
            /*===========U===============*/
            {
                'id': '#urumqi',
                'type': 0,
                'config': 'Urumqi',
                'name': GL.CITY_WULUMIQI,
                'nameUl': GL.CITY_Urumqi
            },
            /*===========V===============*/
            {
                'id': '#Vancouver',
                'type': 1,
                'config': 'Vancouver',
                'name': GL.CITY_Vancouver,
                'nameUl': GL.CITY_Vancouver
            },
            /*=============W=============*/
            {
                'id': '#wuhan',
                'type': 0,
                'config': 'Wuhan',
                'name': GL.CITY_WUHAN,
                'nameUl': GL.CITY_Wuhan
            }, {
                'id': '#Wuxi',
                'type': 0,
                'config': 'Wuxi',
                'name': GL.CITY_Wuxi,
                'nameUl': GL.CITY_Wuxi
            }, {
                'id': '#Washington',
                'type': 1,
                'config': 'Washington',
                'name': GL.CITY_Washington,
                'nameUl': GL.CITY_Washington
            },
            /*============X===============*/
            {
                'id': '#xian',
                'type': 0,
                'config': 'XiAn',
                'name': GL.CITY_XIAN,
                'nameUl': GL.CITY_XiAn
            }, {
                'id': '#xining',
                'type': 0,
                'config': 'Xining',
                'name': GL.CITY_XINING,
                'nameUl': GL.CITY_Xining
            }, {
                'id': '#Xiamen',
                'type': 0,
                'config': 'Xiamen',
                'name': GL.CITY_Xiamen,
                'nameUl': GL.CITY_Xiamen
            },
            /*===============Y================*/
            {
                'id': '#yinchuan',
                'type': 0,
                'config': 'Yinchuan',
                'name': GL.CITY_YINCHUAN,
                'nameUl': GL.CITY_Yinchuan
            },
            /*================Z===============*/
            {
                'id': '#zhengzhou',
                'type': 0,
                'config': 'Zhengzhou',
                'name': GL.CITY_ZHENGZHOU,
                'nameUl': GL.CITY_Zhengzhou
            }
        ],

        'cityArr': [],

        'weatherData': [{
            'id': '00',
            'name': GL.WEATHER_0
        }, {
            'id': '01',
            'name': GL.WEATHER_01
        }, {
            'id': '02',
            'name': GL.WEATHER_02
        }, {
            'id': '03',
            'name': GL.WEATHER_03
        }, {
            'id': '04',
            'name': GL.WEATHER_04
        }, {
            'id': '05',
            'name': GL.WEATHER_05
        }, {
            'id': '06',
            'name': GL.WEATHER_06
        }, {
            'id': '07',
            'name': GL.WEATHER_07
        }, {
            'id': '08',
            'name': GL.WEATHER_08
        }, {
            'id': '09',
            'name': GL.WEATHER_09
        }, {
            'id': '10',
            'name': GL.WEATHER_10
        }, {
            'id': '11',
            'name': GL.WEATHER_11
        }, {
            'id': '12',
            'name': GL.WEATHER_12
        }, {
            'id': '13',
            'name': GL.WEATHER_13
        }, {
            'id': '14',
            'name': GL.WEATHER_14
        }, {
            'id': '15',
            'name': GL.WEATHER_15
        }, {
            'id': '16',
            'name': GL.WEATHER_16
        }, {
            'id': '17',
            'name': GL.WEATHER_17
        }, {
            'id': '18',
            'name': GL.WEATHER_18
        }, {
            'id': '19',
            'name': GL.WEATHER_19
        }, {
            'id': '20',
            'name': GL.WEATHER_20
        }, {
            'id': '21',
            'name': GL.WEATHER_21
        }, {
            'id': '22',
            'name': GL.WEATHER_22
        }, {
            'id': '23',
            'name': GL.WEATHER_23
        }, {
            'id': '24',
            'name': GL.WEATHER_24
        }, {
            'id': '25',
            'name': GL.WEATHER_25
        }, {
            'id': '26',
            'name': GL.WEATHER_26
        }, {
            'id': '27',
            'name': GL.WEATHER_27
        }, {
            'id': '28',
            'name': GL.WEATHER_28
        }, {
            'id': '29',
            'name': GL.WEATHER_29
        }, {
            'id': '30',
            'name': GL.WEATHER_30
        }, {
            'id': '31',
            'name': GL.WEATHER_31
        }, {
            'id': '32',
            'name': GL.WEATHER_32
        }, {
            'id': '33',
            'name': GL.WEATHER_33
        }, {
            'id': '34',
            'name': GL.WEATHER_34
        }, {
            'id': '35',
            'name': GL.WEATHER_35
        }, {
            'id': '36',
            'name': GL.WEATHER_36
        }, {
            'id': '37',
            'name': GL.WEATHER_37
        }, {
            'id': '38',
            'name': GL.WEATHER_38
        }, {
            'id': '39',
            'name': GL.WEATHER_39
        }, {
            'id': '40',
            'name': GL.WEATHER_40
        }, {
            'id': '41',
            'name': GL.WEATHER_41
        }, {
            'id': '42',
            'name': GL.WEATHER_42
        }, {
            'id': '43',
            'name': GL.WEATHER_43
        }],

        'weatherImg': [{
            'id': '00',
            'select': 'qing'
        }, {
            'id': '01',
            'select': 'duoyun'
        }, {
            'id': '02',
            'select': 'yin'
        }, {
            'id': '03',
            'select': 'zhenyu'
        }, {
            'id': '04',
            'select': 'leizhenyu'
        }, {
            'id': '05',
            'select': 'leizhenyubingbao'
        }, {
            'id': '06',
            'select': 'yujiaxue'
        }, {
            'id': '07',
            'select': 'xiaoyu'
        }, {
            'id': '08',
            'select': 'zhongyu'
        }, {
            'id': '09',
            'select': 'dayu'
        }, {
            'id': '10',
            'select': 'baoyu'
        }, {
            'id': '11',
            'select': 'dabaoyu'
        }, {
            'id': '12',
            'select': 'tedabaoyu'
        }, {
            'id': '13',
            'select': 'zhenxue'
        }, {
            'id': '14',
            'select': 'xiaoxue'
        }, {
            'id': '15',
            'select': 'zhongxue'
        }, {
            'id': '16',
            'select': 'daxue'
        }, {
            'id': '17',
            'select': 'baoxue'
        }, {
            'id': '18',
            'select': 'wu'
        }, {
            'id': '19',
            'select': 'dongyu'
        }, {
            'id': '20',
            'select': 'shachenbao'
        }, {
            'id': '21',
            'select': 'xiaoyu'
        }, {
            'id': '22',
            'select': 'zhongyu'
        }, {
            'id': '23',
            'select': 'dayu'
        }, {
            'id': '24',
            'select': 'baoyu'
        }, {
            'id': '25',
            'select': 'dabaoyu'
        }, {
            'id': '26',
            'select': 'xiaoxue'
        }, {
            'id': '27',
            'select': 'zhongxue'
        }, {
            'id': '28',
            'select': 'daxue'
        }, {
            'id': '29',
            'select': 'fuchen'
        }, {
            'id': '30',
            'select': 'yangchen'
        }, {
            'id': '31',
            'select': 'shachenbao'
        }, {
            'id': '32',
            'select': 'shachenbao'
        }, {
            'id': '33',
            'select': 'shachenbao'
        }, {
            'id': '34',
            'select': 'wu'
        }, {
            'id': '35',
            'select': 'wu'
        }, {
            'id': '36',
            'select': 'wu'
        }, {
            'id': '37',
            'select': 'mai'
        }, {
            'id': '38',
            'select': 'mai'
        }, {
            'id': '39',
            'select': 'mai'
        }, {
            'id': '40',
            'select': 'mai'
        }, {
            'id': '41',
            'select': 'mai'
        }, {
            'id': '42',
            'select': 'xiaoxue'
        }, {
            'id': '43',
            'select': 'daxue'
        }],
        'context': {
            '#context_totay': GL.WEATHER_TODAY,
            '#context_after': GL.WEATHER_AFTER,
            '#context_tomorrow': GL.WEATHER_TOMORROW,
            '#context_weather_source': GL.WEATHER_SOURCE,
            '.context-day': GL.WEATHER_DAY,
            '#contextTemperatureH': GL.WEATHER_TEMPERATURE_H,
            '#contextTemperatureL': GL.WEATHER_TEMPERATURE_L,
            '.context-wind': GL.WEATHER_WIND,
            '.context-night': GL.WEATHER_NIGHT,
            '.context-hao': GL.WEATHER_HAO,
            '.weather-ssd': GL.WEATHER_SSD,
            '.weather-xyh': GL.WEATHER_XYH
        }
    };
});