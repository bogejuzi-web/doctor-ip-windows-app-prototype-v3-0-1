window.PROTOTYPE_DATA = {
  "project": "口播素材生产平台",
  "version": "2.1.0",
  "generatedAt": "2026-08-24T09:25:00.000Z",
  "pages": [
    {
      "id": "P01",
      "title": "驳回原片补充视频素材",
      "type": "html",
      "protocol": "prototype-v1",
      "file": "pages/P01-rejected-source-supplement.html",
      "url": "pages/P01-rejected-source-supplement.html",
      "viewport": "H5",
      "requirements": [
        "原片驳回后补充素材需回显当前视频脚本"
      ],
      "overview": "原片被驳回后，从补充视频素材入口重新拍摄时，回显本原片脚本，避免再次提交素材时无法参考原有内容。",
      "pageRole": "承载驳回原片的补充视频素材拍摄入口。",
      "scenario": "用户从“驳回原片补充素材”入口进入页面，脚本文本默认处于回显状态。",
      "defaultScenario": "P01-S01",
      "illustration": "assets/illustrations/P01-script-recall.svg",
      "states": [
        {
          "id": "P01-S01",
          "title": "驳回原片补充素材｜脚本已回显"
        }
      ],
      "changes": [
        {
          "id": "P01-C01",
          "pageId": "P01",
          "stateId": "P01-S01",
          "location": "录制画面中的脚本文本区",
          "action": "从驳回原片进入补充视频素材入口",
          "result": "回显本原片脚本，用户可直接参考脚本拍摄补充素材。"
        }
      ]
    },
    {
      "id": "P02",
      "title": "原片审核｜直接成片交付",
      "type": "html",
      "protocol": "prototype-v1",
      "file": "pages/P02-direct-delivery-review.html",
      "url": "pages/P02-direct-delivery-review.html",
      "viewport": "PC",
      "requirements": [
        "多原片直接成片交付",
        "交付跳过文案与剪辑",
        "驳回直达组长"
      ],
      "overview": "在原片审核详情页新增“直接成片交付”。多原片按原片样式向下排列，用户直接在对应原片上勾选后提交成片，跳过文案和 AI 剪辑。",
      "pageRole": "为仅需原片审核的项目提供直接成片交付入口。",
      "scenario": "默认是原片审核页；多原片时展开当前原片列表，在原片卡片勾选一条后直接完成交付。",
      "defaultScenario": "P02-S01",
      "illustration": "assets/illustrations/P02-direct-delivery.svg",
      "states": [
        {
          "id": "P02-S01",
          "title": "原片审核｜待处理"
        },
        {
          "id": "P02-S02",
          "title": "多原片列表｜勾选提交前"
        },
        {
          "id": "P02-S03",
          "title": "直接成片交付｜已提交"
        }
      ],
      "changes": [
        {
          "id": "P02-C01",
          "pageId": "P02",
          "stateId": "P02-S01",
          "location": "底部审核操作区，AI 剪辑右侧",
          "action": "点击“直接成片交付”",
          "result": "未勾选原片时提示“请选择提交的原片”。"
        },
        {
          "id": "P02-C02",
          "pageId": "P02",
          "stateId": "P02-S02",
          "location": "当前原片列表的原片标题下方",
          "action": "勾选一条原片",
          "result": "多原片按当前原片样式向下排列，只能选择一条直接提交成片。"
        },
        {
          "id": "P02-C03",
          "pageId": "P02",
          "stateId": "P02-S03",
          "location": "交付成功反馈",
          "action": "选择原片并确认交付",
          "result": "原片直接提交成片，跳过文案与 AI 剪辑。"
        },
        {
          "id": "P02-C04",
          "pageId": "P02",
          "stateId": "P02-S02",
          "location": "原片素材区的特殊流转说明",
          "action": "原片审核驳回",
          "result": "无需文案和剪辑人员处理，直接退回编辑组长或剪辑组长。"
        }
      ]
    },
    {
      "id": "P03",
      "title": "脚本列表｜运营审核推荐",
      "type": "html",
      "protocol": "prototype-v1",
      "file": "pages/P03-script-ops-review.html",
      "url": "pages/P03-script-ops-review.html",
      "viewport": "PC",
      "requirements": [
        "运营审核后推荐筛选",
        "无需审核可直接推荐",
        "导入模板新增字段"
      ],
      "overview": "新增脚本时（包括页面新增以及导入）新增是否运营审核字段。\n若选择是：则按现有流程推荐给医生时需要运营审核后将脚本推荐给医生。\n若选择否：则不需要运营审核，直接推荐给医生。",
      "pageRole": "配置医生脚本是否需运营审核后才能推荐。",
      "scenario": "运营人员编辑脚本：选是沿用运营审核，选否则直接推荐医生。",
      "defaultScenario": "P03-S01",
      "illustration": "assets/illustrations/P03-ops-review-routing.svg",
      "states": [
        {
          "id": "P03-S01",
          "title": "脚本列表｜报名列表"
        },
        {
          "id": "P03-S02",
          "title": "编辑脚本｜设置运营审核"
        }
      ],
      "changes": [
        {
          "id": "P03-C01",
          "pageId": "P03",
          "stateId": "P03-S02",
          "location": "编辑弹窗的是否显示右侧",
          "action": "选择运营是否审核为是或否",
          "result": "是需运营审核后推荐；否可直接推荐医生。"
        },
        {
          "id": "P03-C02",
          "pageId": "P03",
          "stateId": "P03-S01",
          "location": "脚本列表表格",
          "action": "查看运营是否审核列",
          "result": "列表直观展示每个脚本的审核规则。"
        },
        {
          "id": "P03-C03",
          "pageId": "P03",
          "stateId": "P03-S01",
          "location": "导入脚本与下载模板入口",
          "action": "导入或下载脚本模板",
          "result": "模板表头增加“运营是否审核”字段。"
        }
      ]
    },
    {
      "id": "P04",
      "title": "成片列表｜导出字段",
      "type": "html",
      "protocol": "prototype-v1",
      "file": "pages/P04-video-export-list.html",
      "url": "pages/P04-video-export-list.html",
      "viewport": "PC",
      "requirements": [
        "成片列表新增导出脚本内容",
        "成片列表新增导出封面图片链接",
        "成片列表新增导出补充素材原因"
      ],
      "overview": "导出增加：脚本内容、封面图链接和补充素材原因字段；多条原因按编号标题区分（1.、2.、3.）。",
      "pageRole": "供运营从成片列表导出任务和素材关联信息。",
      "scenario": "运营查询成片列表后点击导出，确认新增字段；多条补充素材原因按 1.、2. 编号导出。",
      "defaultScenario": "P04-S01",
      "illustration": "assets/illustrations/P04-export-extra-columns.svg",
      "states": [
        {
          "id": "P04-S01",
          "title": "成片列表｜全部"
        }
      ],
      "changes": [
        {
          "id": "P04-C01",
          "pageId": "P04",
          "stateId": "P04-S01",
          "location": "成片列表顶部操作区",
          "action": "点击导出",
          "result": "展示导出字段确认，说明追加脚本内容、封面图片链接和补充素材原因。"
        }
      ]
    },
    {
      "id": "P05",
      "title": "剪辑列表｜补充素材原因",
      "type": "html",
      "protocol": "prototype-v1",
      "file": "pages/P05-clip-list-supplement-reason.html",
      "url": "pages/P05-clip-list-supplement-reason.html",
      "viewport": "PC",
      "requirements": [
        "补充素材原因列表列",
        "多条原因编号显示",
        "超长省略与悬浮完整显示"
      ],
      "overview": "剪辑列表新增补充素材原因（列表+导入同步加），多条导出原因按序号 1.、2.、3. 排列。",
      "pageRole": "使审核人员在剪辑列表快速了解每条任务的补充素材需求。",
      "scenario": "用户浏览待补充素材任务，鼠标移入原因单元格查看完整多条原因。",
      "defaultScenario": "P05-S01",
      "illustration": "assets/illustrations/P05-supplement-reason-tooltip.svg",
      "states": [
        {
          "id": "P05-S01",
          "title": "剪辑列表｜待补充素材"
        }
      ],
      "changes": [
        {
          "id": "P05-C01",
          "pageId": "P05",
          "stateId": "P05-S01",
          "location": "是否确认成片列右侧",
          "action": "查看或悬浮补充素材原因",
          "result": "多条原因以 1.、2. 编号呈现；超出列宽以省略号显示，悬浮显示完整内容。"
        }
      ]
    },
    {
      "id": "P06",
      "title": "脚本回收",
      "type": "group",
      "children": [
        {
          "id": "P06-A",
          "title": "项目列表、编辑项目",
          "type": "html",
          "protocol": "prototype-v1",
          "file": "pages/P06-project-recycle.html",
          "url": "pages/P06-project-recycle.html",
          "viewport": "PC",
          "requirements": [
            "项目列表显示回收时间",
            "项目编辑配置回收机制"
          ],
          "overview": "项目列表显示脚本回收机制和具体回收时间；编辑项目时可配置脚本回收规则。",
          "scenario": "在项目列表查看回收时间，点击项目的“编辑”查看并设置脚本回收机制。",
          "defaultScenario": "P06-A-S01",
          "illustration": "assets/illustrations/P06-script-recycle.svg",
          "states": [
            {
              "id": "P06-A-S01",
              "title": "项目列表｜回收时间"
            },
            {
              "id": "P06-A-S02",
              "title": "编辑项目｜回收机制"
            }
          ],
          "changes": [
            {
              "id": "P06-C01",
              "pageId": "P06-A",
              "stateId": "P06-A-S01",
              "location": "项目列表回收机制与回收时间列",
              "action": "查看项目配置",
              "result": "展示脚本是否回收和具体回收时间。"
            },
            {
              "id": "P06-C02",
              "pageId": "P06-A",
              "stateId": "P06-A-S02",
              "location": "项目脚本拍摄限制下方",
              "action": "选择脚本回收机制为是",
              "result": "可按每月固定时间或推送日设置自然日和时间。"
            }
          ]
        },
        {
          "id": "P06-B",
          "title": "回收抽屉",
          "type": "html",
          "protocol": "prototype-v1",
          "file": "pages/P06-recycle-drawer.html",
          "url": "pages/P06-recycle-drawer.html",
          "viewport": "PC",
          "requirements": [
            "脚本列表新增回收入口",
            "脚本列表批量回收重推"
          ],
          "overview": "脚本列表新增“脚本回收”入口，打开回收抽屉后可多选脚本并重新推送给医生。",
          "scenario": "在脚本列表点击“脚本回收”，查看回收人和回收时间，勾选脚本后重新推送给医生。",
          "defaultScenario": "",
          "illustration": "assets/illustrations/P06-script-recycle.svg",
          "states": [],
          "changes": [
            {
              "id": "P06-C03",
              "pageId": "P06-B",
              "location": "脚本列表顶部的脚本回收入口",
              "action": "多选回收脚本并重新推送",
              "result": "记录回收人并批量重新推送给医生。"
            }
          ]
        }
      ]
    },
    {
      "id": "P07",
      "title": "脚本分类｜一键展开收起",
      "type": "html",
      "protocol": "prototype-v1",
      "file": "pages/P07-category-expand-collapse.html",
      "url": "pages/P07-category-expand-collapse.html",
      "viewport": "PC",
      "requirements": [
        "一键展开分类",
        "一键收起分类"
      ],
      "overview": "复刻脚本分类列表，新增批量展开和收起分类按钮。",
      "pageRole": "帮助运营在长分类树中快速查看或收拢全部二级分类。",
      "scenario": "用户点击一键展开或一键收起，同时保留一级分类单独控制。",
      "defaultScenario": "P07-S01",
      "illustration": "assets/illustrations/P06-script-recycle.svg",
      "states": [
        {
          "id": "P07-S01",
          "title": "分类列表｜已展开"
        }
      ],
      "changes": [
        {
          "id": "P07-C01",
          "pageId": "P07",
          "stateId": "P07-S01",
          "location": "分类列表查询区",
          "action": "点击一键展开分类",
          "result": "显示全部二级分类。"
        },
        {
          "id": "P07-C02",
          "pageId": "P07",
          "stateId": "P07-S01",
          "location": "分类列表查询区",
          "action": "点击一键收起分类",
          "result": "隐藏所有二级分类。"
        }
      ]
    }
  ]
};
