(function () {
  "use strict";

  const data = window.PROTOTYPE_DATA;
  const byId = (id) => document.getElementById(id);
  function leafPageEntries() {
    const entries = [];
    const visit = (page, ancestors) => {
      if (!page) return;
      const pageAncestors = Array.isArray(ancestors) ? ancestors : [];
      if (page.file) entries.push({ page, ancestors: pageAncestors });
      if (Array.isArray(page.children)) {
        page.children.forEach((child) => visit(child, pageAncestors.concat(page)));
      }
    };
    (data && Array.isArray(data.pages) ? data.pages : []).forEach((page) => visit(page, null));
    return entries;
  }
  const state = {
    currentPageId: leafPageEntries()[0] ? leafPageEntries()[0].page.id : "",
    mode: "annotation",
    scenarioId: "",
    pendingChangeId: "",
    annotationsVisible: true,
    annotationWidth: 380
  };
  const MIN_ANNOTATION_WIDTH = 260;
  const RESIZER_WIDTH = 18;
  const CHANGE_COPY = {
    "P01-C01": { feature: "驳回原片脚本回显", summary: "解决补充素材拍摄时无法参考原片脚本的问题。", interaction: "从“驳回原片补充素材”入口进入页面，自动回显本原片脚本。" },
    "P02-C01": { feature: "直接成片交付", summary: "支持原片审核项目跳过文案和 AI 剪辑环节。", interaction: "点击“直接成片交付”，未勾选原片时提示先选择原片。" },
    "P02-C02": { feature: "多原片选择", summary: "让用户在当前原片列表中明确选择要交付的素材。", interaction: "在原片卡片勾选一条原片，列表按现有样式向下展示。" },
    "P02-C03": { feature: "直接交付确认", summary: "确认后将所选原片直接交付成片。", interaction: "选择原片并确认交付，页面反馈已跳过文案与 AI 剪辑。" },
    "P02-C04": { feature: "驳回直达组长", summary: "避免无编辑、剪辑人员的项目进入无效流转。", interaction: "在原片审核执行驳回，任务直接退回编辑组长或剪辑组长。" },
    "P03-C01": { feature: "运营审核推荐筛选", summary: "支持设置脚本是否需要运营审核后再推荐。", interaction: "在编辑弹窗选择“是”或“否”，分别对应运营审核或直接推荐医生。" },
    "P03-C02": { feature: "审核规则列表展示", summary: "帮助运营快速确认每个脚本的推荐审核规则。", interaction: "查看脚本列表的“运营是否审核”列，读取当前规则。" },
    "P03-C03": { feature: "导入模板审核字段", summary: "保证批量导入与页面配置使用同一套审核规则。", interaction: "点击导入脚本或下载模板，表头包含“运营是否审核”字段。" },
    "P04-C01": { feature: "成片列表导出字段", summary: "导出前明确提示脚本内容、封面链接和补充素材原因。", interaction: "点击“导出”，弹出新增字段的导出确认说明。" },
    "P05-C01": { feature: "补充素材原因展示", summary: "支持快速阅读多条补充原因并避免长文本撑开列表。", interaction: "悬浮原因内容，超出列宽的省略文本展示完整内容。" },
    "P06-C01": { feature: "项目脚本回收时间展示", summary: "让运营在项目列表中直接了解回收规则与时间。", interaction: "查看项目列表的回收机制和回收时间列，读取项目配置。" },
    "P06-C02": { feature: "项目脚本回收规则", summary: "支持按每月固定时间或推送日设置自动回收。", interaction: "在项目脚本拍摄限制下方选择回收为“是”，填写自然日和时间。" },
    "P06-C03": { feature: "回收脚本批量重推", summary: "支持记录回收人并批量将脚本重新推送给医生。", interaction: "点击“脚本回收”，多选脚本后执行重新推送。" },
    "P07-C01": { feature: "一键展开分类", summary: "帮助快速查看全部二级分类。", interaction: "点击“全部展开”，分类列表显示所有二级分类。" },
    "P07-C02": { feature: "一键收起分类", summary: "帮助快速收拢长分类树，减少列表占用。", interaction: "再次点击同一按钮，列表收起全部二级分类。" }
  };

  function create(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function pageById(pageId) {
    const entry = leafPageEntries().find((item) => item.page.id === pageId);
    return entry ? entry.page : undefined;
  }

  function pageEntryById(pageId) {
    return leafPageEntries().find((item) => item.page.id === pageId);
  }

  function pageLabel(page) {
    const entry = pageEntryById(page.id);
    const ancestors = entry && Array.isArray(entry.ancestors) ? entry.ancestors : [];
    if (!ancestors.length) return page.id + " · " + page.title;
    const labels = ancestors.map((ancestor, index) => index === 0
      ? ancestor.id + " · " + ancestor.title
      : ancestor.title);
    labels.push(page.title);
    return labels.join(" / ");
  }

  function currentPage() {
    return pageById(state.currentPageId);
  }

  function pageStates(page) {
    return page && Array.isArray(page.states) ? page.states : [];
  }

  function pageUrl(page) {
    const url = new URL(page.file, window.location.href);
    // 本地 file:// 打开时，部分浏览器会把 iframe 的查询参数误判为文件名的一部分。
    // 保持本地地址纯净；原型状态会在 iframe 加载完成后由 postMessage 同步。
    if (window.location.protocol !== "file:") {
      url.searchParams.set("v", String(Date.now()));
      if (state.mode === "annotation") url.searchParams.set("prototypeMode", "annotation");
      if (state.scenarioId) {
        url.searchParams.set("prototypeScenario", state.scenarioId);
        url.hash = state.scenarioId;
      }
    }
    return url.href;
  }

  function postToPage(type, payload) {
    const frame = byId("prototype-frame");
    if (frame.contentWindow) frame.contentWindow.postMessage(Object.assign({ type }, payload || {}), "*");
  }

  function updateModeButtons() {
    document.querySelectorAll("[data-mode]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.mode === state.mode));
    });
  }

  function loadCurrentPage() {
    byId("prototype-frame").src = pageUrl(currentPage());
  }

  function deliverPendingHighlight() {
    if (!state.pendingChangeId) return;
    const changeId = state.pendingChangeId;
    state.pendingChangeId = "";
    window.setTimeout(() => postToPage("prototype:highlight", { changeId }), 0);
  }

  function appendChangeDetail(card, label, value) {
    if (!value) return;
    const row = create("div", undefined, "change-detail");
    row.append(create("span", label, "change-detail-label"), create("span", value, "change-detail-value"));
    card.appendChild(row);
  }

  function renderPageDetails(page) {
    const requirements = byId("page-requirements");
    requirements.replaceChildren();
    (page.requirements || []).forEach((requirement) => requirements.appendChild(create("span", requirement, "requirement-tag")));
    if (!requirements.childElementCount) requirements.appendChild(create("span", "未标注需求", "requirement-tag"));

    byId("page-overview").textContent = page.overview || page.summary || "";
    const flowSection = byId("page-flow-section");
    const flow = byId("page-flow");
    flow.replaceChildren();
    if (!page.flow || !Array.isArray(page.flow.steps) || !page.flow.steps.length) {
      flowSection.hidden = true;
      return;
    }
    flowSection.hidden = false;
    page.flow.steps.forEach((step, index) => {
      if (index) flow.appendChild(create("span", "→", "flow-arrow"));
      const item = create("span", step.title, "flow-step");
      if (step.id === page.flow.current) item.classList.add("current");
      flow.appendChild(item);
    });
  }

  function renderChanges(page) {
    const target = byId("change-list");
    target.replaceChildren();
    if (!page.changes.length) {
      target.appendChild(create("p", "本页没有新增或修改项。"));
      return;
    }
    page.changes.forEach((change) => {
      const card = create("article", undefined, "change-card");
      const copy = CHANGE_COPY[change.id] || {};
      const locateChange = () => locateChangeInPage(page, change, card);
      const locate = create("button", change.id);
      locate.type = "button";
      locate.addEventListener("click", (event) => { event.stopPropagation(); locateChange(); });
      card.addEventListener("click", locateChange);
      card.title = "点击定位到原型中的对应区域";
      card.appendChild(locate);
      appendChangeDetail(card, "功能", "新增/优化了“" + (copy.feature || change.action) + "”功能。");
      appendChangeDetail(card, "说明", copy.summary || ("功能实现了“" + (change.result || change.description || "页面交互") + "”。"));
      appendChangeDetail(card, "交互", copy.interaction || (change.action + "，" + (change.result || change.description || "完成页面响应。")));
      target.appendChild(card);
    });
  }

  function renderIllustration(page) {
    const image = byId("page-illustration");
    image.hidden = true;
    image.removeAttribute("src");
    image.alt = (page.overview || page.summary || page.title) + "示意图";
    image.onload = () => {
      if (state.currentPageId === page.id) image.hidden = false;
    };
    image.onerror = () => { image.hidden = true; };
    image.src = page.illustration;
  }

  function renderSceneControls(page) {
    const target = byId("scene-controls");
    target.replaceChildren();
    const states = pageStates(page);
    if (!states.length) {
      target.hidden = true;
      return;
    }
    target.hidden = false;
    target.appendChild(create("span", "关键状态", "scene-label"));
    const group = create("div", undefined, "scene-switcher");
    const entries = [{ id: "", title: "默认页面" }, ...states];
    entries.forEach((entry) => {
      const button = create("button", entry.title);
      button.type = "button";
      button.setAttribute("aria-pressed", String(entry.id === state.scenarioId));
      button.addEventListener("click", () => setScenario(entry.id));
      group.appendChild(button);
    });
    target.appendChild(group);
  }

  function setScenario(scenarioId) {
    const page = currentPage();
    if (scenarioId && !pageStates(page).some((item) => item.id === scenarioId)) return;
    state.scenarioId = scenarioId;
    renderSceneControls(page);
    loadCurrentPage();
  }

  function setViewport(viewport) {
    byId("viewport-shell").dataset.viewport = viewport;
    document.querySelectorAll("[data-viewport]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.viewport === viewport));
    });
  }

  function setMode(mode) {
    state.mode = mode;
    updateModeButtons();
    loadCurrentPage();
  }

  function locateChangeInPage(sourcePage, change, card) {
    const targetPage = pageById(change.pageId || sourcePage.id);
    if (!targetPage) return;
    const targetScenario = change.stateId || "";
    document.querySelectorAll(".change-card.is-locating").forEach((item) => item.classList.remove("is-locating"));
    card.classList.add("is-locating");
    state.pendingChangeId = change.id;
    const modeChanged = state.mode !== "annotation";
    if (modeChanged) {
      state.mode = "annotation";
      updateModeButtons();
    }
    if (targetPage.id !== state.currentPageId) {
      selectPage(targetPage.id, { scenarioId: targetScenario });
      return;
    }
    if (targetScenario !== state.scenarioId) {
      setScenario(targetScenario);
      return;
    }
    if (modeChanged) {
      loadCurrentPage();
      return;
    }
    deliverPendingHighlight();
  }

  function selectPage(pageId, options) {
    const entry = pageEntryById(pageId);
    const page = entry ? entry.page : undefined;
    if (!page) return;
    state.currentPageId = page.id;
    state.scenarioId = options && options.scenarioId ? options.scenarioId : (page.defaultScenario || "");
    byId("page-select").value = page.id;
    byId("current-page-title").textContent = pageLabel(page);
    renderPageDetails(page);
    setViewport(page.viewport === "H5" ? "mobile" : "desktop");
    renderIllustration(page);
    renderChanges(page);
    renderSceneControls(page);
    loadCurrentPage();
    document.querySelectorAll(".page-link, .page-group-link").forEach((button) => {
      if (button.dataset.pageId === page.id) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    const activeGroupIds = new Set(entry && Array.isArray(entry.ancestors)
      ? entry.ancestors.map((ancestor) => ancestor.id)
      : []);
    document.querySelectorAll(".page-group-link").forEach((button) => {
      const active = activeGroupIds.has(button.dataset.groupId) || button.dataset.groupId === page.id;
      button.classList.toggle("is-active", Boolean(active));
      button.setAttribute("aria-expanded", String(Boolean(active)));
    });
  }

  function annotationWidthBounds(layout) {
    const style = getComputedStyle(layout);
    const padding = (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0);
    const gap = parseFloat(style.columnGap) || 0;
    const navigationWidth = layout.classList.contains("single-page") ? 0 : 210;
    const columnCount = layout.classList.contains("single-page") ? 3 : 4;
    const minStageWidth = parseFloat(style.getPropertyValue("--prototype-min-width")) || 260;
    return {
      min: MIN_ANNOTATION_WIDTH,
      max: Math.max(MIN_ANNOTATION_WIDTH, Math.floor(layout.clientWidth - padding - gap * (columnCount - 1) - navigationWidth - RESIZER_WIDTH - minStageWidth))
    };
  }

  function applyAnnotationLayout() {
    const layout = document.querySelector(".prototype-layout");
    layout.classList.toggle("annotations-hidden", !state.annotationsVisible);
    if (state.annotationsVisible) {
      const bounds = annotationWidthBounds(layout);
      state.annotationWidth = Math.max(bounds.min, Math.min(bounds.max, state.annotationWidth));
    }
    layout.style.setProperty("--annotation-width", state.annotationWidth + "px");
    const toggle = byId("toggle-annotations");
    toggle.textContent = state.annotationsVisible ? "隐藏注释" : "显示注释";
    toggle.setAttribute("aria-pressed", String(state.annotationsVisible));
  }

  function startResize(event) {
    if (window.innerWidth <= 1050) return;
    const layout = document.querySelector(".prototype-layout");
    const startX = event.clientX;
    const startWidth = state.annotationWidth;
    const bounds = annotationWidthBounds(layout);
    const move = (moveEvent) => {
      state.annotationWidth = Math.max(bounds.min, Math.min(bounds.max, startWidth + startX - moveEvent.clientX));
      applyAnnotationLayout();
    };
    const end = () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", end);
      document.body.classList.remove("annotation-resizing");
    };
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", end, { once: true });
    document.body.classList.add("annotation-resizing");
    event.preventDefault();
  }

  function buildNavigation() {
    const select = byId("page-select");
    const nav = byId("page-nav");
    const firstPageId = (page) => {
      if (!page) return "";
      if (page.file) return page.id;
      const children = Array.isArray(page.children) ? page.children : [];
      for (const child of children) {
        const id = firstPageId(child);
        if (id) return id;
      }
      return "";
    };
    const appendPageOption = (page, parent, labels) => {
      const nextLabels = (labels || []).concat(page.title);
      if (page.file) {
        const option = create("option", (labels && labels.length) ? nextLabels.join(" / ") : page.title);
        option.value = page.id;
        parent.appendChild(option);
      }
      if (Array.isArray(page.children)) {
        page.children.forEach((child) => appendPageOption(child, parent, nextLabels));
      }
    };
    const appendPageLink = (page, parent, depth) => {
      const button = create("button", depth ? page.title : page.id + " · " + page.title, "page-link");
      button.type = "button";
      button.dataset.pageId = page.id;
      if (depth) button.classList.add("page-child-link");
      button.addEventListener("click", () => selectPage(page.id));
      parent.appendChild(button);
    };
    const appendNavNode = (page, parent, depth) => {
      const children = Array.isArray(page.children) ? page.children : [];
      if (!children.length) {
        appendPageLink(page, parent, depth);
        return;
      }
      const group = create("div", undefined, "page-group");
      group.classList.add("page-group-level-" + depth);
      const groupButton = create("button", depth ? page.title : page.id + " · " + page.title, "page-group-link");
      groupButton.type = "button";
      groupButton.dataset.groupId = page.id;
      if (page.file) {
        groupButton.dataset.pageId = page.id;
        groupButton.classList.add("page-group-page-link");
      }
      groupButton.setAttribute("aria-expanded", "false");
      groupButton.addEventListener("click", () => selectPage(page.file ? page.id : firstPageId(page)));
      group.appendChild(groupButton);
      const childContainer = create("div", undefined, "page-group-children");
      children.forEach((child) => appendNavNode(child, childContainer, depth + 1));
      group.appendChild(childContainer);
      parent.appendChild(group);
    };
    data.pages.forEach((page) => {
      if (Array.isArray(page.children) && page.children.length) {
        const optionGroup = create("optgroup");
        optionGroup.label = page.id + " · " + page.title;
        page.children.forEach((child) => {
          appendPageOption(child, optionGroup, []);
        });
        select.appendChild(optionGroup);
        appendNavNode(page, nav, 0);
        return;
      }
      appendPageOption(page, select, []);
      appendNavNode(page, nav, 0);
    });
    document.querySelector(".prototype-layout").classList.toggle("single-page", leafPageEntries().length === 1);
  }

  function start() {
    if (!data || !Array.isArray(data.pages) || !data.pages.length) {
      document.body.replaceChildren(create("p", "prototype-data.js 中没有可展示的页面。"));
      return;
    }
    byId("project-name").textContent = data.project;
    byId("project-version").textContent = data.version;
    byId("generated-at").textContent = data.generatedAt ? new Date(data.generatedAt).toLocaleString("zh-CN") : "";
    buildNavigation();
    applyAnnotationLayout();
    byId("prototype-frame").addEventListener("load", () => {
      postToPage("prototype:set-mode", { mode: state.mode });
      if (state.scenarioId) postToPage("prototype:scenario", { scenarioId: state.scenarioId });
      else postToPage("prototype:reset");
      deliverPendingHighlight();
    });
    selectPage(state.currentPageId);
    byId("page-select").addEventListener("change", (event) => selectPage(event.target.value));
    document.querySelectorAll("[data-viewport]").forEach((button) => button.addEventListener("click", () => setViewport(button.dataset.viewport)));
    document.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () => setMode(button.dataset.mode)));
    byId("reset-page").addEventListener("click", () => selectPage(state.currentPageId));
    byId("open-page").addEventListener("click", () => window.open(pageUrl(currentPage()), "_blank", "noopener"));
    window.addEventListener("message", (event) => {
      const message = event.data || {};
      if (message.type === "prototype:select-page") selectPage(message.pageId);
    });
    byId("toggle-annotations").addEventListener("click", () => {
      state.annotationsVisible = !state.annotationsVisible;
      applyAnnotationLayout();
    });
    byId("annotation-resizer").addEventListener("pointerdown", startResize);
    window.addEventListener("resize", applyAnnotationLayout);
  }

  start();
})();
