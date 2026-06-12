const titles = {
  overview: "工作台",
  review: "合同审查",
  knowledge: "企业法律知识库",
  legalqa: "AI 法律问答",
  approval: "审批协同",
  dashboard: "风险看板",
};

const contractData = {
  采购框架协议: {
    score: 86,
    sub: "采购框架协议 · 6 项风险",
    points: ["付款周期超出公司采购合同基准 45 天", "违约责任上限缺失，存在无限责任风险", "交付物知识产权归属表述不明确"],
  },
  "SaaS 服务订阅协议": {
    score: 72,
    sub: "SaaS 服务订阅协议 · 4 项风险",
    points: ["SLA 未定义可用性口径", "数据处理责任边界不清晰", "自动续费缺少提前通知机制"],
  },
  渠道合作协议: {
    score: 38,
    sub: "渠道合作协议 · 1 项风险",
    points: ["建议补充反商业贿赂条款", "渠道返利计算方式建议增加示例", "模板匹配度较高，可进入快速审批"],
  },
};

const files = [
  {
    name: "销售合同模板 V4.1.docx",
    type: "合同模板",
    detail: "标题、目录、12 个小标题已识别",
    tags: ["付款", "违约", "知识产权", "销售"],
  },
  {
    name: "合同审批制度 2026.docx",
    type: "制度文件",
    detail: "8 个章节，36 条审批规则",
    tags: ["审批", "权限", "财务", "法务"],
  },
  {
    name: "逾期付款争议案例集.docx",
    type: "历史案例",
    detail: "23 个案例，已抽取裁判要点",
    tags: ["逾期付款", "违约金", "证据"],
  },
  {
    name: "民法典合同编重点条款.docx",
    type: "法律法规",
    detail: "法规条文与企业规则已关联",
    tags: ["民法典", "合同编", "法规"],
  },
];

const qaItems = [
  {
    q: "客户要求 120 天付款周期，可以通过吗？",
    a: "不建议直接通过。公司标准付款周期为 30-60 天；超过 90 天需要财务负责人和法务负责人共同审批，并建议设置逾期利息或暂停服务权。",
    source: "合同审批制度 2026 版 · 第 3.4 条",
  },
  {
    q: "对方要求独家授权，重点看什么？",
    a: "重点看授权范围、排他期限、地域范围、最低业绩承诺、退出机制和衍生成果归属。涉及核心产品能力时，不建议永久独家授权。",
    source: "知识产权条款审查清单 · 第 2.1-2.5 条",
  },
  {
    q: "合同没有违约责任上限，有什么风险？",
    a: "可能导致赔偿责任不可控。建议设置责任上限，并对故意、重大过失、保密义务、知识产权侵权等例外情形单独约定。",
    source: "采购合同审查指引 · 第 4.3 条",
  },
  {
    q: "SaaS 合同的数据条款要审哪些点？",
    a: "需要审查数据控制者/处理者角色、数据使用范围、跨境传输、删除机制、安全事件通知时限和客户数据归属。",
    source: "数据处理协议模板 · 第 1-6 条",
  },
  {
    q: "NDA 保密期限一般多久合适？",
    a: "普通商业信息可约定 2-5 年；商业秘密建议约定至其不再构成商业秘密为止，并明确返还、销毁和例外披露场景。",
    source: "保密协议模板 V2.8 · 第 5 条",
  },
  {
    q: "对方只接受电子签，是否有效？",
    a: "通常有效，但需确认签署主体实名认证、签署意愿、签名可靠性和存证链路。重大合同建议使用公司认可的电子签平台。",
    source: "电子签管理办法 · 第 2.2 条",
  },
  {
    q: "争议解决条款选仲裁还是诉讼？",
    a: "金额较高、保密性要求高或跨区域履约可优先考虑仲裁；标准销售合同通常选择公司所在地有管辖权法院更便于执行。",
    source: "争议解决条款配置规则 · 第 1.3 条",
  },
  {
    q: "业务口头承诺写进补充协议可以吗？",
    a: "可以，但必须确认承诺内容、授权人权限、成本影响和主合同冲突。涉及价格、交付、赔偿的承诺需走补充协议审批。",
    source: "合同变更管理制度 · 第 4.1 条",
  },
  {
    q: "合同模板可以让业务自行修改吗？",
    a: "可开放低风险字段，如金额、期限、联系人；涉及付款、违约、知识产权、数据安全的核心条款应锁定或触发法务复核。",
    source: "模板权限配置规则 · 第 2.6 条",
  },
  {
    q: "供应商要求预付款 80%，怎么判断？",
    a: "需结合供应商信用、交付验收节点、担保措施和历史合作记录判断。建议拆分为里程碑付款，并保留验收后尾款。",
    source: "采购付款风险规则 · 第 3.2 条",
  },
];

const navItems = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view");
const pageTitle = document.getElementById("pageTitle");
const toast = document.getElementById("toast");
const roleSelect = document.getElementById("roleSelect");
let currentRole = roleSelect.value;
let selectedDocType = "合同模板";

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function setView(viewName) {
  if (currentRole === "business" && viewName === "knowledge") {
    showToast("业务角色无权访问企业法律知识库");
    viewName = "overview";
  }

  navItems.forEach((item) => item.classList.toggle("active", item.dataset.view === viewName));
  views.forEach((view) => view.classList.toggle("active", view.id === viewName));
  pageTitle.textContent = titles[viewName];
}

function applyRole(role) {
  currentRole = role;
  document.querySelectorAll(".legal-only").forEach((node) => {
    node.classList.toggle("hidden-by-role", role === "business");
  });

  if (role === "business" && document.getElementById("knowledge").classList.contains("active")) {
    setView("overview");
  }

  showToast(role === "legal" ? "已切换为法务角色，可访问企业法律知识库" : "已切换为业务角色，知识库模块已隐藏");
}

function renderFiles(activeIndex = 0) {
  const fileList = document.getElementById("fileList");
  fileList.innerHTML = files
    .map(
      (file, index) => `
        <button class="file-item ${index === activeIndex ? "active" : ""}" data-file-index="${index}">
          <span class="file-icon">W</span>
          <span>
            <strong>${file.name}</strong>
            <span>${file.type} · ${file.detail}</span>
          </span>
        </button>
      `,
    )
    .join("");
  renderFilePreview(activeIndex);
}

function renderFilePreview(index) {
  const file = files[index];
  document.getElementById("filePreview").innerHTML = `
    <div class="preview-page">
      <div class="preview-title">${file.name}</div>
      <div class="preview-line"></div>
      <div class="preview-line"></div>
      <div class="preview-line short"></div>
      <p>${file.detail}</p>
      <div class="preview-tags">${file.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
    </div>
  `;
}

function renderQA() {
  document.getElementById("qaGrid").innerHTML = qaItems
    .map(
      (item, index) => `
        <button class="qa-card" data-qa-index="${index}">
          <strong>Q${index + 1}. ${item.q}</strong>
          <span>${item.a.slice(0, 44)}...</span>
        </button>
      `,
    )
    .join("");
}

function addAnswer(question, answer, source) {
  const chatWindow = document.getElementById("chatWindow");
  chatWindow.insertAdjacentHTML("beforeend", `<div class="message user">${question}</div>`);
  chatWindow.insertAdjacentHTML("beforeend", `<div class="message ai">${answer}<div class="source">来源：${source}</div></div>`);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

navItems.forEach((item) => {
  item.addEventListener("click", () => setView(item.dataset.view));
});

document.querySelectorAll("[data-view-jump]").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.viewJump));
});

roleSelect.addEventListener("change", () => applyRole(roleSelect.value));

document.querySelectorAll(".contract-row").forEach((row) => {
  row.addEventListener("click", () => {
    document.querySelectorAll(".contract-row").forEach((item) => item.classList.remove("selected"));
    row.classList.add("selected");

    const data = contractData[row.dataset.contract];
    document.getElementById("riskScore").textContent = data.score;
    document.getElementById("summarySub").textContent = data.sub;
    document.getElementById("summaryList").innerHTML = data.points.map((point) => `<li>${point}</li>`).join("");
    showToast(`已切换到：${row.dataset.contract}`);
  });
});

document.getElementById("uploadBox").addEventListener("click", () => {
  const steps = document.querySelectorAll("#aiProgress .progress-step");
  steps.forEach((step) => step.classList.remove("done", "active"));
  let index = 0;

  const timer = window.setInterval(() => {
    steps.forEach((step, stepIndex) => {
      step.classList.toggle("done", stepIndex < index);
      step.classList.toggle("active", stepIndex === index);
    });
    index += 1;
    if (index > steps.length) {
      window.clearInterval(timer);
      steps.forEach((step) => {
        step.classList.remove("active");
        step.classList.add("done");
      });
      showToast("示例合同审查完成，已生成 2 条重点意见");
    }
  }, 650);
});

document.querySelectorAll(".apply-suggestion").forEach((button) => {
  button.addEventListener("click", () => {
    button.textContent = "已采纳";
    button.disabled = true;
    showToast("已采纳建议，生成修订条款");
  });
});

document.querySelectorAll(".kb-type").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".kb-type").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    selectedDocType = button.dataset.docType;
    showToast(`当前上传类型：${selectedDocType}`);
  });
});

document.getElementById("kbUploader").addEventListener("click", () => {
  const steps = document.querySelectorAll(".kb-step");
  steps.forEach((step) => step.classList.remove("done", "active"));
  let index = 0;

  const timer = window.setInterval(() => {
    steps.forEach((step, stepIndex) => {
      step.classList.toggle("done", stepIndex < index);
      step.classList.toggle("active", stepIndex === index);
    });

    if (index === 1) {
      window.clearInterval(timer);
      document.getElementById("kbErrorModal").classList.add("show");
      return;
    }

    index += 1;
  }, 700);
});

document.getElementById("cancelFix").addEventListener("click", () => {
  document.getElementById("kbErrorModal").classList.remove("show");
  showToast("已保留错误任务，可稍后继续处理");
});

document.getElementById("confirmFix").addEventListener("click", () => {
  document.getElementById("kbErrorModal").classList.remove("show");
  const steps = document.querySelectorAll(".kb-step");
  let index = 1;

  const timer = window.setInterval(() => {
    steps.forEach((step, stepIndex) => {
      step.classList.toggle("done", stepIndex <= index);
      step.classList.toggle("active", stepIndex === index + 1);
    });
    index += 1;

    if (index >= steps.length) {
      window.clearInterval(timer);
      steps.forEach((step) => {
        step.classList.remove("active");
        step.classList.add("done");
      });
      files.unshift({
        name: `${selectedDocType}导入示例.docx`,
        type: selectedDocType,
        detail: "已完成切分、标签化与向量化",
        tags: [selectedDocType, "新上传", "已入库"],
      });
      renderFiles(0);
      showToast("已修改并覆盖解析结果，文件入库完成");
    }
  }, 650);
});

document.getElementById("fileList").addEventListener("click", (event) => {
  const item = event.target.closest(".file-item");
  if (!item) return;
  const index = Number(item.dataset.fileIndex);
  document.querySelectorAll(".file-item").forEach((node) => node.classList.remove("active"));
  item.classList.add("active");
  renderFilePreview(index);
});

document.getElementById("semanticSearch").addEventListener("click", () => {
  document.getElementById("searchResult").textContent =
    "命中 3 条知识片段：销售合同模板 V4.1 第 6.2 条、合同审批制度 2026 版第 3.4 条、逾期付款争议案例集第 12 例。";
  showToast("语义检索完成，已按相关度排序");
});

document.getElementById("qaGrid").addEventListener("click", (event) => {
  const card = event.target.closest(".qa-card");
  if (!card) return;
  const item = qaItems[Number(card.dataset.qaIndex)];
  addAnswer(item.q, item.a, item.source);
});

document.getElementById("askButton").addEventListener("click", () => {
  const input = document.getElementById("questionInput");
  const question = input.value.trim();
  if (!question) return;
  addAnswer(question, qaItems[1].a, qaItems[1].source);
  input.value = "";
});

let flowIndex = 2;
document.getElementById("advanceFlow").addEventListener("click", () => {
  const steps = document.querySelectorAll(".timeline-step");
  if (flowIndex >= steps.length) {
    showToast("流程已完成，合同进入归档沉淀");
    return;
  }

  steps[flowIndex].classList.remove("active");
  steps[flowIndex].classList.add("complete");
  flowIndex += 1;
  if (flowIndex < steps.length) {
    steps[flowIndex].classList.add("active");
  }
  showToast("审批节点已推进");
});

document.getElementById("openDemo").addEventListener("click", () => {
  const sequence = currentRole === "legal" ? ["review", "knowledge", "legalqa", "approval", "dashboard", "overview"] : ["review", "legalqa", "approval", "dashboard", "overview"];
  let index = 0;
  showToast("开始演示核心流程");
  const timer = window.setInterval(() => {
    setView(sequence[index]);
    index += 1;
    if (index === sequence.length) {
      window.clearInterval(timer);
    }
  }, 1200);
});

renderFiles();
renderQA();
applyRole(currentRole);
