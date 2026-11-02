# 服务机器人厂商 API 接口文档

> **文档用途**：供 AI 编辑器模拟普渡科技、猎户星空、优地机器人、远鲸科技、擎朗智能等设备接口调用
>
> **数据来源声明**：本文档所有接口参数均来自各厂商官方文档/官方开放平台，未获取到官方资料的厂商已明确标注。
>
> **生成日期**：2026-07-31

---

## 目录

- [1. 普渡科技 (Pudu Technology)](#1-普渡科技-pudu-technology)
  - [1.1 认证与集群](#11-认证与集群)
  - [1.2 通用响应格式](#12-通用响应格式)
  - [1.3 机器人状态查询](#13-机器人状态查询)
  - [1.4 配送与运送任务](#14-配送与运送任务)
  - [1.5 呼叫任务](#15-呼叫任务)
  - [1.6 跑腿任务](#16-跑腿任务)
  - [1.7 顶升与托盘任务](#17-顶升与托盘任务)
  - [1.8 巡航任务](#18-巡航任务)
  - [1.9 一键回充](#19-一键回充)
  - [1.10 地图与交管区](#110-地图与交管区)
  - [1.11 闪电匣（舱门控制）](#111-闪电匣舱门控制)
  - [1.12 统计分析](#112-统计分析)
  - [1.13 广告播放与配置](#113-广告播放与配置)
  - [1.14 货柜任务与货柜 SKU](#114-货柜任务与货柜-sku)
  - [1.15 门店与机器列表](#115-门店与机器列表)
  - [1.16 机器避险](#116-机器避险)
  - [1.17 回调通知](#117-回调通知)
- [2. 猎户星空 (OrionStar)](#2-猎户星空-orionstar)
  - [2.1 认证 - 获取 Access Token](#21-认证---获取-access-token)
  - [2.2 企业信息](#22-企业信息)
  - [2.3 SSO 单点登录](#23-sso-单点登录)
  - [2.4 机器人信息](#24-机器人信息)
  - [2.5 机器人地图信息](#25-机器人地图信息)
  - [2.6 机器人控制指令](#26-机器人控制指令)
  - [2.7 机器人任务](#27-机器人任务)
  - [2.8 机器人使用数据查询](#28-机器人使用数据查询)
- [3. 优地机器人 (Udi Robotics)](#3-优地机器人-udi-robotics)
- [4. 远鲸科技 (Marsmarch)](#4-远鲸科技-marsmarch)
- [5. 擎朗智能 (Keenon Robotics)](#5-擎朗智能-keenon-robotics)
- [附录：各厂商信息汇总](#附录各厂商信息汇总)

---

## 1. 普渡科技 (Pudu Technology)

**官方开放平台**：https://open.pudutech.com
**官方文档语言**：中文 / English
**适用产品**：配送机器人、工业配送机器人、商用清洁机器人

### 1.1 认证与集群

#### 认证凭证

| 凭证 | 环境变量 | 说明 |
|------|----------|------|
| `ApiAppKey` | `PUDU_API_APP_KEY` | API 应用密钥 |
| `ApiAppSecret` | `PUDU_API_APP_SECRET` | API 应用密钥（敏感，不可回显） |

> 凭证获取方式：登录普渡开放平台（分销商/商户平台） -> 绑定并激活机器人 -> 获取 API 凭证 -> 配置 App Key & Secret。

#### 集群配置

| 集群标识 | 区域 | Hostname |
|----------|------|----------|
| `cn` | 中国区 | `open-platform.pudutech.com` |
| `sea` | 海外（日韩新加坡） | `css-open-platform.pudutech.com` |
| `de` | 德国 | `csg-open-platform.pudutech.com` |
| `us` | 美国 | `csu-open-platform.pudutech.com` |

**完整请求 URL 格式**：`https://{hostname}/pudu-entry{path}`

示例：`https://open-platform.pudutech.com/pudu-entry/open-platform-service/v2/status/get_by_sn?sn=robot-001`

### 1.2 通用响应格式

#### 成功响应结构

```json
{
  "data": {
    // 具体业务数据
  },
  "message": "SUCCESS",
  "trace_id": "YourApiAppKey_405eb004-7f09-4d86-bff1-4657cdec2717"
}
```

#### 成功判定规则

| 条件 | 要求 |
|------|------|
| HTTP 状态码 | `200` |
| 返回 `message` 字段 | `=== "SUCCESS"` |

两者必须同时满足。

#### 常见错误码

| HTTP 状态码 | 含义 | 处理建议 |
|-------------|------|----------|
| `401` | 签名验证失败 | 检查 ApiAppKey / ApiAppSecret 是否正确 |
| `403` | 无权限 | 确认接口是否已开通 |
| `404` | 接口路径不存在 | 检查 path 和集群是否匹配 |
| `500` | 服务端错误 | 重试或联系普渡技术支持 |

### 1.3 机器人状态查询

#### 按机器人 SN 查询状态（推荐 v2）

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `GET` |
| 路径 | `/open-platform-service/v2/status/get_by_sn` |

**请求参数**：

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|--------|------|------|------|------|
| `sn` | query | string | 是 | 机器人序列号（不可用 MAC 地址替代） |

#### 按群组 ID 查询状态

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `GET` |
| 路径 | `/open-platform-service/v1/status/get_by_group_id` |

**请求参数**：

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|--------|------|------|------|------|
| `groupId` | query | string | 是 | 机器人群组 ID |

> **注意**：v2 接口字段更简洁，推荐使用。`sn` 为最常用标识字段，MAC 地址（格式如 `14:80:CC:89:27:A6`）不可替代 SN。

### 1.4 配送与运送任务

#### 下发配送任务

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| 路径 | `/open-platform-service/v1/delivery_task` |
| Content-Type | application/json |

#### 下发多点运送任务

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| 路径 | `/open-platform-service/v1/transport_task` |
| Content-Type | application/json |

> 配送与运送任务的完整请求体参数定义存储在官方规范文件 `assets/02-delivery-transport.json` 中。

### 1.5 呼叫任务

#### 自定义呼叫机器人

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| 路径 | `/open-platform-service/v1/custom_call` |
| Content-Type | application/json |

> 完整请求体参数定义存储在官方规范文件 `assets/06-call.json` 中。

### 1.6 跑腿任务

#### 下发跑腿任务

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| 路径 | `/open-platform-service/v1/task_errand` |
| Content-Type | application/json |

> 完整请求体参数定义存储在官方规范文件 `assets/03-errand.json` 中。

### 1.7 顶升与托盘任务

#### 下发顶升任务

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| 路径 | `/open-platform-service/v1/lifting_task` |
| Content-Type | application/json |

> 完整请求体参数定义存储在官方规范文件 `assets/04-lifting-tray.json` 中。

### 1.8 巡航任务

#### 巡航任务下发

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| 路径 | （详见官方规范文件 `assets/05-cruise-guide.json`） |
| Content-Type | application/json |

> 巡航任务包含巡航任务下发、巡航线路查询等功能。

### 1.9 一键回充

#### 一键回充（推荐 v2）

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `GET` |
| 路径 | `/open-platform-service/v2/recharge` |

**请求参数**：

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|--------|------|------|------|------|
| `sn` | query | string | 是 | 机器人序列号 |

### 1.10 地图与交管区

#### 获取门店地图列表

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `GET` |
| 路径 | `/data-open-platform-service/v1/api/maps` |

**请求参数**：

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|--------|------|------|------|------|
| `shop_id` | query | string | 是 | 门店 ID |

#### 查询交管区列表

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| 路径 | `/map-service/v1/open/traffic_control/list` |
| Content-Type | application/json |

> 完整请求体参数定义存储在官方规范文件 `assets/18-map-service.json` 中。地图服务还包含地图详情、点位信息、点位分组等功能。

### 1.11 闪电匣（舱门控制）

#### 查询舱门拍照任务列表

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| 路径 | `/biz-open-service/v1/robotDoor/task_list` |
| Content-Type | application/json |

> **注意**：仅适用于带货柜的机器人型号（闪电匣系列）。完整请求体参数定义存储在官方规范文件 `assets/07-flash-cabinet.json` 中。还包含舱门状态/控制、舱门拍照任务、电梯内切图等功能。

### 1.12 统计分析

#### 查询机器运行简报/概览

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `GET` |
| 路径 | `/data-board/v1/brief/run` |

**请求参数**：

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|--------|------|------|------|------|
| `shopId` | query | string | 是 | 门店 ID |

#### 查询机器运行分析

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `GET` |
| 路径 | `/data-board/v1/analysis/run` |

**请求参数**：

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|--------|------|------|------|------|
| `shopId` | query | string | 是 | 门店 ID |

> 统计分析还包含清洁统计（`assets/10-analysis-clean.json`）、通用统计（`assets/11-analysis-common.json`）、配送统计（`assets/12-analysis-delivery.json`）、行业统计（`assets/13-analysis-industry.json`）等。

### 1.13 广告播放与配置

#### 广告列表查询

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| 路径 | `/biz-service/openPlatform/api/v1/gg/list` |
| Content-Type | application/json |

#### 获取广告详情

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `GET` |
| 路径 | `/biz-service/openPlatform/api/v1/gg/get` |

**请求参数**：

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|--------|------|------|------|------|
| `id` | query | string | 是 | 广告 ID |
| `shop_id` | query | string | 是 | 门店 ID |

#### 创建广告

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| 路径 | `/biz-service/openPlatform/api/v1/gg/create` |
| Content-Type | application/json |

> 完整请求体参数定义存储在官方规范文件 `assets/19-ad.json` 中。还包含广告更新、删除、场景菜单等功能。

### 1.14 货柜任务与货柜 SKU

#### 商品 SKU 同步/更新

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| 路径 | `/community-open-service/api/product_sku/v2/upsert` |
| Content-Type | application/json |

#### 货柜列表查询

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `GET` |
| 路径 | `/community-open-service/api/cabinet/v1/list` |

**请求参数**：

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|--------|------|------|------|------|
| `shop_id` | query | string | 是 | 门店 ID |

#### 货柜配送下单

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| 路径 | `/community-open-service/api/cabinet/send_task` |
| Content-Type | application/json |

> 完整请求体参数定义存储在官方规范文件 `assets/20-cabinet-sku.json` 中。

### 1.15 门店与机器列表

#### 门店列表查询

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `GET` |
| 路径 | （详见官方规范文件 `assets/17-shop-data.json`） |

**响应示例**：

```json
{
  "data": {
    "count": 110,
    "list": [
      {
        "company_id": "13947",
        "company_name": "代理商名称",
        "shop_id": "324100000",
        "shop_name": "门店名称"
      }
    ]
  },
  "message": "SUCCESS",
  "trace_id": "YourApiAppKey_405eb004-7f09-4d86-bff1-4657cdec2717"
}
```

> 完整参数定义存储在官方规范文件 `assets/17-shop-data.json` 中，还包含机器列表查询。

### 1.16 机器避险

#### 发起/解除避险任务

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| 路径 | （详见官方规范文件 `assets/21-risk-avoidance.json`） |

> 包含发起避险任务、解除避险任务（适用于 T300 等型号）。

### 1.17 回调通知

普渡开放平台支持两种交互模式：

| 模式 | 说明 |
|------|------|
| **Open API** | 开发者主动调用 API 向机器人推送任务或获取基础数据 |
| **Callback Notification** | 当机器人任务状态变化或机器人自身状态变化时，平台主动向开发者推送通知 |

**回调接口注意事项**：
1. 集成方在普渡分销商/商户平台填写回调 URL，普渡会返回 `callback_code`
2. 默认不发送告警，需申请并配置后才能接收回调通知
3. 超时时间：5 秒，超时则放弃本次回调，失败会重试（最多 3 次）

### 1.18 普渡功能组完整映射

| # | 功能组 | 规范文件 | 典型场景 |
|---|--------|----------|----------|
| 1 | 机器人状态与信息查询 | `assets/01-robot-status.json` | 查状态、位置、任务状态 |
| 2 | 配送与运送任务 | `assets/02-delivery-transport.json` | 下发配送任务、多点运送 |
| 3 | 跑腿任务 | `assets/03-errand.json` | 跑腿模式任务 |
| 4 | 顶升与托盘任务 | `assets/04-lifting-tray.json` | 顶升机器人任务、托盘订单 |
| 5 | 巡航任务 | `assets/05-cruise-guide.json` | 巡航任务下发、巡航线路查询 |
| 6 | 呼叫任务 | `assets/06-call.json` | 自定义呼叫机器人 |
| 7 | 闪电匣专属功能 | `assets/07-flash-cabinet.json` | 舱门状态/控制、舱门拍照、电梯内切图 |
| 8 | 内容、语音与媒体 | `assets/08-media-content.json` | 屏幕展示、语音播报、音量 |
| 9 | 基础控制与数据上报 | `assets/09-control-reporting.json` | 充电、切换地图、位置上报、交管区 |
| 10 | 清洁统计分析 | `assets/10-analysis-clean.json` | 洗地、扫地等清洁模式图表及分页数据 |
| 11 | 通用统计分析 | `assets/11-analysis-common.json` | 机器概览、门店概览与运行分析 |
| 12 | 配送统计分析 | `assets/12-analysis-delivery.json` | 配送、呼叫、巡航等模式明细与图表 |
| 13 | 行业统计分析 | `assets/13-analysis-industry.json` | 顶升等行业任务的统计明细及图表 |
| 14 | 简报数据 | `assets/14-brief.json` | 门店和机器核心运行大盘数据 |
| 15 | 日志与上报记录 | `assets/15-log.json` | 开机自检、电池充电、故障事件等 |
| 16 | 任务调度与历史 | `assets/16-tasks.json` | 呼叫、配送等任务目的地执行明细 |
| 17 | 门店与基础数据 | `assets/17-shop-data.json` | 门店列表查询、机器列表查询 |
| 18 | 地图服务 | `assets/18-map-service.json` | 地图列表、详情、点位信息、点位分组 |
| 19 | 广告播放与配置 | `assets/19-ad.json` | 广告列表、详情、创建、更新、删除 |
| 20 | 货柜任务与货柜 SKU | `assets/20-cabinet-sku.json` | 商品 SKU 同步、货柜列表、货柜配送 |
| 21 | 机器避险 | `assets/21-risk-avoidance.json` | 发起避险任务、解除避险任务 |

> **说明**：以上 21 个功能组的完整请求体参数定义（字段名、类型、是否必填、描述）存储在普渡官方 SKILL 包的 `assets/*.json` 规范文件中。可通过普渡官方 SKILL 工具自动获取最新接口文档：`npx skills add pudu-robotics/skills.git --skill pudu-openapi-skill`

---

## 2. 猎户星空 (OrionStar)

**官方文档地址**：https://openapi.orionstar.com/opendocs/zh/ （中文）/ https://global-openapi.orionstar.com/opendocs/en/ （English）
**适用产品**：接待服务机器人、递送服务机器人（LuckiBot）、工业配送机器人（CarryBot）、仓库机器人

### 2.1 认证 - 获取 Access Token

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `GET` |
| URL 路径 | `/v1/auth/get_token` |
| 授权方式 | 接口维度默认授权；需 IP 白名单 |

**请求域名**：

| 区域 | 域名 |
|------|------|
| 中国区 | `https://openapi.orionstar.com` |
| 欧洲区 | `https://global-openapi.orionstar.com` |
| 美国区 | `https://us-openapi.orionstar.com` |
| 日本区 | `https://jp-openapi.orionstar.com` |

**请求 URL 参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `appid` | string | 是 | OrionStar 签发的 appid |
| `secret` | string | 是 | OrionStar 签发的 secret |
| `grant_type` | string | 是 | 固定值 `client_credential` |

**请求 cURL 示例**：

```bash
curl --location 'https://openapi.orionstar.com/v1/auth/get_token?appid=test_appid&secret=test_secret&grant_type=client_credential'
```

**响应体**：

| 参数 | 类型 | 说明 |
|------|------|------|
| `code` | int | 错误代码，0 为成功 |
| `msg` | string | 错误描述 |
| `req_id` | string | 日志跟踪 ID |
| `data.access_token` | string | 访问令牌 |
| `data.expire_in` | int | 有效期（秒），通常 7200（2 小时） |

**响应示例**：

```json
{
    "code": 0,
    "msg": "",
    "data": {
        "access_token": "test_access_token",
        "expire_in": 7200
    }
}
```

> **注意**：调用此 API 前，需向 OrionStar 提供调用方服务器的公网 IP 地址，加入白名单后方可调用。secret 仅限服务端保存使用，不可在前端或客户端使用。

### 2.2 企业信息

#### 获取企业列表

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `GET` |
| URL 路径 | `/v1/corp/agency_corp_list` |
| 授权 | 代理商级授权 |

#### 获取企业信息

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `GET` |
| URL 路径 | `/v1/corp/corp_info` |
| 授权 | 代理商级授权 |

### 2.3 SSO 单点登录

#### 企业机器人管理端首页 SSO

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `GET` |
| URL 路径 | `/v1/sso/corp_admin_sso` |
| 说明 | 获取从第三方系统免登录跳转到企业机器人管理端首页的重定向 URL |
| 授权 | 企业级授权 |

#### 企业机器人管理端子页面 SSO

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `GET` |
| URL 路径 | `/v1/sso/corp_admin_page_sso` |
| 说明 | 获取从第三方系统免登录跳转到企业机器人管理端某页面的重定向 URL |
| 授权 | 企业级授权 |

#### 切换企业（sWebApi）

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `GET` |
| URL 路径 | `/v1/sso/init_webapi_access` |
| 说明 | 切换 sWebApi 当前登录企业 |
| 授权 | 企业级授权 |

### 2.4 机器人信息

#### 获取机器人列表

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `GET` |
| URL 路径 | `/v1/robot/robot_list` |
| 授权 | 企业级授权（默认授权） |

**公共请求头**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `Authorization` | string | 是 | 访问凭证，格式：`Bearer access_token` |

**请求 URL 参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `ov_corpid` | string | 是 | 企业 ID，多个用英文逗号分隔 |
| `robot_sn` | string | 否 | 机器人 SN，传入则只返回对应机器人，多个用逗号分隔 |
| `page` | int | 否 | 分页页码，从 1 开始，默认 1 |
| `page_rows` | int | 否 | 每页数据条数，默认 1 |

**请求 cURL 示例**：

```bash
curl --location 'https://openapi.orionstar.com/v1/robot/robot_list?ov_corpid=test_ov_corpid' \
     --header 'Authorization: Bearer YOUR-ACCESS-TOKEN'
```

**响应体 data 对象**：

| 参数 | 类型 | 说明 |
|------|------|------|
| `total_count` | string | 数据总数 |
| `robot_list` | array | 机器人信息列表 |

**robot - 机器人信息对象**：

| 参数 | 类型 | 说明 |
|------|------|------|
| `ov_corpid` | string | 企业 ID |
| `robot_uuid` | string | 机器人 UUID |
| `robot_sn` | string | 机器人 SN |
| `robot_name` | string | 机器人名称 |
| `robot_version` | string | 机器人 ROM 版本号，例如：`V9.7.2024041200.1234US` |
| `robot_model` | string | 机器人型号，例如：`OS-R-DR01S` |
| `bind_time` | string | 最后一次绑定到当前企业的时间，整数时间戳（秒） |
| `expires_time` | string | 租期截止时间，仅租用机器人有效，整数时间戳（秒） |
| `online_status` | string | 在线状态：`0`=不在线，`1`=在线（约 15 秒延迟） |

**响应示例**：

```json
{
    "code": 0,
    "msg": "",
    "data": {
        "total_count": "10",
        "robot_list": [
            {
                "ov_corpid": "orion.ovs.entprise.12345678",
                "robot_uuid": "test_uuid",
                "robot_sn": "test_sn",
                "robot_name": "test_name",
                "robot_version": "V9.7.2024041200.1234US",
                "robot_model": "OS-R-DR01S",
                "bind_time": "1711966681",
                "online_status": "1"
            }
        ]
    }
}
```

#### 获取机器人信息

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `GET` |
| URL 路径 | `/v1/robot/robot_info` |
| 授权 | 企业级授权（默认授权） |

**请求 URL 参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `robot_sn` | string | 是 | 机器人 SN |
| `is_report_status` | int | 否 | 是否获取机器人当前状态信息，默认 `0`。`0`=不获取，`1`=获取 |
| `is_report_task_event` | int | 否 | 是否获取任务事件信息，默认 `0`。`0`=不获取，`1`=获取（仅最近 24 小时） |
| `report_task_type` | string | 否 | 需要获取的任务类型，逗号分隔。仅在 `is_report_task_event=1` 时有效。支持：`meals_deliver_task-deliver`（送餐到桌）、`meals_deliver_task-return`（送餐返程） |

**请求 cURL 示例**：

```bash
curl --location 'https://openapi.orionstar.com/v1/robot/robot_info?robot_sn=test_sn' \
     --header 'Authorization: Bearer YOUR-ACCESS-TOKEN'
```

**响应体 data 对象**：

| 参数 | 类型 | 说明 |
|------|------|------|
| `corp` | object | 企业信息对象 |
| `robot` | object | 机器人信息对象（同上 robot 对象） |
| `robot_report_status` | object | 机器人当前状态信息（仅 `is_report_status=1` 时返回） |
| `robot_task_list` | array | 任务事件信息列表（仅 `is_report_task_event=1` 时返回） |

**corp - 企业信息对象**：

| 参数 | 类型 | 说明 |
|------|------|------|
| `ov_corpid` | string | 企业 ID |
| `corp_name` | string | 企业名称 |
| `create_time` | string | 创建时间，整数时间戳（秒） |
| `update_time` | string | 最后修改时间，整数时间戳（秒） |

**robot_report_status - 机器人当前状态信息**：

| 参数 | 类型 | 说明 |
|------|------|------|
| `battery.battery_rate` | string | 当前电量剩余百分比 |
| `battery.is_charging` | string | 是否充电中：`0`=否，`1`=是 |
| `task_info.task_name` | string | 当前任务名称（如"送餐中"） |
| `task_info.last_task_name` | string | 上一次任务名称（如"等待送餐"） |
| `location.state` | string | 定位状态：`ready`=成功，`get_lost`=失败 |
| `location.pos_name` | string | 当前位置默认语言名称 |
| `location.pos_all_name.zh_CN` | string | 当前位置中文名称 |
| `location.pos_all_name.en_US` | string | 当前位置英文名称 |
| `location.emergency` | string | 是否急停：`0`=否，`1`=是 |

**robot_task - 机器人任务事件信息**：

| 参数 | 类型 | 说明 |
|------|------|------|
| `task_id` | string | 任务 ID |
| `task_type` | string | 任务类型，如 `meals_deliver_task-deliver` |
| `event_type` | string | 最后一次上报的事件类型，如 `te__start`、`te_arrived`、`te__end` |
| `task_time` | string | 任务创建时间，整数时间戳（秒） |
| `start_time` | string | 任务开始时间，整数时间戳（秒） |
| `update_time` | string | 最后上报时间，整数时间戳（秒） |
| `task_data` | object | 任务数据（如 `{"pos_name": "A01"}`） |
| `event_list` | array | 所有事件列表 |
| `event_list[].event_type` | string | 事件类型 |
| `event_list[].first_time` | string | 首次上报时间 |
| `event_list[].last_time` | string | 最后上报时间 |

**常用任务名称**（部分）：

通用：待机、休眠、迎宾、巡逻、导航、引领、接待、前往充电、跳舞、广告、拍照、导游、桌面应用、远程控制、视频通话等

递送服务机器人：休眠、充电中、升级、回程中、等待回程、巡航、迎宾、配送中、等待配送、急停、接客等

#### 修改机器人信息

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| URL 路径 | `/v1/robot/modify_robot` |
| 授权 | 企业级授权（默认授权） |

#### 设置机器人租期

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| URL 路径 | `/v1/robot/set_robot_expires_time` |
| 授权 | 企业级授权（**特殊授权**） |

### 2.5 机器人地图信息

#### 获取企业地图列表

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `GET` |
| URL 路径 | `/v1/corp/map_list` |
| 授权 | 企业级授权（默认授权） |

#### 获取企业地图位置列表

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `GET` |
| URL 路径 | `/v1/corp/map_position_list` |
| 授权 | 企业级授权（默认授权） |

#### 获取机器人地图位置列表

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `GET` |
| URL 路径 | `/v1/robot/map/position_list` |
| 授权 | 企业级授权（默认授权） |

### 2.6 机器人控制指令

> 以下所有控制指令均需企业级授权（默认授权），请求头需携带 `Authorization: Bearer {access_token}`，Content-Type 为 `application/x-www-form-urlencoded`。

#### 导航到指定点位

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| URL 路径 | `/v1/robot/pipe/cmd_navigation` |
| 适用产品 | 接待服务机器人、递送服务机器人、工业配送机器人 |

**请求体参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `robot_sn` | string | 是 | 机器人 SN，多个 SN 用英文逗号分隔 |
| `is_batch` | int | 是 | 常量值 `1` |
| `msg_value` | string | 是 | 导航目的点位名称 |
| `speed` | float | 否 | 导航速度，单位：米/秒 |
| `confirm_timeout` | int | 否 | 机器人端倒计时确认框的倒计时秒数，传 `0` 则不弹出确认框（立即执行导航） |

**请求 cURL 示例**：

```bash
curl --location 'https://openapi.orionstar.com/v1/robot/pipe/cmd_navigation' \
     --header 'Authorization: Bearer YOUR-ACCESS-TOKEN' \
     --header 'Content-Type: application/x-www-form-urlencoded' \
     --data-urlencode 'robot_sn=test_sn' \
     --data-urlencode 'is_batch=1' \
     --data-urlencode 'msg_value=会议室'
```

**响应体 data 对象**：

| 参数 | 类型 | 说明 |
|------|------|------|
| `result_list` | array | 指令下发提交结果信息列表 |
| `result_list[].ret` | string | 提交结果错误代码，`0`=成功 |
| `result_list[].msg` | string | 提交结果错误描述 |
| `result_list[].msg_id` | string | 全局唯一的指令消息 ID |
| `result_list[].robot.robot_sn` | string | 机器人 SN |

**响应示例**：

```json
{
    "code": 0,
    "msg": "",
    "data": {
        "result_list": [
            {
                "ret": "0",
                "msg": "",
                "msg_id": "test_msg_id",
                "robot": {
                    "robot_sn": "test_sn"
                }
            }
        ]
    }
}
```

#### 取消导航

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| URL 路径 | `/v1/robot/pipe/cmd_navigation_stop` |

**请求体参数**：`robot_sn`（string, 必填）、`is_batch`（int, 必填, 常量 1）

#### 执行语音指令

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| URL 路径 | `/v1/robot/pipe/cmd_exec_voice_cmd` |

**请求体参数**：`robot_sn`（string, 必填）、`is_batch`（int, 必填, 常量 1）、`msg_value`（string, 必填, 语音指令内容）

#### 播放 TTS

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| URL 路径 | `/v1/robot/pipe/cmd_play_tts` |
| 适用产品 | 接待服务机器人、递送服务机器人、工业配送机器人 |

**请求体参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `robot_sn` | string | 是 | 机器人 SN，多个用英文逗号分隔 |
| `is_batch` | int | 是 | 常量值 `1` |
| `msg_value` | string | 是 | 需要播放的 TTS 文本内容 |

**请求 cURL 示例**：

```bash
curl --location 'https://openapi.orionstar.com/v1/robot/pipe/cmd_play_tts' \
     --header 'Authorization: Bearer YOUR-ACCESS-TOKEN' \
     --header 'Content-Type: application/x-www-form-urlencoded' \
     --data-urlencode 'robot_sn=test_sn' \
     --data-urlencode 'is_batch=1' \
     --data-urlencode 'msg_value=你好'
```

#### 切换工作模式

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| URL 路径 | `/v1/robot/pipe/cmd_set_task_mode` |
| 适用产品 | 递送服务机器人 |

**请求体参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `robot_sn` | string | 是 | 机器人 SN，多个用英文逗号分隔 |
| `task_mode` | string | 是 | 工作模式，可选值见下表 |

**task_mode 可选值**：

| 值 | 说明 |
|----|------|
| `deliver_meals` | 送餐模式 |
| `attract_customers` | 揽客模式 |
| `give_snacks` | 巡航模式 |
| `guide_seat` | 领位模式 |
| `zcb_plate_back` | 回盘模式 |

**请求 cURL 示例**：

```bash
curl --location 'https://openapi.orionstar.com/v1/robot/pipe/cmd_set_task_mode' \
     --header 'Authorization: Bearer YOUR-ACCESS-TOKEN' \
     --header 'Content-Type: application/x-www-form-urlencoded' \
     --data-urlencode 'robot_sn=test_sn' \
     --data-urlencode 'task_mode=deliver_meals'
```

#### 获取切换工作模式状态

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| URL 路径 | `/v1/robot/pipe/cmd_set_task_mode/status` |
| 说明 | 获取机器人收到切换工作模式指令后的切换状态和结果 |

#### 进入休眠模式

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| URL 路径 | `/v1/robot/pipe/cmd_power_sleep` |

**请求体参数**：`robot_sn`（string, 必填）、`is_batch`（int, 必填, 常量 1）

#### 唤醒

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| URL 路径 | `/v1/robot/pipe/cmd_power_wakeup` |

**请求体参数**：`robot_sn`（string, 必填）、`is_batch`（int, 必填, 常量 1）

#### 重启

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| URL 路径 | `/v1/robot/pipe/cmd_reboot` |

**请求体参数**：`robot_sn`（string, 必填）、`is_batch`（int, 必填, 常量 1）

#### 关机

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| URL 路径 | `/v1/robot/pipe/cmd_poweroff` |

**请求体参数**：`robot_sn`（string, 必填）、`is_batch`（int, 必填, 常量 1）

#### 前往充电

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| URL 路径 | `/v1/robot/pipe/cmd_go_charging` |

**请求体参数**：`robot_sn`（string, 必填）、`is_batch`（int, 必填, 常量 1）

#### 停止充电

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| URL 路径 | `/v1/robot/pipe/cmd_stop_charging` |

**请求体参数**：`robot_sn`（string, 必填）、`is_batch`（int, 必填, 常量 1）

> **说明**：所有控制指令的响应体结构一致，均返回 `result_list` 数组，包含 `ret`、`msg`、`msg_id`、`robot.robot_sn` 字段。

### 2.7 机器人任务

#### 分配 LuckiBot 收盘任务

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| URL 路径 | `/v1/robot/task/exec_zcb_plate_back_table_task` |
| Content-Type | `application/x-www-form-urlencoded` |
| 适用产品 | 递送服务机器人 |

**请求体参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `ov_corpid` | string | 是 | 企业 ID |
| `pos_name` | string | 是 | 任务目的点位名称，多个点位用英文逗号分隔 |
| `lang` | string | 否 | `pos_name` 的语言，默认 `zh_CN`，如 `en_US` |

**请求 cURL 示例**：

```bash
curl --location 'https://openapi.orionstar.com/v1/robot/task/exec_zcb_plate_back_table_task' \
     --header 'Authorization: Bearer YOUR-ACCESS-TOKEN' \
     --header 'Content-Type: application/x-www-form-urlencoded' \
     --data-urlencode 'ov_corpid=test_ov_corpid' \
     --data-urlencode 'pos_name=TableA01'
```

**响应体 data 对象**：

| 参数 | 类型 | 说明 |
|------|------|------|
| `exec_result_list` | array | 任务提交结果信息列表 |
| `exec_result_list[].ret` | string | 提交结果错误代码，`0`=成功 |
| `exec_result_list[].msg` | string | 提交结果错误描述 |
| `exec_result_list[].pos_name` | string | 目的点位名称 |

**响应示例**：

```json
{
    "code": 0,
    "msg": "",
    "data": {
        "exec_result_list": [
            {
                "ret": "0",
                "msg": "",
                "pos_name": "TableA01"
            }
        ]
    }
}
```

> **注意**：已分配的收盘任务，如果同一位置还有未执行的任务，不应重复下发。

#### 分配 LuckiBot 呼叫任务

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| URL 路径 | `/v1/robot/task/exec_zcb_call_position_task` |
| 授权 | 企业级授权（默认授权） |

**请求体参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `ov_corpid` | string | 是 | 企业 ID |
| `pos_name` | string | 是 | 任务目的点位名称，多个用逗号分隔 |
| `lang` | string | 否 | 语言，默认 `zh_CN` |

#### 分配 LuckiBot Pro 自动门呼叫任务

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| URL 路径 | `/v1/robot/task/exec_bxdp_call_position_task` |
| 授权 | 企业级授权（默认授权） |

**请求体参数**：同上（`ov_corpid`、`pos_name`、`lang`）

#### 分配 CarryBot 呼叫任务

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| URL 路径 | `/v1/robot/task/exec_carry_call_position_task` |
| 授权 | 企业级授权（默认授权） |

**请求体参数**：同上（`ov_corpid`、`pos_name`、`lang`）

### 2.8 机器人使用数据查询

#### LuckiBot 使用数据查询

| 项目 | 值 |
|------|-----|
| HTTP 方法 | `POST` |
| URL 路径 | `/proxyopen/dataopen/applet_zcb_item_line` |
| 授权 | 企业级授权（默认授权） |
| 说明 | 查询 LuckiBot 机器人的使用数据 |

### 2.9 猎户星空公共响应体说明

所有接口的响应体均包含以下公共字段：

| 参数 | 类型 | 说明 |
|------|------|------|
| `code` | int | 错误代码，`0` 为成功，非 `0` 为失败 |
| `msg` | string | 错误描述，失败时给出具体描述 |
| `req_id` | string | 日志跟踪 ID，遇到问题时提供给 OrionStar 协助排查 |
| `data` | object | 业务数据对象，详见各接口说明 |

---

## 3. 优地机器人 (Udi Robotics)

> **状态：未找到官方公开 API 文档**

| 项目 | 信息 |
|------|------|
| 公司全称 | 深圳优地科技有限公司（优地机器人(无锡)有限公司） |
| 官方网站 | https://www.uditech.com.cn |
| 成立时间 | 2013-03-13 |
| 产品线 | 优小妹系列（M5/M6/M7/MX）、优小弟系列（B5）、优小哥系列（W3）、优小姑系列（C10/C50/C160 清洁机器人）、优小蜂系列（H2/H5/H6/H8） |
| 企业资质 | 国家级专精特新小巨人企业 |

### 调查结论

经多渠道搜索（官网 https://www.uditech.com.cn 、第三方报道、GitHub 等），**未找到优地科技公开的开放平台或 API 文档**。

- 官网导航仅包含：首页、优地产品、解决方案（文娱/酒店/园区/清洁）、服务支持、商务合作、关于优地
- 无开发者门户、无开放平台入口、无 API 文档链接
- 第三方报道提及"移动底盘产品已开放 API 接口，支持系统集成商二次开发"，但接口文档未公开
- 报道提及"云端调度系统支持数百台机器人协同工作"，但未公开 API 规格

### 建议

如需获取优地科技 API 接口文档，建议：
1. 联系优地科技商务合作：market@uditech.com.cn
2. 致电服务热线：400-0755-126（8:00-24:00）
3. 通过商务合作渠道申请开发者对接权限

---

## 4. 远鲸科技 (Marsmarch)

> **状态：未找到官方公开 API 文档**

| 项目 | 信息 |
|------|------|
| 公司全称 | 北京远鲸科技有限公司 |
| 品牌名称 | Marsmarch / 远鲸 |
| 官方网站 | https://www.marsmarch.cn |
| 成立时间 | 2020-09-09 |
| 产品线 | 鲸小远 H2（双舱配送机器人）、鲸小远 H9（九舱配送机器人） |
| 融资情况 | Pre-A 轮（源码资本）、天使轮（东呈酒店集团） |
| 联系电话 | 400-090-9193 |
| 联系邮箱 | yuanjingkeji@marsmarch.cn |

### 调查结论

经多渠道搜索（官网 https://www.marsmarch.cn 、第三方平台 36kr/百度爱企查/maigoo 等），**未找到远鲸科技公开的开放平台或 API 文档**。

- 官网仅展示产品介绍和合作入口，无开发者门户
- 无开放平台、无 SDK 文档、无 API 规格说明
- 公司成立时间较新（2020 年），产品线相对集中（酒店配送场景），尚未建设公开开发者生态

### 建议

如需获取远鲸科技 API 接口文档，建议：
1. 通过官网商务合作入口联系：https://www.marsmarch.cn/contact/cooperation
2. 致电：400-090-9193
3. 邮件联系：yuanjingkeji@marsmarch.cn

---

## 5. 擎朗智能 (Keenon Robotics)

> **状态：未找到官方公开 API 文档**

| 项目 | 信息 |
|------|------|
| 公司全称 | 上海擎朗智能科技股份有限公司 |
| 官方网站 | https://www.keenon.com |
| 成立时间 | 2010-02-04 |
| 产品线 | 人形机器人（XMAN-R1/XMAN-F1）、商用配送（T3/T8/T9/T10/W3/S100/S300）、商用清洁（C20/C25/C30/C40/C55）、智慧医疗（X101/X202/M101/M104/M2） |
| 企业资质 | 高新技术企业、专精特新小巨人企业、瞪羚企业（2026） |
| 全球出货量 | 据 2025 年 IDC 报告，全球出货量占比持续位居行业第一 |
| 服务热线 | 400-8335-808 |
| 联系邮箱 | pr@keenon.com |

### 调查结论

经多渠道搜索（官网 https://www.keenon.com 、第三方报道、技术社区等），**未找到擎朗智能公开的开放平台或 API 文档**。

- 官网导航仅包含：产品系列、解决方案（餐饮/酒店/医疗）、客户案例、全球新闻、加入擎朗
- 无开发者门户、无开放平台入口、无 API 文档链接
- 第三方报道提及"擎朗智能携手通力电梯集团搭建 API 平台"，但此为擎朗与电梯厂商之间的私有集成 API，非公开开发者文档
- 报道提及"云端管理平台"支持实时监控和管理，但接口文档未公开
- 擎朗目前重点投入人形机器人（XMAN 系列）和 VLA 架构研发，公开信息以产品介绍为主

### 建议

如需获取擎朗智能 API 接口文档，建议：
1. 通过官网联系商务合作
2. 致电服务热线：400-8335-808
3. 邮件联系：pr@keenon.com
4. 擎朗在全国设有 70+ 售后和营销运营中心，可直接对接当地服务团队

---

## 附录：各厂商信息汇总

| 厂商 | 官方 API 文档 | 文档地址 | 认证方式 | 核心能力 |
|------|--------------|----------|----------|----------|
| 普渡科技 (Pudu) | 有 | https://open.pudutech.com | ApiAppKey + ApiAppSecret（签名认证） | 21 个功能组：状态查询、配送/运送/跑腿/顶升/巡航/呼叫任务、回充、地图、闪电匣、统计、广告、货柜、避险 |
| 猎户星空 (OrionStar) | 有 | https://openapi.orionstar.com/opendocs/zh/ | Access Token（Bearer）+ IP 白名单 | 鉴权、企业信息、SSO、机器人信息/地图/控制指令/任务/使用数据 |
| 优地机器人 (Udi) | **无** | - | - | 官网：https://www.uditech.com.cn |
| 远鲸科技 (Marsmarch) | **无** | - | - | 官网：https://www.marsmarch.cn |
| 擎朗智能 (Keenon) | **无** | - | - | 官网：https://www.keenon.com |

### 文档来源说明

- **普渡科技**：API 参数来自普渡官方开放平台（https://open.pudutech.com）及官方 PUDU SKILL 工具文档（https://skill4agent.com/skill/pudu-robotics-skills/pudu-openapi-skill），包含官方 21 个功能组的接口规范文件映射。
- **猎户星空**：API 参数来自猎户星空官方 OpenAPI 文档站（https://openapi.orionstar.com/opendocs/zh/），所有接口路径、请求/响应参数、cURL 示例均与官方文档一致。
- **优地机器人 / 远鲸科技 / 擎朗智能**：经过官网直接访问 + 多轮网络搜索 + 第三方平台核实，均确认无公开 API 文档。如需对接，需通过商务渠道获取。
