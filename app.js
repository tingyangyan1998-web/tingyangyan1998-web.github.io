const UNIFORMS = [
  {
    code: "WL-01",
    name: "灰蓝双排扣裤装",
    shortName: "灰蓝裤装",
    description: "柔和灰蓝色调搭配双排扣收腰廓形，兼顾专业感与亲和力，适合需要高识别度的企业服务岗位。",
    applications: ["行政接待", "商务会务", "企业讲解"],
    product: {
      color: "柔和灰蓝",
      combination: "双排扣外套 + 西裤",
      silhouette: "双排扣 · 收腰廓形",
      material: "挺括、抗皱的职业装面料",
      season: "春秋及空调环境",
      customization: "面料 / 颜色 / 企业标识 / 尺码",
    },
  },
  {
    code: "WL-02",
    name: "深海军蓝单排扣裤装",
    shortName: "海军蓝裤装",
    description: "深海军蓝单排扣套装搭配浅雾蓝飘带领，沉稳利落，在正式商务环境中呈现可信赖的管理者形象。",
    applications: ["客户洽谈", "管理岗位", "正式会议"],
    product: {
      color: "深海军蓝 + 浅雾蓝",
      combination: "单排扣外套 + 西裤",
      silhouette: "单排扣 · 翻领收腰",
      material: "耐磨、抗皱的职业装面料",
      season: "春秋及正式室内场合",
      customization: "面料 / 颜色 / 企业标识 / 尺码",
    },
  },
  {
    code: "WL-03",
    name: "米杏色无领裙装",
    shortName: "米杏裙装",
    description: "温暖米杏色无领西装与同色直筒裙形成轻盈、优雅的整体形象，适合重视亲和感与礼仪感的岗位。",
    applications: ["前台接待", "礼宾服务", "品牌活动"],
    product: {
      color: "柔和米杏",
      combination: "无领外套 + 直筒裙",
      silhouette: "无领设计 · 收腰线条",
      material: "柔和、垂顺的职业装面料",
      season: "春夏及温暖室内环境",
      customization: "面料 / 颜色 / 企业标识 / 尺码",
    },
  },
  {
    code: "WL-04",
    name: "炭灰拼浅蓝立领裤装",
    shortName: "炭灰裤装",
    description: "炭灰立领套装以浅蓝细窄滚边提亮，线条克制而有辨识度，为专业讲解与技术服务场景增添现代感。",
    applications: ["展厅讲解", "项目接待", "专业服务"],
    product: {
      color: "炭灰 + 浅蓝滚边",
      combination: "立领外套 + 西裤",
      silhouette: "立领设计 · 拼色滚边",
      material: "挺括、耐磨的职业装面料",
      season: "秋冬及空调环境",
      customization: "面料 / 颜色 / 企业标识 / 尺码",
    },
  },
];

const SCENES = [
  { key: "meeting", name: "会议室", phrase: "现代会议室" },
  { key: "lobby", name: "总部大堂", phrase: "企业总部大堂" },
  { key: "presentation", name: "讲解场景", phrase: "企业展厅讲解场景" },
];

const elements = {
  heroImage: document.querySelector("#heroImage"),
  imageLoader: document.querySelector("#imageLoader"),
  badgeCode: document.querySelector("#badgeCode"),
  badgeScene: document.querySelector("#badgeScene"),
  imageCount: document.querySelector("#imageCount"),
  styleNumber: document.querySelector("#styleNumber"),
  styleName: document.querySelector("#styleName"),
  styleCode: document.querySelector("#styleCode"),
  styleDescription: document.querySelector("#styleDescription"),
  applications: document.querySelector("#applications"),
  productInfoName: document.querySelector("#productInfoName"),
  productInfoCode: document.querySelector("#productInfoCode"),
  productColor: document.querySelector("#productColor"),
  productCombination: document.querySelector("#productCombination"),
  productSilhouette: document.querySelector("#productSilhouette"),
  productMaterial: document.querySelector("#productMaterial"),
  productSeason: document.querySelector("#productSeason"),
  productCustomization: document.querySelector("#productCustomization"),
  styleOptions: document.querySelector("#styleOptions"),
  styleButtons: [...document.querySelectorAll(".style-option")],
  sceneButtons: [...document.querySelectorAll(".scene-option")],
  prevScene: document.querySelector("#prevScene"),
  nextScene: document.querySelector("#nextScene"),
  shareButton: document.querySelector("#shareButton"),
  toast: document.querySelector("#toast"),
  announcement: document.querySelector("#changeAnnouncement"),
};

let activeStyle = 0;
let activeScene = 1;
let toastTimer;
let touchStartX = 0;
let touchStartY = 0;

function imagePath(styleIndex, sceneIndex) {
  const styleNumber = String(styleIndex + 1).padStart(2, "0");
  return `uniform-${styleNumber}-${SCENES[sceneIndex].key}.jpg`;
}

function clampStyle(value) {
  return Number.isInteger(value) && value >= 0 && value < UNIFORMS.length ? value : 0;
}

function sceneIndexFromKey(key) {
  const index = SCENES.findIndex((scene) => scene.key === key);
  return index >= 0 ? index : 1;
}

function readHash() {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const style = Number.parseInt(params.get("style") || "1", 10) - 1;
  return {
    style: clampStyle(style),
    scene: sceneIndexFromKey(params.get("scene")),
  };
}

function writeHash() {
  const hash = `style=${activeStyle + 1}&scene=${SCENES[activeScene].key}`;
  if (window.location.protocol === "file:") {
    if (window.location.hash !== `#${hash}`) window.location.hash = hash;
    return;
  }
  const url = `${window.location.pathname}${window.location.search}#${hash}`;
  window.history.replaceState(null, "", url);
}

function setPressedState(buttons, activeIndex) {
  buttons.forEach((button, index) => {
    const isActive = index === activeIndex;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function updateContent({ announce = true, updateUrl = true } = {}) {
  const uniform = UNIFORMS[activeStyle];
  const scene = SCENES[activeScene];
  const source = imagePath(activeStyle, activeScene);
  const alt = `${uniform.name}在${scene.phrase}的全身上身效果`;

  elements.styleNumber.textContent = String(activeStyle + 1).padStart(2, "0");
  elements.styleName.textContent = uniform.name;
  elements.styleCode.textContent = uniform.code;
  elements.badgeCode.textContent = uniform.code;
  elements.badgeScene.textContent = scene.name;
  elements.styleDescription.textContent = uniform.description;
  elements.imageCount.textContent = `${String(activeScene + 1).padStart(2, "0")} / ${String(SCENES.length).padStart(2, "0")}`;
  elements.applications.replaceChildren(
    ...uniform.applications.map((label) => {
      const tag = document.createElement("span");
      tag.textContent = label;
      return tag;
    }),
  );
  elements.productInfoName.textContent = uniform.name;
  elements.productInfoCode.textContent = uniform.code;
  elements.productColor.textContent = uniform.product.color;
  elements.productCombination.textContent = uniform.product.combination;
  elements.productSilhouette.textContent = uniform.product.silhouette;
  elements.productMaterial.textContent = uniform.product.material;
  elements.productSeason.textContent = uniform.product.season;
  elements.productCustomization.textContent = uniform.product.customization;

  setPressedState(elements.styleButtons, activeStyle);
  setPressedState(elements.sceneButtons, activeScene);
  const activeStyleButton = elements.styleButtons[activeStyle];
  if (activeStyleButton && elements.styleOptions.scrollWidth > elements.styleOptions.clientWidth) {
    const centeredLeft = activeStyleButton.offsetLeft
      - (elements.styleOptions.clientWidth - activeStyleButton.offsetWidth) / 2;
    elements.styleOptions.scrollTo({ left: Math.max(0, centeredLeft), behavior: "smooth" });
  }

  if (elements.heroImage.getAttribute("src") !== source) {
    elements.heroImage.classList.add("is-switching");
    elements.imageLoader.classList.add("is-visible");
    const preload = new Image();
    preload.onload = () => {
      elements.heroImage.src = source;
      elements.heroImage.alt = alt;
      elements.heroImage.classList.remove("is-switching");
      elements.imageLoader.classList.remove("is-visible");
    };
    preload.onerror = () => {
      elements.heroImage.classList.remove("is-switching");
      elements.imageLoader.classList.remove("is-visible");
      showToast("图片加载失败，请刷新后重试");
    };
    preload.src = source;
  } else {
    elements.heroImage.alt = alt;
  }

  if (updateUrl) writeHash();
  if (announce) elements.announcement.textContent = `已切换至${uniform.name}，${scene.name}`;
  preloadNearby();
}

function selectStyle(index) {
  activeStyle = (index + UNIFORMS.length) % UNIFORMS.length;
  updateContent();
}

function selectScene(index) {
  activeScene = (index + SCENES.length) % SCENES.length;
  updateContent();
}

function preloadNearby() {
  const sources = [
    imagePath(activeStyle, (activeScene + 1) % SCENES.length),
    imagePath(activeStyle, (activeScene - 1 + SCENES.length) % SCENES.length),
    imagePath((activeStyle + 1) % UNIFORMS.length, activeScene),
  ];
  sources.forEach((source) => {
    const image = new Image();
    image.src = source;
  });
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 2200);
}

async function copyLink() {
  const link = window.location.href;
  try {
    await navigator.clipboard.writeText(link);
    showToast("链接已复制，可发送给客户查看");
  } catch {
    const input = document.createElement("textarea");
    input.value = link;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.append(input);
    input.select();
    const copied = document.execCommand("copy");
    input.remove();
    showToast(copied ? "链接已复制，可发送给客户查看" : "请复制浏览器地址分享");
  }
}

async function shareCurrentView() {
  if (window.location.protocol === "file:") {
    showToast("离线版仅供本机浏览；分享给他人请发送整个压缩包");
    return;
  }
  const uniform = UNIFORMS[activeStyle];
  const scene = SCENES[activeScene];
  if (navigator.share) {
    try {
      await navigator.share({
        title: `定制工服画册｜${uniform.name}`,
        text: `${uniform.name} · ${scene.name}上身效果`,
        url: window.location.href,
      });
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }
  await copyLink();
}

elements.styleButtons.forEach((button) => {
  button.addEventListener("click", () => selectStyle(Number(button.dataset.style)));
});

elements.sceneButtons.forEach((button) => {
  button.addEventListener("click", () => selectScene(sceneIndexFromKey(button.dataset.scene)));
});

elements.prevScene.addEventListener("click", () => selectScene(activeScene - 1));
elements.nextScene.addEventListener("click", () => selectScene(activeScene + 1));
elements.shareButton.addEventListener("click", shareCurrentView);

document.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  const action = {
    ArrowLeft: () => selectScene(activeScene - 1),
    ArrowRight: () => selectScene(activeScene + 1),
    ArrowUp: () => selectStyle(activeStyle - 1),
    ArrowDown: () => selectStyle(activeStyle + 1),
    Home: () => selectStyle(0),
    End: () => selectStyle(UNIFORMS.length - 1),
  }[event.key];
  if (!action) return;
  event.preventDefault();
  action();
});

elements.heroImage.addEventListener("touchstart", (event) => {
  const touch = event.changedTouches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}, { passive: true });

elements.heroImage.addEventListener("touchend", (event) => {
  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;
  if (Math.abs(deltaX) < 45 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
  selectScene(activeScene + (deltaX < 0 ? 1 : -1));
}, { passive: true });

window.addEventListener("hashchange", () => {
  const state = readHash();
  activeStyle = state.style;
  activeScene = state.scene;
  updateContent({ announce: true, updateUrl: false });
});

const initialState = readHash();
activeStyle = initialState.style;
activeScene = initialState.scene;
updateContent({ announce: false });
