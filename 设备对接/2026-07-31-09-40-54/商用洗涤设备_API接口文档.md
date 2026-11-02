# 商用洗涤设备 API 接口文档

> **文档用途**：供 AI 编辑器模拟海尔商用智洗、美的 U 净、三星商用洗烘等设备接口调用，重点用于获取设备运行状态
>
> **数据来源声明**：本文档所有接口参数均来自各厂商官方文档/官方开放平台。未获取到官方公开 API 文档的部分已明确标注。
>
> **生成日期**：2026-07-31

---

## 目录

- [1. 海尔商用智洗 (Haier)](#1-海尔商用智洗-haier)
  - [1.1 平台概述](#11-平台概述)
  - [1.2 认证](#12-认证)
  - [1.3 通过序列号获取设备信息 (V1)](#13-通过序列号获取设备信息-v1)
  - [1.4 通过序列号获取客户设备详情 (V2)](#14-通过序列号获取客户设备详情-v2)
  - [1.5 获取会员设备详情](#15-获取会员设备详情)
  - [1.6 获取工单详情 (V2)](#16-获取工单详情-v2)
  - [1.7 海尔 U+ 智家开放平台（需注册）](#17-海尔-u-智家开放平台需注册)
- [2. 美的 U 净 (Midea)](#2-美的-u-净-midea)
  - [2.1 平台概述](#21-平台概述)
  - [2.2 认证 — 获取授权页](#22-认证--获取授权页)
  - [2.3 认证 — 获取授权二维码](#23-认证--获取授权二维码)
  - [2.4 认证 — 获取令牌 (AccessToken)](#24-认证--获取令牌-accesstoken)
  - [2.5 用户绑定](#25-用户绑定)
  - [2.6 获取用户基本信息](#26-获取用户基本信息)
  - [2.7 获取设备列表](#27-获取设备列表)
  - [2.8 获取设备信息](#28-获取设备信息)
  - [2.9 属性查询（单个设备）](#29-属性查询单个设备)
  - [2.10 属性批量查询](#210-属性批量查询)
  - [2.11 全属性查询](#211-全属性查询)
  - [2.12 属性设置](#212-属性设置)
  - [2.13 操作(Action)调用](#213-操作action调用)
  - [2.14 设备订阅与消息通知](#214-设备订阅与消息通知)
  - [2.15 获取物模型实例](#215-获取物模型实例)
  - [2.16 签名规则](#216-签名规则)
  - [2.17 通用错误码](#217-通用错误码)
  - [2.18 U 净专用平台说明](#218-u-净专用平台说明)
- [3. 三星商用洗烘 (Samsung)](#3-三星商用洗烘-samsung)
  - [3.1 平台概述](#31-平台概述)
  - [3.2 认证 — OAuth 2.0](#32-认证--oauth-20)
  - [3.3 列出设备 (List Devices)](#33-列出设备-list-devices)
  - [3.4 获取单个设备描述 (Get Device)](#34-获取单个设备描述-get-device)
  - [3.5 获取设备完整状态 (Get Device Full Status)](#35-获取设备完整状态-get-device-full-status)
  - [3.6 获取 Capability 状态](#36-获取-capability-状态)
  - [3.7 执行设备命令 (Execute Commands)](#37-执行设备命令-execute-commands)
  - [3.8 洗衣机/烘干机相关 Capability](#38-洗衣机烘干机相关-capability)
  - [3.9 获取位置列表](#39-获取位置列表)
  - [3.10 获取房间列表](#310-获取房间列表)
  - [3.11 订阅设备事件](#311-订阅设备事件)

---

## 1. 海尔商用智洗 (Haier)

### 1.1 平台概述

海尔商用智洗涉及两个官方开放平台：

| 平台 | 域名 | 用途 | API 文档状态 |
|------|------|------|-------------|
| **易售后开放平台** | `api.eshouhou.cn` | 设备信息查询、工单管理、客户设备详情 | 公开文档 ✅ |
| **海尔 U+ 智家开放平台（海极网）** | `www.haigeek.com` | 设备控制、状态推送、设备管理 | 需注册后获取 ❌ |

- **易售后平台**：海尔售后服务平台，提供设备序列号查询、设备详情、工单管理等 REST API，文档完全公开。
- **海极网**：海尔智家 IoT 开放平台，提供云云对接（设备管理企业版 + 数据推送）和网关对接方案，支持设备状态查询、设备控制、故障报警推送。**API 文档需在注册开发者并创建云应用后下载，未对外公开。**

> **来源**：`https://eshouhou.cn/support/openapi/` （易售后开放平台官方文档）
> **来源**：`https://www.haigeek.com/web/pages/_B9E7S6IDL6S0A.html` （海极网系统集成商解决方案页）

---

### 1.2 认证

易售后平台使用 `access_token` 进行鉴权，token 通过平台后台获取（OAuth 流程）。

所有请求在 URL query 参数中携带 `access_token`：

```
?access_token={your_access_token}
```

---

### 1.3 通过序列号获取设备信息 (V1)

根据设备序列号获取设备基本信息。

| 项目 | 值 |
|------|-----|
| **HTTP 方法** | `GET` |
| **请求地址** | `https://api.eshouhou.cn/api/CustomerService/GetMemberProductBySN` |
| **来源** | eshouhou.cn/support/openapi/11 |

**请求参数 (Query)：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| access_token | string | 是 | 访问令牌 |
| memberId | string | 是 | 会员 ID |
| serialNumber | string | 是 | 设备序列号 |
| id | string | 否 | 登记设备 ID |

**响应参数：**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| ResultCode | string | 返回编码，0 表示成功 |
| ErrorMsg | string | 返回信息 |
| ResultValue | object | 返回对象 |

**ResultValue 对象：**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| ID | string | 客户设备 ID |
| CustomerID | string | 客户 ID |
| CustomerName | string | 客户名称 |
| ProductID | string | 产品 ID |
| ProductName | string | 产品名称 |
| ProductType | string | 产品型号 |
| SerialNumber | string | 序列号 |
| CategoryID | string | 产品分类 ID |
| CategoryName | string | 产品分类名称 |
| Area | string | 所属区域，格式"北京市-北京市-朝阳区" |
| InstallationAddress | string | 安装详细地址 |

**请求示例：**

```
GET https://api.eshouhou.cn/api/CustomerService/GetMemberProductBySN?access_token={token}&memberId=275c5f12-36c2-4df0-9874-de65df8d86d1&serialNumber=1f2e46bc-e5d6-4a19-b492-2bb441a26574
```

**响应示例：**

```json
{
  "ResultCode": 0,
  "ErrorMsg": "恭喜，已找到该产品信息！",
  "ResultValue": {
    "ID": "252f3f41-5e11-4029-9b32-7b8b23e5a4fa",
    "CustomerID": "",
    "CustomerName": "",
    "ProductID": "69",
    "ProductName": "海尔洗衣机",
    "ProductType": "HR_2020",
    "SerialNumber": "123456",
    "CategoryID": "1",
    "CategoryName": "[示例]家电",
    "Area": "",
    "InstallationAddress": ""
  }
}
```

---

### 1.4 通过序列号获取客户设备详情 (V2)

V2 版本接口，返回更丰富的设备详情（含在保状态、联系人、地理坐标等）。

| 项目 | 值 |
|------|-----|
| **HTTP 方法** | `GET` |
| **请求地址** | `https://api.eshouhou.cn/open/v2/Client/GetCustomerProductBySN` |
| **来源** | eshouhou.cn/support/openapi/81 |

**请求参数 (Query)：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| access_token | string | 是 | 访问令牌 |
| serialNumber | string | 否 | 序列号 |

**响应 — ResultValue 对象：**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| ID | string | 设备 ID |
| CustomerID | string | 客户 ID |
| CustomerName | string | 客户名称 |
| ProductID | string | 产品 ID |
| ProductName | string | 产品名称 |
| ProductType | string | 产品型号 |
| SerialNumber | string | 序列号 |
| GuaranteedState | string | 在保状态：`0`默认, `1`保内(In), `2`保外(Out) |
| CategoryID | string | 产品类别 ID |
| ProjectID | string | 项目 ID |
| ProjectName | string | 项目名称 |
| ContactID | string | 联系人 ID |
| Contact | string | 联系人 |
| Telephone | string | 联系电话 |
| Area | string | 所属区域 |
| Address | string | 详细地址 |
| Longitude | string | 经度 |
| Latitude | string | 纬度 |

**请求示例：**

```
GET https://api.eshouhou.cn/open/v2/Client/GetCustomerProductBySN?access_token={token}&serialNumber=777777
```

**响应示例：**

```json
{
  "ResultCode": 0,
  "ErrorMsg": "",
  "ResultValue": {
    "ID": "5570bd1e-6b43-4225-9973-321690a1c2d7",
    "CustomerID": "8125e4ba-9f17-4d15-8f1b-d6b14e9e4952",
    "CustomerName": "短信微信小程序",
    "ProductID": "69",
    "ProductName": "海尔洗衣机",
    "ProductType": "HR_2020",
    "SerialNumber": "777777",
    "GuaranteedState": "In",
    "CategoryID": "1",
    "ContactID": "e3e2940a-b511-420c-be2c-c28aa8853175",
    "Contact": "微信小程序",
    "Telephone": "15136011075",
    "Area": "",
    "Address": "Kalimantan Timur-Kutai Kartanegara",
    "Longitude": 116.532970,
    "Latitude": -0.280240
  }
}
```

---

### 1.5 获取会员设备详情

根据产品 ID 或设备 ID 获取设备详情（含质保、审核状态等）。

| 项目 | 值 |
|------|-----|
| **HTTP 方法** | `GET` |
| **请求地址** | `https://api.eshouhou.cn/api/CustomerService/GetMemberProductDetail` |
| **来源** | eshouhou.cn/support/openapi/10 |

**请求参数 (Query)：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| access_token | string | 是 | 访问令牌 |
| productId | string | 条件必填 | 登记的产品 ID（与 customerProductId 至少一个不能为空） |
| customerProductId | string | 条件必填 | 审核后的设备 ID（与 productId 至少一个不能为空） |

**响应 — ResultValue 对象：**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| ID | string | 登记 ID（当前会员登记的 ID） |
| CustomerProductID | string | 客户设备 ID（审核通过后存在） |
| ProductID | string | 产品 ID |
| ProductName | string | 产品名称 |
| ProductCategoryID | string | 产品分类 ID |
| ProductCategoryName | string | 产品分类名称 |
| SerialNumber | string | 序列号 |
| ProductImgUrl | string | 产品图片 URL |
| AuditResult | string | 审核状态：`0`默认, `1`审核中, `2`审核通过, `3`审核失败 |
| WarrantyEnd | string | 质保结束时间 |
| WarrantyDay | string | 质保剩余天数 |
| BrandName | string | 品牌名称 |
| ProductType | string | 产品类型 |
| Area | string | 所属区域 |
| InstallationAddress | string | 安装地址 |
| PurchaseDate | string | 购买日期 |
| InstallationDate | string | 安装日期 |
| InvoiceImgPaths | array | 购买凭证图片路径数组 |

**请求示例：**

```
GET https://api.eshouhou.cn/api/CustomerService/GetMemberProductDetail?access_token={token}&customerProductId=5570bd1e-6b43-4225-9973-321690a1c2d7
```

**响应示例：**

```json
{
  "ResultCode": 0,
  "ErrorMsg": "",
  "ResultValue": {
    "ID": "",
    "CustomerProductID": "5570bd1e-6b43-4225-9973-321690a1c2d7",
    "SerialNumber": "777777",
    "PurchaseDate": "2020-04-03",
    "InstallationDate": "2020-04-11",
    "AuditResult": 2,
    "WarrantyEnd": "2020-05-31",
    "WarrantyDay": 25,
    "BrandName": "[示例]品牌",
    "ProductName": "海尔洗衣机",
    "ProductType": "HR_2020",
    "ProductImgUrl": "",
    "InvoiceImgPaths": [
      "https://esh-resources-test.oss-cn-beijing.aliyuncs.com/customerproduct/3ca69fe6.png"
    ]
  }
}
```

---

### 1.6 获取工单详情 (V2)

获取售后工单详情（可用于关联设备的维修/保养状态）。

| 项目 | 值 |
|------|-----|
| **HTTP 方法** | `GET` |
| **请求地址** | `https://api.eshouhou.cn/open/v2/WorkOrder/GetWorkOrder` |
| **来源** | eshouhou.cn/support/openapi/147 |

**请求参数 (Query)：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| access_token | string | 是 | 访问令牌 |
| workOrderId | string | 是 | 工单 ID |

> 易售后开放平台还提供以下工单管理接口：获取工单列表、获取工单类型、获取创建工单字段、创建工单、获取编辑工单字段、编辑工单、获取工单处理过程、获取收费清单信息、获取客户评价信息。详见 `eshouhou.cn/support/openapi` 文档站。

---

### 1.7 海尔 U+ 智家开放平台（需注册）

海极网 (haigeek.com) 是海尔智家的 IoT 开放平台，提供设备控制与状态管理能力。

**对接方案：**

| 方案 | 适用场景 | 核心能力 |
|------|----------|----------|
| **云云对接** | 集采商、电商平台等有自建平台的合作伙伴 | 第三方账号登录 + 设备管理(企业版) + 数据推送 |
| **网关对接** | 地地商、设备租赁商等有自有设备的合作伙伴 | 账号服务 + IoT SDK |

**设备状态相关能力：**
- 实时获取设备运行状态（在线/离线/属性值）
- 故障报警推送
- 设备控制（启动/停止洗涤等）
- 设备功能模型下载（含洗衣机品类）

**接入流程：**
1. 在海极网 (haigeek.com) 注册开发者账号（1-3 个工作日审核）
2. 创建云应用，获取应用标识参数
3. 选择开通服务：设备管理(企业版)、数据推送
4. 按引导下载 API 开发文档和设备功能模型
5. 开发部署云应用

> ⚠️ **API 文档不对外公开**：具体 REST API 端点、请求参数、响应格式需在注册开发者并创建云应用后，通过平台引导下载。未注册前无法获取具体接口参数。
>
> **技术支持**：U+ 开发者技术讨论 QQ 群：457841032

**已知请求头格式（来自 npm 包 haigeek-axios）：**

| 头名称 | 说明 |
|--------|------|
| `hgAppId` | 云应用 ID（如 `MB-IYD10511011511-0000`） |
| `hgAppKey` | 云应用密钥 |
| `hgUrlPrefix` | 请求域名前缀（生产环境 `https://ys-openservice.haigeek.com`） |
| `hgEncryptLevel` | 加密级别，默认 `0` |
| `hgSuccessCodeKey` | 成功码字段名，默认 `retCode` |
| `hgSuccessCode` | 成功码值，默认 `00000` |
| `hgErrorMsgKey` | 错误信息字段名，默认 `retInfo` |

---

## 2. 美的 U 净 (Midea)

### 2.1 平台概述

美的提供两个层面的 API 接口：

| 平台 | 域名 | 用途 | API 文档状态 |
|------|------|------|-------------|
| **美的 IoT 开发者平台 (V3)** | `api-prod.smartmidea.net` | 设备管理、设备状态查询/控制、消息推送 | 公开文档 ✅ |
| **U 净专用平台** | `phoenix.ujing.online` | U 净商用洗衣机专用接口 | 非官方文档 ⚠️ |

**美的 IoT 开发者平台**提供完整的 OAuth 2.0 云云对接 API（V3），共 33 个接口，涵盖授权、用户、设备配网、设备控制、设备通知、场景、视频等模块。通过物模型属性查询接口可获取设备实时运行状态。

> **来源**：`https://iot.midea.com/docs/control-midea-cloud-devices/cloud-2-cloud-v3-api.html`

---

### 2.2 认证 — 获取授权页

通过 OAuth 2.0 授权码模式获取用户授权。

| 项目 | 值 |
|------|-----|
| **HTTP 方法** | `GET` |
| **路径** | `/v3/open/oauth2/authorize` |
| **参数格式** | query |
| **域名** | `https://api-prod.smartmidea.net` |

**请求参数：**

| 参数名 | 必选 | 类型 | 说明 |
|--------|------|------|------|
| client_id | true | String | 唯一的第三方开发者 ID |
| state | true | String | 请求授权方的校验字段，授权服务透传原值返回 |
| response_type | true | String | 授权类型，`code` - 授权码方式 |
| redirect_uri | true | String | 重定向 URI，需与应用创建时回调 URL 保持一致 |

**返回：** 返回登录页面，用户输入用户名密码后重定向 `redirect_uri?code={code}&state={state}`

---

### 2.3 认证 — 获取授权二维码

用于大屏等设备上的扫码授权。

| 项目 | 值 |
|------|-----|
| **HTTP 方法** | `POST` |
| **路径** | `/v3/open/user/qrcode/get` |
| **参数格式** | body |

**请求参数：**

| 参数名 | 必选 | 类型 | 说明 |
|--------|------|------|------|
| clientId | true | String | 唯一的第三方开发者 ID |
| reqId | true | String | 请求 ID（32位，数字+字母） |
| uuid | true | String | 第三方开放用户唯一标识，AES/CBC/PKCS5Padding 加密 |
| responseType | true | String | 授权类型，固定传 `code` |
| state | false | String | 请求授权方的校验字段 |
| redirectUri | true | String | 授权码回调给第三方的地址 |

**响应字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| qrcode | String | 二维码信息 |
| reqId | String | 请求 ID |

---

### 2.4 认证 — 获取令牌 (AccessToken)

获取或刷新访问令牌。

| 项目 | 值 |
|------|-----|
| **HTTP 方法** | `POST` |
| **路径** | `/v3/open/oauth2/token` |
| **参数格式** | body |

**请求参数：**

| 参数名 | 必选 | 类型 | 说明 |
|--------|------|------|------|
| client_id | true | String | 唯一的第三方开发者 ID |
| client_secret | true | String | 第三方开发者密钥 |
| grant_type | false | String | `authorization_code`（获取）/ `refresh_token`（刷新） |
| code | false | String | 授权码，grant_type=authorization_code 时需传 |
| refresh_token | false | String | 刷新令牌，grant_type=refresh_token 时需传 |

**响应字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| access_token | String | 访问令牌 |
| expires_in | Integer | 有效期，单位秒（当前 24 小时 = 86400 秒） |
| refresh_token | String | 刷新令牌 |
| token_type | String | 令牌类型，目前仅支持 `bearer` |

**响应示例：**

```json
{
  "access_token": "access_token***************1234",
  "expires_in": 7200,
  "refresh_token": "refresh_token****************abcd",
  "token_type": "bearer"
}
```

---

### 2.5 用户绑定

将第三方用户与美的用户绑定（消息订阅必须调用）。

| 项目 | 值 |
|------|-----|
| **HTTP 方法** | `POST` |
| **路径** | `/v3/open/user/accept` |
| **参数格式** | body |

**请求头：**

| 头名称 | 必选 | 说明 |
|--------|------|------|
| `Authorization` | true | `Bearer {access_token}` |
| `ClientId` | true | 唯一的第三方开发者 ID |
| `SignatureVersion` | true | 签名版本，默认 `2.0` |
| `Signature` | true | 签名摘要 |

**请求参数：**

| 参数名 | 必选 | 类型 | 说明 |
|--------|------|------|------|
| reqId | true | String | 请求 ID |
| stamp | true | String | 请求时间戳，毫秒级 |
| type | false | String | 授权类型：`OAuth2.AuthorizationCode` / `OAuth2.ClientCredentials` / 空 |
| thirdUid | true | String | 第三方开放用户唯一标识 |
| code | false | String | 授权码，type 为 OAuth2.AuthorizationCode 时需传 |

**响应字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| reqId | String | 请求 ID |
| openUid | String | 美的用户 ID |

---

### 2.6 获取用户基本信息

获取美居开放的用户信息以及家庭信息。

| 项目 | 值 |
|------|-----|
| **HTTP 方法** | `POST` |
| **路径** | `/v3/open/user/get` |
| **认证** | Bearer Token + ClientId + Signature |

**请求参数：**

| 参数名 | 必选 | 类型 | 说明 |
|--------|------|------|------|
| reqId | true | String | 请求 ID |
| stamp | true | String | 请求时间戳，毫秒级 |

**响应字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| openUid | String | 美的用户 ID |
| userName | String | 用户名称 |
| homegroupList | List | 用户创建的家庭列表 |
| homegroupList[].openHomegroupId | Long | 家庭 ID |
| homegroupList[].homegroupName | String | 家庭名称 |

**响应示例：**

```json
{
  "openUid": "b3540cc225bbf99dd789609edef91edd",
  "userName": "小明",
  "homegroupList": [
    { "openHomegroupId": 3121311, "homegroupName": "我的家1" },
    { "openHomegroupId": 3121312, "homegroupName": "我的家2" }
  ]
}
```

---

### 2.7 获取设备列表

获取用户绑定的设备列表（含在线状态）。

| 项目 | 值 |
|------|-----|
| **HTTP 方法** | `POST` |
| **路径** | `/v3/open/device/list/get` |
| **认证** | Bearer Token + ClientId + Signature |

**请求参数：**

| 参数名 | 必选 | 类型 | 说明 |
|--------|------|------|------|
| reqId | true | String | 请求 ID |
| stamp | true | String | 请求时间戳，毫秒级 |
| openHomegroupId | false | String | 家庭 ID，传入查询指定家庭下的设备 |

**响应字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| reqId | String | 请求 ID |
| applianceList | JSONArray | 设备列表 |

**applianceList[] 字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| spid | String | 美的产品唯一标识 |
| sn8 | String | 设备型号 |
| modelNumber | String | 特殊设备型号（A0） |
| openApplianceCode | String | 设备虚拟 ID |
| type | String | 设备类型 |
| category | String | 物模型品类标识 |
| name | String | 设备名称 |
| onlineStatus | String | 在线状态：`1`在线, `0`离线 |
| enterprise | String | 设备企业码 |
| roomName | String | 设备所在房间名称 |
| roomId | String | 设备所在房间 ID |

---

### 2.8 获取设备信息

获取单个设备的基本信息。

| 项目 | 值 |
|------|-----|
| **HTTP 方法** | `POST` |
| **路径** | `/v3/open/device/info/get` |
| **认证** | Bearer Token + ClientId + Signature |

**请求参数：**

| 参数名 | 必选 | 类型 | 说明 |
|--------|------|------|------|
| reqId | true | String | 请求 ID |
| stamp | true | String | 请求时间戳，毫秒级 |
| openApplianceCode | true | String | 设备虚拟 ID |

**响应字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| reqId | String | 请求 ID |
| spid | String | 美的产品唯一标识 |
| sn8 | String | 设备型号 |
| modelNumber | String | 特殊设备型号 |
| openApplianceCode | String | 设备虚拟 ID |
| type | String | 设备类型 |
| category | String | 物模型品类标识 |
| name | String | 设备名称 |
| enterprise | String | 设备企业码 |

---

### 2.9 属性查询（单个设备）

查询设备的物模型属性值——**核心接口，用于获取设备运行状态**。

| 项目 | 值 |
|------|-----|
| **HTTP 方法** | `POST` |
| **路径** | `/v3/open/thing/properties` |
| **认证** | Bearer Token + ClientId + Signature |

**请求参数：**

| 参数名 | 必选 | 类型 | 说明 |
|--------|------|------|------|
| reqId | true | String | 请求 ID |
| stamp | true | String | 请求时间戳，毫秒级 |
| openApplianceCode | true | String | 设备虚拟 ID |
| properties | true | Array | 属性数组，格式 `module.prop`；只输入模块编码则查询整个模块；仅支持 op 包含 read 的属性 |
| disablePropIntegrityCheck | false | boolean | 禁用完整性校验，默认 false |
| disablePropLegalityCheck | false | boolean | 禁用合法性校验，默认 false |

**响应字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| requestId | String | 请求 ID |
| code | String | 接口响应码，`0` 表示成功 |
| data | Object | 展开格式的属性结果，如 `"module.prop": "value"` |

**请求示例：**

```json
{
  "reqId": "fe8234bf-e94c-4cdf-8ea9-c3112962ab01",
  "stamp": "20181201160518000",
  "openApplianceCode": "device_virtual_id_xxx",
  "properties": ["washer.workingStatus", "washer.remainingTime"]
}
```

---

### 2.10 属性批量查询

批量查询多台设备的属性值——**适用于多设备状态监控场景**。

| 项目 | 值 |
|------|-----|
| **HTTP 方法** | `POST` |
| **路径** | `/v3/open/thing/batch/properties` |
| **认证** | Bearer Token + ClientId + Signature |

**请求参数：**

| 参数名 | 必选 | 类型 | 说明 |
|--------|------|------|------|
| reqId | true | String | 请求 ID |
| stamp | true | String | 请求时间戳，毫秒级 |
| properties | true | Array | 批量查询数组（一次请求设备数不超过 20） |
| properties[].openApplianceCode | true | String | 设备虚拟 ID |
| properties[].props | true | Array | 属性数组（格式同 2.9） |
| properties[].disablePropIntegrityCheck | false | boolean | 禁用完整性校验 |
| properties[].disablePropLegalityCheck | false | boolean | 禁用合法性校验 |

**响应字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| requestId | String | 请求 ID |
| code | String | 接口响应码 |
| data | Array | 数组，每项含 `code` / `openApplianceCode` / `data` / `msg` |

---

### 2.11 全属性查询

查询设备的所有物模型属性值——**一次获取设备完整运行状态**。

| 项目 | 值 |
|------|-----|
| **HTTP 方法** | `POST` |
| **路径** | `/v3/open/thing/entire/properties` |
| **认证** | Bearer Token + ClientId + Signature |

**请求参数：**

| 参数名 | 必选 | 类型 | 说明 |
|--------|------|------|------|
| reqId | true | String | 请求 ID |
| stamp | true | String | 请求时间戳，毫秒级 |
| openApplianceCode | true | String | 设备虚拟 ID |

**响应字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| requestId | String | 请求 ID |
| code | String | 接口响应码 |
| data | Object | 所有模块展开的属性结果 |

---

### 2.12 属性设置

设置设备属性值（如启动洗涤、设置温度等）。

| 项目 | 值 |
|------|-----|
| **HTTP 方法** | `POST` |
| **路径** | `/v3/open/thing/properties/modify` |
| **认证** | Bearer Token + ClientId + Signature |

**请求参数：**

| 参数名 | 必选 | 类型 | 说明 |
|--------|------|------|------|
| reqId | true | String | 请求 ID |
| stamp | true | String | 请求时间戳，毫秒级 |
| openApplianceCode | true | String | 设备虚拟 ID |
| properties | true | Object | 展开格式的属性，`"module.prop": "value"`；仅支持 op 含 `write` 的属性 |

**响应字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| requestId | String | 请求 ID |
| code | String | 接口响应码 |
| data | String | `"success"` |

---

### 2.13 操作(Action)调用

执行设备物模型中定义的动作（如启动洗涤程序）。

| 项目 | 值 |
|------|-----|
| **HTTP 方法** | `POST` |
| **路径** | `/v3/open/thing/action` |
| **认证** | Bearer Token + ClientId + Signature |

**请求参数：**

| 参数名 | 必选 | 类型 | 说明 |
|--------|------|------|------|
| reqId | true | String | 请求 ID |
| stamp | true | String | 请求时间戳，毫秒级 |
| openApplianceCode | true | String | 设备虚拟 ID |
| moduleCode | true | String | 物模型模块编码 |
| actionCode | true | String | 物模型动作编码 |
| action | true | Object | JSON 格式对象，单层结构，按物模型 Action input 定义 |

**响应字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| requestId | String | 请求 ID |
| code | String | 接口响应码 |
| data | Object | 物模型定义的返回结果 |

---

### 2.14 设备订阅与消息通知

订阅设备状态变化，接收实时推送（在线/离线/属性变化/事件/告警）。

#### 2.14.1 设备订阅

| 项目 | 值 |
|------|-----|
| **HTTP 方法** | `POST` |
| **路径** | `/v3/open/thing/device/subscribe` |
| **认证** | Bearer Token + ClientId + Signature |

**请求参数：**

| 参数名 | 必选 | 类型 | 说明 |
|--------|------|------|------|
| reqId | true | String | 请求 ID |
| stamp | true | String | 请求时间戳，毫秒级 |
| openApplianceCode | true | String | 设备虚拟 ID，多个以英文分号分隔 |

#### 2.14.2 取消设备订阅

| 项目 | 值 |
|------|-----|
| **HTTP 方法** | `POST` |
| **路径** | `/v3/open/thing/device/subscribe/cancel` |
| **认证** | Bearer Token + ClientId + Signature |

**请求参数：** 同 2.14.1

#### 2.14.3 消息通知（回调接口，由第三方实现）

| 项目 | 值 |
|------|-----|
| **HTTP 方法** | `POST` |
| **路径** | 由第三方定义，提前注册到美的 IoT 开发者平台 |

**通知类型 (namespace)：**

| 类型 | 说明 |
|------|------|
| `ApplianceBind` | 设备绑定通知 |
| `ApplianceUnbind` | 设备解绑通知 |
| `ApplianceState` | 设备状态通知（在线/离线/属性变化/事件） |
| `ApplianceInfoModify` | 设备名称修改通知 |
| `RoomInfoModify` | 房间名称修改通知 |

**设备状态通知 — 物模型事件类型 (event)：**

| event 值 | 说明 |
|----------|------|
| `notify` | 属性变化通知（含 new/old/current） |
| `report` | 属性上报通知 |
| 具体事件名 | 物模型告警事件（如 `knob.knobRotate`） |

---

### 2.15 获取物模型实例

获取设备的物模型定义（属性列表、动作列表、事件列表），用于了解可查询的属性名和可执行的动作。

| 项目 | 值 |
|------|-----|
| **HTTP 方法** | `GET` |
| **路径** | `/v3/open/thing/doc/public/instance` |
| **参数格式** | query |
| **认证** | Bearer Token + ClientId + Signature |

**请求参数：**

| 参数名 | 必选 | 说明 |
|--------|------|------|
| resType | true | 固定值 `json` |
| identify | true | 产品 ID (spid) |

**响应字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| requestId | String | 请求 ID |
| code | String | `0` 表示成功 |
| result.smartProductId | Number | spid |
| result.manufacturer | String | 厂商 |
| result.category | String | 品类 |
| result.name | String | 实例名称 |
| result.description | String | 描述 |
| result.currentVersion | String | 版本 |
| result.jsonFileUrl | String | 物模型文件 URL |
| result.jsonFileMd5 | String | 物模型文件 MD5 |

---

### 2.16 签名规则

所有需要签名的接口（除 OAuth 授权外），请求头需携带 `Signature`。

**签名算法：**

```
摘要原串 = HTTP Method + RequestURI + QueryString(URLDecoded) + BodyBytes(UTF-8)
Signature = Base64(HMAC_SHA_256(clientSecret, 摘要原串))
```

**客户端加密说明（用于 uuid 字段加密）：**
- 算法：AES/CBC/PKCS5Padding
- 密钥：ClientSecret 做 SHA256 后取前 16 字节
- IV：16 字节随机数，转十六进制后拼接在密文前面
- 结果格式：`hex(iv) + hex(encrypted_data)`

---

### 2.17 通用错误码

| error | 说明 |
|-------|------|
| 1000 | 未知系统错误 |
| 1001 | 参数格式/类型转化异常 |
| 1002 | 参数非法 |
| 1003 | ClientId 校验失败 |
| 1004 | 服务调用失败 |
| 1006 | 签名或用户验证失败 |
| 1009 | 开发者账号不存在 |
| 1014 | Lua 脚本内部转换错误 |
| 1021 | 批量查询数量超过限制 |
| 1105 | 用户不存在 |
| 1200 | 该用户不属于设备所在家庭组 |
| 1202 | 非主人无法操作 |
| 1300 | 设备不存在 |
| 1304 | 设备不属于此用户 |
| 1305 | 用户不是设备的管理员 |
| 1306 | 设备超时没响应 |
| 1307 | 设备离线 |
| 1321 | 设备未确权 |
| 2001 | 非法开发者 |
| 2003 | 授权过程失败/取消授权失败 |
| 2005 | 三方刷新令牌过期 |
| 2006 | 无法从三方云平台获取 OAuth2 令牌 |

---

### 2.18 U 净专用平台说明

U 净（无锡小净共享网络科技有限公司，美的集团旗下）运营独立的商用洗衣平台 `phoenix.ujing.online`，提供设备状态查询、扫码下单、订单管理等接口。

> ⚠️ **非官方公开文档**：以下接口信息来自第三方开发者通过 APP 抓包逆向获取（GitHub 开源项目 SleepyCelery/UjingWasherWatcher），**并非来自美的/U 净官方发布的开发者文档**。接口参数为实际抓包验证可用，但官方未公开文档，后续版本可能变更。仅供模拟参考。

**已知端点（来自逆向）：**

| 功能 | 方法 | URL |
|------|------|-----|
| 扫码识别设备 | POST | `https://phoenix.ujing.online:443/api/v1/devices/scanWasherCode` |
| 获取设备详情 | GET | `https://phoenix.ujing.online:443/api/v1/devices/{deviceId}` |
| 创建预约订单 | POST | `https://phoenix.ujing.online:443/api/v1/orders/create` |
| 获取订单详情 | GET | `https://phoenix.ujing.online:443/api/v1/orders/{orderId}/detail?additional=price` |

**创建订单请求体字段：**

| 字段 | 说明 |
|------|------|
| deviceId | 设备 ID（扫码获取） |
| deviceTypeId | 设备类型：`2`洗衣机, 其他为烘干机/洗鞋机 |
| storeId | 门店 ID（设备详情中获取） |
| washTemperatureId | 温度：`1`常温, `2`30℃, `3`40℃, `4`60℃ |
| type | 默认 `1` |
| deviceWashModelId | 洗涤模式：`1`普通洗, `2`小件洗, `3`超强洗, `4`单脱水 |

> **建议**：如需正式对接 U 净平台，请联系 U 净商务团队 (ujing.com.cn) 获取官方 API 文档。

---

## 3. 三星商用洗烘 (Samsung)

### 3.1 平台概述

三星商用洗烘设备通过 **Samsung SmartThings API** 进行设备管理和状态查询。SmartThings 是三星的 IoT 智能家居/商业平台，洗衣机/烘干机等白电原生集成。

| 项目 | 值 |
|------|-----|
| **API Base URL** | `https://api.smartthings.com/v1` |
| **认证方式** | OAuth 2.0 (生产) / Personal Access Token (测试) |
| **协议** | REST / HTTPS |
| **文档地址** | `https://developer.smartthings.com/docs/api/public` |

> **来源**：`https://developer.smartthings.com/docs/service-integrations/query-and-list-devices`
> **来源**：`https://developer.smartthings.com/docs/service-integrations/control-devices`
> **来源**：`https://developer.smartthings.com/docs/getting-started/quickstart`

---

### 3.2 认证 — OAuth 2.0

**Step 1 — 获取授权码：**

```
GET https://api.smartthings.com/oauth/authorize?client_id={clientId}&response_type=code&redirect_uri={yourRedirect}&scope={scopes}
```

用户登录 Samsung 账号并选择 Location 后，重定向到 `redirect_uri` 并附带 `code`。

**Step 2 — 获取令牌：**

| 项目 | 值 |
|------|-----|
| **HTTP 方法** | `POST` |
| **路径** | `https://api.smartthings.com/oauth/token` |
| **认证** | HTTP Basic Auth (clientId:clientSecret) |
| **Content-Type** | `application/x-www-form-urlencoded` |

**请求参数：**

| 参数名 | 必选 | 说明 |
|--------|------|------|
| grant_type | true | `authorization_code`（获取）/ `refresh_token`（刷新） |
| code | true | Step 1 获取的授权码（grant_type=authorization_code 时） |
| redirect_uri | true | 与授权步骤相同的 redirect_uri |
| client_id | true | 集成应用的 clientId |
| refresh_token | true | 刷新令牌（grant_type=refresh_token 时） |

**返回：** `access_token`（有效期 24 小时）和 `refresh_token`

**使用令牌：**

```
Authorization: Bearer {access_token}
```

> 测试环境可直接使用 Personal Access Token (PAT)：在 `https://account.smartthings.com/tokens` 生成。

---

### 3.3 列出设备 (List Devices)

列出所有可访问的设备，可选包含设备状态和健康状态。

| 项目 | 值 |
|------|-----|
| **HTTP 方法** | `GET` |
| **路径** | `/devices` |
| **认证** | `Authorization: Bearer {access_token}` |

**Query 参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| capability | string | 否 | 按 capability 过滤（如 `switch`） |
| includeStatus | boolean | 否 | `true` 时在响应中包含所有 capability 的当前状态值 |
| includeHealth | boolean | 否 | `true` 时在响应中包含设备健康状态 |

**响应字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| items | array | 设备对象数组 |
| _links | object | 分页链接 |

**items[] 字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| deviceId | string | 设备唯一标识符 |
| name | string | 设备类型名称 |
| label | string | 用户分配的标签（显示名称） |
| manufacturerName | string | 设备制造商 |
| locationId | string | 设备所属位置 ID |
| components | array | 设备组件数组 |
| type | string | 设备类型（如 `VIPER`, `OCF`） |
| status | object | *(仅 includeStatus=true)* 所有组件所有 capability 的当前状态 |
| healthState | object | *(仅 includeHealth=true)* 设备健康状态 |
| createTime | string | 设备创建时间 |
| profile | object | 设备 profile 信息 |
| deviceManufacturerCode | string | 设备制造商代码 |
| deviceModel | string | 设备型号 |
| ocfDeviceType | string | OCF 设备类型 |
| executionContext | string | 执行上下文（如 `CLOUD`） |

**components[] 字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 组件标识符（如 `main`） |
| label | string | 组件标签 |
| capabilities | array | 组件支持的 capability 数组 |
| categories | array | 设备类别信息 |
| optional | boolean | 是否为可选组件 |

**capabilities[] 字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | capability 标识符（如 `switch`） |
| version | integer | capability 版本号 |
| optional | boolean | 是否为可选 capability |
| status | object | *(仅 includeStatus=true)* 该 capability 的所有属性状态 |

**healthState 字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| state | string | 健康状态（如 `ONLINE`, `OFFLINE`） |
| lastUpdatedDate | string | 最后更新时间（ISO 8601） |

**请求示例：**

```http
GET https://api.smartthings.com/v1/devices?includeStatus=true&includeHealth=true HTTP/1.1
Accept: application/json
Authorization: Bearer {access_token}
```

---

### 3.4 获取单个设备描述 (Get Device)

获取单个设备的描述信息。

| 项目 | 值 |
|------|-----|
| **HTTP 方法** | `GET` |
| **路径** | `/devices/{deviceId}` |
| **认证** | `Authorization: Bearer {access_token}` |

**路径参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| deviceId | string | 是 | 设备标识符 |

**响应：** 同 3.3 中的单个设备对象结构

---

### 3.5 获取设备完整状态 (Get Device Full Status)

获取设备所有组件、所有 capability、所有属性的完整状态——**核心接口，用于获取设备完整运行状态**。

| 项目 | 值 |
|------|-----|
| **HTTP 方法** | `GET` |
| **路径** | `/devices/{deviceId}/status` |
| **认证** | `Authorization: Bearer {access_token}` |

**路径参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| deviceId | string | 是 | 设备标识符 |

**响应结构：**

```json
{
  "components": {
    "{componentId}": {
      "{capabilityId}": {
        "{attributeName}": {
          "value": "{any}",
          "timestamp": "{ISO 8601}",
          "unit": "{string}"
        }
      }
    }
  }
}
```

**每个属性对象的字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| value | any | 属性的当前值（基本类型、`null` 或对象如 `{maximum, minimum}`） |
| timestamp | string | 最后更新时间（ISO 8601） |
| unit | string | *(可选)* 值的单位（如 `%`, `K`） |
| data | object | *(可选)* 附加数据 |

**请求示例：**

```http
GET https://api.smartthings.com/v1/devices/{deviceId}/status HTTP/1.1
Accept: application/json
Authorization: Bearer {access_token}
```

**响应示例：**

```json
{
  "components": {
    "main": {
      "switch": {
        "switch": {
          "value": "on",
          "timestamp": "2026-04-28T18:45:19.820Z"
        }
      },
      "switchLevel": {
        "level": {
          "value": 50,
          "unit": "%",
          "timestamp": "2026-04-28T18:48:24.932Z"
        }
      }
    }
  }
}
```

---

### 3.6 获取 Capability 状态

获取设备指定组件下指定 capability 的属性状态——**用于精确查询单个能力状态（如开关、洗涤模式等）**。

| 项目 | 值 |
|------|-----|
| **HTTP 方法** | `GET` |
| **路径** | `/devices/{deviceId}/components/{componentId}/capabilities/{capabilityId}/status` |
| **认证** | `Authorization: Bearer {access_token}` |

**路径参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| deviceId | string | 是 | 设备标识符 |
| componentId | string | 是 | 组件标识符（如 `main`） |
| capabilityId | string | 是 | capability 标识符（如 `switch`） |

**响应：** JSON 对象，按属性名为 key

```json
{
  "switch": {
    "value": "on",
    "timestamp": "2026-03-12T15:14:28.016Z"
  }
}
```

**请求示例：**

```http
GET https://api.smartthings.com/v1/devices/{deviceId}/components/main/capabilities/switch/status HTTP/1.1
Accept: application/json
Authorization: Bearer {access_token}
```

---

### 3.7 执行设备命令 (Execute Commands)

向设备发送控制命令。

| 项目 | 值 |
|------|-----|
| **HTTP 方法** | `POST` |
| **路径** | `/devices/{deviceId}/commands` |
| **认证** | `Authorization: Bearer {access_token}` |
| **Content-Type** | `application/json;charset=utf-8` |

**请求体：**

| 字段 | 说明 |
|------|------|
| commands | 命令数组 |
| commands[].component | 目标组件（如 `main`） |
| commands[].capability | capability 名称（如 `switch`） |
| commands[].command | 要执行的命令（如 `on`, `off`） |
| commands[].arguments | 命令参数数组（无参数时为空数组） |

**请求示例：**

```http
POST https://api.smartthings.com/v1/devices/{deviceId}/commands HTTP/1.1
Content-Type: application/json;charset=utf-8
Accept: application/json
Authorization: Bearer {access_token}

{
  "commands": [
    {
      "component": "main",
      "capability": "switch",
      "command": "off",
      "arguments": []
    }
  ]
}
```

**响应字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| results | array | 结果数组，每条命令一个 |
| results[].id | string | 命令执行唯一标识 |
| results[].status | string | `ACCEPTED` 表示命令已排队等待执行 |

**响应示例：**

```json
{
  "results": [
    {
      "id": "5eb69bcf-1405-4c4a-8a32-0c3ed42ac357",
      "status": "ACCEPTED"
    }
  ]
}
```

> **注意**：`ACCEPTED` 表示 SmartThings 已接收命令并尝试执行，不代表命令已完成。实际状态变化通过事件订阅异步通知。

---

### 3.8 洗衣机/烘干机相关 Capability

三星洗衣机/烘干机在 SmartThings 中使用以下 capability（来自 SmartThings 社区文档与设备能力参考）：

#### 洗衣机 Capability

| Capability ID | 说明 |
|---------------|------|
| `samsungce.washerCycle` | 洗涤程序（当前/支持的模式） |
| `samsungce.washerCyclePreset` | 洗涤预设程序 |
| `samsungce.washerOperatingState` | 运行状态（idle/running/paused/finished等） |
| `samsungce.washerWashingTime` | 洗涤剩余时间 |
| `samsungce.washerWaterLevel` | 水位 |
| `samsungce.washerWaterValve` | 水阀状态 |
| `samsungce.washerDelayEnd` | 预约结束时间 |
| `samsungce.washerFreezePrevent` | 防冻模式 |
| `samsungce.washerBubbleSoak` | 泡泡浸泡功能 |
| `samsungce.washerLabelScanCyclePreset` | 标签扫描预设 |
| `custom.washerWaterTemperature` | 洗涤水温（自定义） |
| `hca.washerMode` | 洗涤模式（HCA 标准） |

**hca.washerMode 支持模式：**

| 模式值 | 说明 |
|--------|------|
| `normal` | 标准洗 |
| `quickWash` | 快洗 |
| `mix` | 混合洗 |
| `eco` | 节能洗 |
| `spinOnly` | 仅脱水 |

#### 烘干机 Capability

| Capability ID | 说明 |
|---------------|------|
| `samsungce.dryerDryingTime` | 烘干时间 |
| `custom.dryerWrinklePrevent` | 防皱功能 |

#### 通用 Capability

| Capability ID | 说明 |
|---------------|------|
| `switch` | 开关状态（on/off） |
| `samsungce.kidsLock` | 童锁 |
| `samsungce.detergentAutoReplenishment` | 洗涤剂自动补充 |
| `samsungce.softenerAutoReplenishment` | 柔顺剂自动补充 |
| `samsungce.detergentState` | 洗涤剂状态 |
| `samsungce.softenerState` | 柔顺剂状态 |
| `samsungce.waterConsumptionReport` | 用水量报告 |
| `samsungce.clothingExtraCare` | 衣物额外护理 |
| `samsungce.energyPlanner` | 能耗计划 |
| `samsungce.softwareUpdate` | 软件更新 |
| `samsungce.softwareVersion` | 软件版本 |
| `samsungce.deviceIdentification` | 设备标识 |
| `samsungce.driverVersion` | 驱动版本 |
| `samsungce.welcomeMessage` | 欢迎消息 |
| `samsungce.quickControl` | 快速控制 |
| `sec.diagnosticsInformation` | 诊断信息 |
| `sec.wifiConfiguration` | WiFi 配置 |
| `sec.smartthingsHub` | SmartThings Hub |

> **来源**：`https://community.smartthings.com/t/retrieve-washer-dryer-programs-in-plain-english-and-control-appliance-with-python/305068`
> **来源**：`https://developer.smartthings.com/docs/devices/capabilities/capabilities-reference`

**查询洗衣机运行状态示例：**

```http
GET https://api.smartthings.com/v1/devices/{deviceId}/components/main/capabilities/samsungce.washerOperatingState/status HTTP/1.1
Accept: application/json
Authorization: Bearer {access_token}
```

**设置洗涤水温示例：**

```http
POST https://api.smartthings.com/v1/devices/{deviceId}/commands HTTP/1.1
Content-Type: application/json;charset=utf-8
Authorization: Bearer {access_token}

{
  "commands": [
    {
      "component": "main",
      "capability": "custom.washerWaterTemperature",
      "command": "setWasherWaterTemperature",
      "arguments": [40]
    }
  ]
}
```

---

### 3.9 获取位置列表

| 项目 | 值 |
|------|-----|
| **HTTP 方法** | `GET` |
| **路径** | `/locations` |
| **认证** | `Authorization: Bearer {access_token}` |

---

### 3.10 获取房间列表

| 项目 | 值 |
|------|-----|
| **HTTP 方法** | `GET` |
| **路径** | `/locations/{locationId}/rooms` |
| **认证** | `Authorization: Bearer {access_token}` |

---

### 3.11 订阅设备事件

通过 webhook 接收设备状态变化事件，实现实时状态推送。

**事件回调（SmartThings → 第三方 webhook）：**

```json
{
  "deviceId": "b9af18af-55c8-4441-83e2-bfe6021235c4",
  "componentId": "main",
  "capability": "switch",
  "attribute": "switch",
  "value": "off",
  "stateChange": true,
  "subscriptionName": "switchHandler"
}
```

---

## 附录：API 端点汇总

### 海尔易售后平台

| # | 接口名称 | 方法 | 路径 |
|---|----------|------|------|
| 1 | 通过序列号获取设备信息 (V1) | GET | `/api/CustomerService/GetMemberProductBySN` |
| 2 | 通过序列号获取客户设备详情 (V2) | GET | `/open/v2/Client/GetCustomerProductBySN` |
| 3 | 获取会员设备详情 | GET | `/api/CustomerService/GetMemberProductDetail` |
| 4 | 获取工单详情 (V2) | GET | `/open/v2/WorkOrder/GetWorkOrder` |

> 域名：`https://api.eshouhou.cn`

### 美的 IoT 平台 (V3)

| # | 接口名称 | 方法 | 路径 |
|---|----------|------|------|
| 1 | 获取授权页 | GET | `/v3/open/oauth2/authorize` |
| 2 | 获取授权二维码 | POST | `/v3/open/user/qrcode/get` |
| 3 | 获取令牌 | POST | `/v3/open/oauth2/token` |
| 4 | 用户绑定 | POST | `/v3/open/user/accept` |
| 5 | 获取用户基本信息 | POST | `/v3/open/user/get` |
| 6 | 用户取消授权 | POST | `/v3/open/user/cancel` |
| 7 | 设备配网指引 | POST | `/v3/open/connect/guide/info` |
| 8 | 设备确权指引 | POST | `/v3/open/appliance/auth/guide/info` |
| 9 | 设备确权 | POST | `/v3/open/appliance/auth/confirm` |
| 10 | 确权状态查询 | POST | `/v3/open/appliance/auth/get` |
| 11 | 确权状态批量查询 | POST | `/v3/open/appliance/auth/batchGet` |
| 12 | 获取 ADS 动态路由地址 | POST | `/v3/open/connect/ads` |
| 13 | **获取设备列表** | POST | `/v3/open/device/list/get` |
| 14 | **获取设备信息** | POST | `/v3/open/device/info/get` |
| 15 | 绑定设备 | POST | `/v3/open/device/bind` |
| 16 | 获取物模型实例 | GET | `/v3/open/thing/doc/public/instance` |
| 17 | 操作(action)调用 | POST | `/v3/open/thing/action` |
| 18 | **属性(property)查询** | POST | `/v3/open/thing/properties` |
| 19 | **属性批量查询** | POST | `/v3/open/thing/batch/properties` |
| 20 | **全属性查询** | POST | `/v3/open/thing/entire/properties` |
| 21 | **属性设置** | POST | `/v3/open/thing/properties/modify` |
| 22 | 设备订阅 | POST | `/v3/open/thing/device/subscribe` |
| 23 | 取消设备订阅 | POST | `/v3/open/thing/device/subscribe/cancel` |
| 24 | 获取场景列表 | POST | `/v3/open/scene/item/list` |
| 25 | 执行场景 | POST | `/v3/open/scene/item/execute` |

> 域名：`https://api-prod.smartmidea.net`
> ⭐ 标注为核心接口（设备状态查询）

### 三星 SmartThings API

| # | 接口名称 | 方法 | 路径 |
|---|----------|------|------|
| 1 | 获取授权码 | GET | `/oauth/authorize` |
| 2 | 获取令牌 | POST | `/oauth/token` |
| 3 | **列出设备** | GET | `/v1/devices` |
| 4 | 获取单个设备描述 | GET | `/v1/devices/{deviceId}` |
| 5 | **获取设备完整状态** | GET | `/v1/devices/{deviceId}/status` |
| 6 | **获取 Capability 状态** | GET | `/v1/devices/{deviceId}/components/{componentId}/capabilities/{capabilityId}/status` |
| 7 | **执行设备命令** | POST | `/v1/devices/{deviceId}/commands` |
| 8 | 获取位置列表 | GET | `/v1/locations` |
| 9 | 获取房间列表 | GET | `/v1/locations/{locationId}/rooms` |

> 域名：`https://api.smartthings.com`
> ⭐ 标注为核心接口（设备状态查询）

---

## 附录：数据来源说明

| 厂商 | 数据来源 | 官方文档状态 |
|------|----------|-------------|
| **海尔商用智洗** | eshouhou.cn 开放平台官方文档 | ✅ 公开（设备信息查询类） |
| **海尔 U+ 平台** | haigeek.com 系统集成商解决方案页 | ❌ 需注册后下载 API 文档 |
| **美的 U 净** | iot.midea.com 美的 IoT 开发者平台 V3 API 文档 | ✅ 公开（完整 33 个接口） |
| **美的 U 净专用平台** | GitHub 第三方逆向项目 | ⚠️ 非官方文档（逆向获取） |
| **三星商用洗烘** | developer.smartthings.com 官方开发者文档 | ✅ 公开（完整 REST API） |
