/**
 * 人体传感器-公共区域人流密度 演示页
 * 零依赖纯静态实现：
 *  - 绘制逻辑复用自 crowdDensity/js/radar.js（网格/光晕/波纹/感应区/人员点/轨迹）
 *  - 模拟引擎：人数从 0 逐个累加至上限后清零循环，人员点缓步游走并留轨迹
 */
(function () {
    'use strict';

    // ===== 接入参数（与原页面保持一致）=====
    var MAX_RANGE = 3000;        // 雷达坐标范围 ±3000mm
    var TRACK_MAX = 20;          // 每个目标最多保留的轨迹点数
    var TRACK_COLORS = ['#2CE089', '#FF7B15', '#6C9FD9', '#EC4158', '#FFD54F', '#A77BFF', '#4DD0E1', '#FF8A80'];

    // ===== 模拟参数 =====
    var MAX_PEOPLE = 20;         // 人数上限（对应“拥挤”阈值）
    var HOLD_MS = 3000;          // 达到上限后停留时长
    var ADD_MIN_MS = 1500;       // 新增 1 人的最短间隔
    var ADD_MAX_MS = 2500;       // 新增 1 人的最长间隔

    // ===== 画布与坐标 =====
    var canvas, ctx, canvasW, canvasH;
    var centerX, centerY, scaleX, scaleY;

    var zoneList = [];           // 感应区/屏蔽区
    var people = [];             // 实时人员目标
    var iconImages = {};         // 密度等级小图标
    var trackMap = {};           // 人员历史轨迹 { id: [{x,y}, ...] }
    var trackColor = {};         // id → 轨迹颜色

    var pulsePhase = 0;          // 向外扩散波纹相位（0~1）
    var frameCount = 0;          // 帧计数（用于轨迹采样）

    // 雷达物理坐标(x,y mm) → canvas 像素坐标（Y 轴翻转）
    function radarToCanvas(rx, ry) {
        return { px: centerX + rx * scaleX, py: centerY - ry * scaleY };
    }

    // ========== 密度等级配置 ==========
    function getLevel(count) {
        if (count >= 20) return { key: 'lot', name: '拥挤', color: '#EC4158' };
        if (count >= 10) return { key: 'more', name: '较多', color: '#FF7B15' };
        if (count >= 5) return { key: 'few', name: '适中', color: '#6C9FD9' };
        return { key: 'little', name: '较少', color: '#A0C789' };
    }

    // 预加载密度等级小图标
    function preloadIcons() {
        ['few', 'little', 'more', 'lot'].forEach(function (k) {
            var img = new Image();
            img.onload = function () { renderScene(); };
            img.src = 'images/' + k + 'Icon.png';
            iconImages[k] = img;
        });
    }

    // 更新右侧密度面板
    function updateLevelUI(count) {
        var level = getLevel(count);
        var $ = function (sel) { return document.querySelector(sel); };
        $('.levelImage').style.backgroundImage = 'url(images/' + level.key + '.png)';
        var t = $('.levelText');
        t.textContent = level.name;
        t.style.color = level.color;
        $('.Peoplecount').textContent = '当前人数: ' + count;
    }

    // ========== 绘制 ==========
    function renderScene() {
        ctx.clearRect(0, 0, canvasW, canvasH);
        drawGrid();
        drawRadarGlow();
        drawPulse();
        drawZones();
        drawTargets();
    }

    function renderAll() {
        renderScene();
        updateLevelUI(people.length);
    }

    // 雷达扫描光晕：中心颜色最深，向边缘逐渐变淡
    function drawRadarGlow() {
        var radius = Math.sqrt(centerX * centerX + centerY * centerY);
        var grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        grad.addColorStop(0, 'rgba(57,255,20,0.18)');
        grad.addColorStop(0.5, 'rgba(57,255,20,0.06)');
        grad.addColorStop(1, 'rgba(57,255,20,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(120,255,70,0.6)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    // 科技雷达扫描波纹：一圈圈向外扩散
    function drawPulse() {
        var radius = Math.sqrt(centerX * centerX + centerY * centerY);
        var waves = 2;
        for (var i = 0; i < waves; i++) {
            var p = (pulsePhase + i / waves) % 1;
            var r = p * radius;
            var fade = 1 - p;
            var alpha = fade * fade;

            ctx.strokeStyle = 'rgba(57,255,20,' + (alpha * 0.16) + ')';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
            ctx.stroke();

            ctx.strokeStyle = 'rgba(44,224,137,' + (alpha * 0.6) + ')';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    // 绘制网格、坐标轴（±3000mm，500mm 刻度）
    function drawGrid() {
        ctx.strokeStyle = 'rgba(221,193,161,0.2)';
        ctx.fillStyle = '#DDC1A1';
        ctx.lineWidth = 1;
        ctx.font = '12px Arial';
        var step = 500;

        for (var y = -MAX_RANGE; y <= MAX_RANGE; y += step) {
            var py = radarToCanvas(0, y).py;
            ctx.beginPath();
            ctx.moveTo(0, py);
            ctx.lineTo(canvasW, py);
            ctx.stroke();
            ctx.fillText(y + '', centerX + 5, py + 4);
        }
        for (var x = -MAX_RANGE; x <= MAX_RANGE; x += step) {
            var px = radarToCanvas(x, 0).px;
            ctx.beginPath();
            ctx.moveTo(px, 0);
            ctx.lineTo(px, canvasH);
            ctx.stroke();
            ctx.fillText(x + '', px + 2, centerY + 15);
        }

        // 中心坐标轴
        ctx.strokeStyle = 'rgba(221,193,161,0.5)';
        var o = radarToCanvas(0, 0);
        ctx.beginPath();
        ctx.moveTo(0, o.py);
        ctx.lineTo(canvasW, o.py);
        ctx.moveTo(o.px, 0);
        ctx.lineTo(o.px, canvasH);
        ctx.stroke();

        ctx.fillStyle = '#DDC1A1';
        ctx.font = '12px Arial';
        ctx.fillText('MM', canvasW - 30, centerY - 8);
        ctx.fillText('MM', centerX - 30, 14);
    }

    // 绘制感应区/屏蔽区矩形
    function drawZones() {
        if (zoneList.length === 0) return;
        zoneList.forEach(function (zone) {
            var pMin = radarToCanvas(zone.x_min, zone.y_min);
            var pMax = radarToCanvas(zone.x_max, zone.y_max);
            var rectX = Math.min(pMin.px, pMax.px);
            var rectY = Math.min(pMin.py, pMax.py);
            var rectW = Math.abs(pMax.px - pMin.px);
            var rectH = Math.abs(pMax.py - pMin.py);

            if (zone.type === 'mask') {
                ctx.fillStyle = 'rgba(220,100,100,0.25)';
                ctx.strokeStyle = '#dc3545';
            } else {
                ctx.fillStyle = 'rgba(120,220,120,0.25)';
                ctx.strokeStyle = '#28a745';
            }
            ctx.lineWidth = 2;
            ctx.fillRect(rectX, rectY, rectW, rectH);
            ctx.strokeRect(rectX, rectY, rectW, rectH);

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px Arial';
            ctx.fillText(zone.zone_id, rectX + 6, rectY + 16);
        });
    }

    // 绘制人员轨迹 + 人员目标点
    function drawTargets() {
        // 先绘制轨迹线（位于下层）
        ctx.lineWidth = 1.5;
        Object.keys(trackMap).forEach(function (id) {
            var pts = trackMap[id];
            if (pts.length < 2) return;
            ctx.strokeStyle = trackColor[id] || '#2CE089';
            ctx.beginPath();
            pts.forEach(function (p, i) {
                var c = radarToCanvas(p.x, p.y);
                if (i === 0) ctx.moveTo(c.px, c.py);
                else ctx.lineTo(c.px, c.py);
            });
            ctx.stroke();
        });

        var level = getLevel(people.length);
        var icon = iconImages[level.key];
        people.forEach(function (t) {
            var pos = radarToCanvas(t.x, t.y);
            if (icon && icon.complete && icon.naturalWidth > 0) {
                ctx.drawImage(icon, pos.px - icon.naturalWidth / 2, pos.py - icon.naturalHeight / 2);
            } else {
                ctx.beginPath();
                ctx.arc(pos.px, pos.py, 7, 0, Math.PI * 2);
                ctx.fillStyle = '#ff5555';
                ctx.fill();
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        });
    }

    // ========== 模拟引擎 ==========
    var simTimer = null;
    var resetTimer = null;
    var nextId = 1;

    function randomSpeed() {
        // 每秒约 60~220mm 的缓步移动
        return 60 + Math.random() * 160;
    }

    // 新增 1 人
    function spawnPerson() {
        if (people.length >= MAX_PEOPLE) return;

        // 在 ±2800mm 范围内随机出生
        var x = (Math.random() * 2 - 1) * 2800;
        var y = (Math.random() * 2 - 1) * 2800;
        var angle = Math.random() * Math.PI * 2;
        var speed = randomSpeed();

        var id = 'T' + (nextId++);
        people.push({
            target_id: id,
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed
        });
        trackMap[id] = [{ x: x, y: y }];
        trackColor[id] = TRACK_COLORS[Object.keys(trackColor).length % TRACK_COLORS.length];

        renderAll();
    }

    // 更新所有人员位置（按 dt 秒）
    function updatePeople(dt) {
        var limit = 2800;
        people.forEach(function (p) {
            p.x += p.vx * dt;
            p.y += p.vy * dt;

            // 边界反弹，并加入轻微随机转向，使运动更自然
            if (p.x > limit) { p.x = limit; p.vx = -Math.abs(p.vx); }
            if (p.x < -limit) { p.x = -limit; p.vx = Math.abs(p.vx); }
            if (p.y > limit) { p.y = limit; p.vy = -Math.abs(p.vy); }
            if (p.y < -limit) { p.y = -limit; p.vy = Math.abs(p.vy); }

            if (Math.random() < 0.02) {
                var a = Math.atan2(p.vy, p.vx) + (Math.random() - 0.5) * 0.6;
                var s = randomSpeed();
                p.vx = Math.cos(a) * s;
                p.vy = Math.sin(a) * s;
            }
        });
    }

    // 轨迹采样（每 4 帧记录一次）
    function sampleTracks() {
        if (frameCount % 4 !== 0) return;
        people.forEach(function (p) {
            var arr = trackMap[p.target_id];
            if (!arr) return;
            arr.push({ x: p.x, y: p.y });
            if (arr.length > TRACK_MAX) arr.shift();
        });
    }

    // 清空并重新开始
    function resetSim() {
        people = [];
        trackMap = {};
        trackColor = {};
        nextId = 1;
        renderAll();
        scheduleNextAdd();
    }

    // 达到上限后停留，再重置
    function holdThenReset() {
        clearTimeout(simTimer);
        clearTimeout(resetTimer);
        resetTimer = setTimeout(resetSim, HOLD_MS);
    }

    // 调度下一次新增
    function scheduleNextAdd() {
        clearTimeout(simTimer);
        if (people.length >= MAX_PEOPLE) {
            holdThenReset();
            return;
        }
        var delay = ADD_MIN_MS + Math.random() * (ADD_MAX_MS - ADD_MIN_MS);
        simTimer = setTimeout(function () {
            spawnPerson();
            scheduleNextAdd();
        }, delay);
    }

    // ========== 主循环 ==========
    var lastTs = 0;
    function loop(ts) {
        var dt = lastTs ? (ts - lastTs) / 1000 : 0;
        lastTs = ts;
        if (dt > 0.1) dt = 0.1; // 避免切后台后跳变

        frameCount++;
        pulsePhase += 0.003;
        if (pulsePhase >= 1) pulsePhase -= 1;

        updatePeople(dt);
        sampleTracks();
        renderScene();

        requestAnimationFrame(loop);
    }

    // ========== 菜单（固定首栏目高亮）==========
    function initMenu() {
        var items = document.querySelectorAll('.menuItem');
        // 首栏目（餐厅）默认聚焦高亮
        if (items.length > 0) {
            items[0].style.backgroundImage = "url('images/restaurantFocus.png')";
            items[0].classList.add('active');
        }
        // 无后端素材，右侧介绍图保持空白
        document.querySelector('.introduceImg').style.backgroundImage = 'none';
    }

    // ========== 自适应缩放 ==========
    function resize() {
        var s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
        var offsetX = (window.innerWidth - 1920 * s) / 2;
        var offsetY = (window.innerHeight - 1080 * s) / 2;
        document.body.style.transform =
            'translate(' + offsetX + 'px,' + offsetY + 'px) scale(' + s + ')';
    }

    // ========== 初始化 ==========
    function init() {
        canvas = document.getElementById('radarCanvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        canvasW = canvas.width;
        canvasH = canvas.height;
        centerX = canvasW / 2;
        centerY = canvasH / 2;
        scaleX = canvasW / (MAX_RANGE * 2);
        scaleY = canvasH / (MAX_RANGE * 2);

        // 模拟感应区（绿色）
        zoneList = [
            { zone_id: 'Z1', type: 'sensing', x_min: -2600, y_min: -1600, x_max: -400, y_max: 1600 },
            { zone_id: 'Z2', type: 'sensing', x_min: 600, y_min: -1800, x_max: 2600, y_max: 1200 }
        ];

        initMenu();
        preloadIcons();
        renderAll();
        resize();
        window.addEventListener('resize', resize);

        requestAnimationFrame(loop);
        scheduleNextAdd();
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
