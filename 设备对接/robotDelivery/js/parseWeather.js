/**
 * @20170425
 * @qiugc
 * @计算解析天气预报的数据信息
 */
/* globals requirejs,Pinyin*/

define(['globalStatic',
        'weatherData',
        'sort'
    ],
    function (gbs, wd) {

        var cityArr = [];

        function getWeather() {
            var dataVersion = apk.getWeatherDataVersion();
            if (sessionStorage.getItem(gbs.WEATHER_MD5) !== dataVersion
                || sessionStorage.getItem('cacheLange') !== Config.LANGUAGE_CODE) {
                var cityNameList = wd.menuData;
                var date = new Date().getDate();
                var weatherDate = apk.getWeatherDatas();
                if (weatherDate && weatherDate !== '[]') {
                    var obj = jQuery.parseJSON(weatherDate);
                    var cityName = apk.getCityName();
                    if (cityName !== '') {
                        $.each(obj, function (index, entry) {
                            var tempI;
                            if (cityName === entry.city) {
                                for (var i = 0; i < cityNameList.length; i++) {
                                    if (cityNameList[i].config === entry.city) {
                                        tempI = i;
                                    }
                                }
                                var cityObj = {
                                    city: cityNameList[tempI].nameUl,
                                    todayWeather: {},
                                    nextdayWeather: {},
                                    thriddayWeather: {}
                                };
                                var count = 0;
                                var wflag = false;
                                $.each(entry.weaList, function (index, datas) {
                                    var mjd = parseInt(tools.getDataFromTime(datas.mjd)[2],10);
                                    if (mjd === date) {
                                        wflag = true;
                                    }
                                    if (wflag && count < 3) {
                                        if (count === 0) {
                                            cityObj.todayWeather = datas;
                                        } else if (count === 1) {
                                            cityObj.nextdayWeather = datas;
                                        } else if (count === 2) {
                                            cityObj.thriddayWeather = datas;
                                        }
                                        count++;
                                    }
                                });
                                cityArr.push(cityObj);
                            }
                        });
                    }
                    for (var z = 0; z < cityNameList.length; z++) {
                        var cityObj = {
                            city: cityNameList[z].nameUl,
                            todayWeather: {},
                            nextdayWeather: {},
                            thriddayWeather: {}
                        };
                        if (cityName === cityNameList[z].config) {
                            continue;
                        }
                        $.each(obj, function (index, entry) {
                            if (cityNameList[z].config === entry.city) {
                                var count = 0;
                                var wflag = false;
                                $.each(entry.weaList, function (index, entry) {
                                    var _mjd = parseInt(tools.getDataFromTime(entry.mjd)[2],10);
                                    if (_mjd === date) {
                                        wflag = true;
                                    }

                                    if (wflag && count < 3) {
                                        if (count === 0) {
                                            cityObj.todayWeather = entry;
                                        } else if (count === 1) {
                                            cityObj.nextdayWeather = entry;
                                        } else if (count === 2) {
                                            cityObj.thriddayWeather = entry;
                                        }
                                        count++;
                                    }
                                });
                                cityArr.push(cityObj);
                            }
                        });
                    }

                    if (gbs.LUANGAGE_CODE_ZH_CN === Config.LANGUAGE_CODE) {
                        var tempCity = cityArr.shift();
                        cityArr.sort(sortBy('city'));
                        cityArr.splice(0, 0, tempCity);
                    }

                }

                sessionStorage.setItem('cacheLange', Config.LANGUAGE_CODE);
                sessionStorage.setItem(gbs.WEATHER_DATA,JSON.stringify(cityArr));
                sessionStorage.setItem(gbs.WEATHER_MD5, dataVersion);
            }
        }

        //中文排序
        function sortBy(order) {
            return function(objA, objB) {
                // 转换为拼音
                var val1 = Pinyin.getFullChars(objA[order]).toLowerCase();
                var val2 = Pinyin.getFullChars(objB[order]).toLowerCase();
                if (val1 === 'zhongqing') {
                    val1 = 'chongqing';
                }
                if (val2 === 'zhongqing') {
                    val2 = 'chongqing';
                }
                // 获取较长的拼音的长度
                var length = val1.length > val2.length ? val1.length : val2.length;
                // 依次比较字母的unicode码，相等时返回0，小于时返回-1，大于时返回1
                for (var i = 0; i < length; i++) {
                    var differ = val1.charCodeAt(i) - val2.charCodeAt(i);
                    if (differ === 0) {
                        continue;
                    } else {
                        if (val1.charAt(i) === '_') {
                            return -1;
                        }
                        return differ;
                    }
                }
                if (i === length) {
                    return val1.length - val2.length;
                }
            };
        }

        return {
            setWeather: function () {
                getWeather();
            }
        };
    });