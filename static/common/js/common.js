/* 常用工具方法 */
commonUtil = {
    /* 获取当前时间，并格式化输出为：2018-05-18 14:21:46*/
    getNowTime: function (displayWeek) {
        const time = new Date();
        const year = time.getFullYear();//获取年
        const month = time.getMonth() + 1;//或者月
        const date = time.getDate();//或者天
        const hour = time.getHours();//获取小时
        const minu = time.getMinutes();//获取分钟
        const second = time.getSeconds();//或者秒
        let clockData = year + "-";
        if (month < 10) {
            clockData += "0";
        }
        clockData += month + "-";
        if (date < 10) {
            clockData += "0"
        }
        clockData += date + " ";
        if (hour < 10) {
            clockData += "0"
        }
        clockData += hour + ":";
        if (minu < 10) {
            clockData += "0"
        }
        clockData += minu + ":";
        if (second < 10) {
            clockData += "0"
        }
        clockData += second;
        if (displayWeek) {
            const day = time.getDay();
            const weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
            const week = weeks[day];
            clockData += " " + week;
        }
        return clockData;
    },

    //序列化Form
    serializeObject: function (formObj) {
        const jsonObject = {};
        const formArray = formObj.serializeArray();
        $.each(formArray, function () {
            //console.log('formName:' + this.name);
            const formNameArray = this.name.split('.');
            commonUtil.setFormValueToJsonObject(jsonObject, formNameArray, this.value);
        });
        //console.log('jsonObject:' + JSON.stringify(jsonObject));
        return jsonObject;
    },
    setFormValueToJsonObject: function (jsonObject, formNameArray, attrValue) {
        //console.log('-formNameArray:' + formNameArray);
        const formNameArrayLength = formNameArray.length;
        if (formNameArrayLength === 1) {
            const firstFormName = formNameArray[0];
            //console.log('-firstFormName-1:' + firstFormName);
            //console.log('-jsonObject-1:' + JSON.stringify(jsonObject));

            if (jsonObject[firstFormName]) {
                if (!jsonObject[firstFormName].push) {
                    jsonObject[firstFormName] = [jsonObject[firstFormName]];
                }
                jsonObject[firstFormName].push(attrValue || '');
            } else {
                jsonObject[firstFormName] = attrValue || '';
            }
        } else if (formNameArrayLength > 1) {
            const firstFormName = formNameArray[0];
            //console.log('-firstFormName-2:' + firstFormName);
            formNameArray.splice(0, 1);
            //console.log('-jsonObject[firstFormName]-2:' + jsonObject[firstFormName]);
            if (jsonObject[firstFormName] === null || jsonObject[firstFormName] === undefined) {
                jsonObject[firstFormName] = {};
            }
            jsonObject[firstFormName] = commonUtil.setFormValueToJsonObject(jsonObject[firstFormName], formNameArray, attrValue);
        }
        return jsonObject;
    },

    openLoadingLayer: function (secound) {
        layui.use(['layer'], function () {
            const layer = layui.layer;
            if (secound == undefined || secound == null || secound < 0) {
                secound = 10;
            }
            return layer.load(1, {
                time: secound * 1000,
                shade: [0.3, '#000'] //0.1透明度的白色背景
            });
        });
    },

    closeLoadingLayer: function (layerIndex) {
        layui.use(['layer'], function () {
            const layer = layui.layer;
            if (layerIndex == undefined) {
                layer.closeAll('loading');
            } else {
                layer.close(layerIndex);
            }
        });
    },

    //获取dataTableOption
    getTableOption: function (tableId, tableHeight, dataUrl) {
        let dataTableOption = {
            'id': tableId, 'elem': '#' + tableId, 'method': 'post',
            'height': tableHeight, 'skin': 'row', 'even': false,
            escape: true, contentType: 'application/json',
            'url': dataUrl,
            'where': '', 'initSort': '',
            'request': {
                'pageName': 'pageIndex',
                'limitName': 'pageSize'
            },
            'page': true,
            'limits': [10, 20, 50, 100], 'limit': 10, 'cols': [],
            parseData: function (res) {
                return {
                    "code": 0, msg: "",
                    "limit": res.data.pageSize,
                    "count": res.data.pageTotalElements,
                    "data": res.data.pageContent
                }
            },
            'done': function (res, curr, count) {
                //console.log(res.limit);
                //console.log('当前页码:' + curr);
                //console.log('数据总量:' + count);
            }
        };
        return dataTableOption;
    },

    //打开窗口
    openLayer: function (title, url, width, height, endFunction) {
        if (width === undefined || width === null) {
            width = '85%'
        }
        if (height === undefined || height === null) {
            height = '90%'
        }
        layui.use('layer', function () {
            const layer = layui.layer;
            return layer.open({
                type: 2, title: title,
                shadeClose: false, shade: [0.5, '#fff'],
                offset: '5px', fixed: false, maxmin: true,
                scrollbar: false,
                area: [width, height],
                content: url,
                end: endFunction
            });
        });
    },
    openChooseLayer: function (title, url, width, height, callbackFunction) {
        if (width === undefined || width === null) {
            width = '50%'
        }
        if (height === undefined || height === null) {
            height = '90%'
        }
        layui.use('layer', function () {
            const layer = layui.layer;
            return layer.open({
                type: 2, title: title,
                shadeClose: false, shade: [0.5, '#fff'],
                fixed: true, maxmin: false, scrollbar: false,
                skin: 'layui-layer-rim',
                area: [width, height],
                content: url, btn: ['确定'],
                yes: callbackFunction
            });
        });
    },
    closeLayer: function (layerName) {
        layui.use('layer', function () {
            const layer = layui.layer;
            layer.close(layer.getFrameIndex(layerName));
        });
    },
    //获取文件下载地址
    buildFileDownloadPath: function (responseData, pathTag) {
        let fileDownloadPath = ctx + "/ms/file/download/" + pathTag + "?";
        fileDownloadPath += "a=" + responseData['filePath'];
        fileDownloadPath += "&b=" + responseData['clientIP'];
        fileDownloadPath += "&c=" + responseData['time'];
        fileDownloadPath += "&d=" + responseData['token'];
        console.log(fileDownloadPath);
        return fileDownloadPath
    }

};

shortcutUtil = {
    getShortcutList: function () {
        const shortcutListStr = localStorage.getItem("OA_ShortcutList");
        if (shortcutListStr === undefined || shortcutListStr === null) {
            return null;
        } else {
            return JSON.parse(shortcutListStr);
        }
    },
    setShortcutList: function (shortcutList) {
        localStorage.setItem("OA_ShortcutList", JSON.stringify(shortcutList));
    },
    clearShortcutList: function () {
        localStorage.setItem("OA_ShortcutList", null);
    },
    tabUsedCounter: function (id, title, url) {
        let shortcutList = this.getShortcutList();
        if (shortcutList === null) {
            shortcutList = {};
        }
        const findShortcutObj = shortcutList[id];
        if (findShortcutObj === undefined) {
            shortcutList[id] = {};
            shortcutList[id].id = id;
            shortcutList[id].title = title;
            shortcutList[id].url = url;
            shortcutList[id].counter = 1;
        } else {
            findShortcutObj.counter++;
            shortcutList[id] = findShortcutObj;
        }
        this.setShortcutList(shortcutList);
    },
    sortShortcut: function () {
        const shortcutList = this.getShortcutList();
        let shortcutArrays = new Array();
        if (shortcutList === null) {
            return shortcutArrays;
        } else {
            let index = 0;
            $.each(shortcutList, function (idx, obj) {
                let jsonObj = {};
                jsonObj.id = obj.id;
                jsonObj.counter = obj.counter;
                shortcutArrays[index++] = jsonObj;
            });
            //插入排序算法
            const shortcutArraysLength = shortcutArrays.length;
            let preIndex, curObj;
            for (index = 1; index < shortcutArraysLength; index++) {
                preIndex = index - 1;
                curObj = shortcutArrays[index];
                while (preIndex >= 0 && shortcutArrays[preIndex].counter < curObj.counter) {
                    shortcutArrays[preIndex + 1] = shortcutArrays[preIndex];
                    preIndex--;
                }
                shortcutArrays[preIndex + 1] = curObj;
            }
            return shortcutArrays;
        }
    },
    buildId: function (name) {
        return 'shortcut_' + name;
    },
    getCheckedFullCodeList: function () {
        let checkedFullCodeList = [];
        const shortcutArrays = shortcutUtil.sortShortcut();
        for (let i = 0; i < shortcutArrays.length; i++) {
            checkedFullCodeList.push(shortcutArrays[i].id.replace('shortcut_', ''));
        }
        return checkedFullCodeList;
    }
};