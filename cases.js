const shareButton = document.querySelector("[data-share]");
const toast = document.querySelector(".case-toast");
let toastTimer;

function setupStyleCatalog(catalog, catalogIndex) {
  const panels = [...catalog.querySelectorAll(".reference-style")];
  if (panels.length < 2) return;

  const tablist = document.createElement("div");
  tablist.className = "reference-tabs";
  tablist.setAttribute("role", "tablist");
  tablist.setAttribute("aria-label", catalog.dataset.catalogLabel || "选择工服款式");
  if (catalog.classList.contains("project-catalog")) {
    tablist.classList.add("reference-tabs--project");
    tablist.style.setProperty("--project-tab-columns", String(Math.min(panels.length, 3)));
  }

  const tabs = panels.map((panel, index) => {
    const number = String(index + 1).padStart(2, "0");
    const label = panel.dataset.styleLabel || panel.querySelector("h3")?.textContent?.trim() || `款式 ${number}`;
    const tab = document.createElement("button");
    const numberNode = document.createElement("span");
    const labelNode = document.createElement("b");

    tab.type = "button";
    tab.className = "reference-tab";
    tab.id = `caseStyleTab-${catalogIndex}-${index}`;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", `caseStylePanel-${catalogIndex}-${index}`);
    tab.setAttribute("aria-label", `款式 ${number}，${label}`);

    numberNode.textContent = number;
    labelNode.textContent = label;
    tab.append(numberNode, labelNode);
    tablist.append(tab);

    panel.id = `caseStylePanel-${catalogIndex}-${index}`;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", tab.id);
    panel.setAttribute("tabindex", "0");
    return tab;
  });

  function selectStyle(nextIndex, { focus = false, updateHash = false } = {}) {
    const index = Math.max(0, Math.min(Math.trunc(nextIndex), panels.length - 1));

    tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === index;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[tabIndex].classList.toggle("is-active", selected);
      panels[tabIndex].hidden = !selected;
    });

    if (focus) tabs[index].focus();
    if (updateHash && window.location.protocol !== "file:") {
      const url = new URL(window.location.href);
      url.searchParams.set("style", String(index + 1));
      history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectStyle(index, { updateHash: true }));
    tab.addEventListener("keydown", (event) => {
      let nextIndex;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      if (nextIndex === undefined) return;
      event.preventDefault();
      selectStyle(nextIndex, { focus: true, updateHash: true });
    });
  });

  catalog.before(tablist);
  catalog.dataset.enhanced = "true";
  const requestedStyle = Number(new URL(window.location.href).searchParams.get("style"));
  selectStyle(Number.isInteger(requestedStyle) && requestedStyle >= 1 && requestedStyle <= panels.length ? requestedStyle - 1 : 0);
}

document.querySelectorAll("[data-style-catalog]").forEach(setupStyleCatalog);

const photoDialog = document.querySelector(".photo-dialog");
if (photoDialog && typeof photoDialog.showModal === "function") {
  const dialogImage = photoDialog.querySelector("img");
  const dialogCaption = photoDialog.querySelector("figcaption");
  const closePhoto = photoDialog.querySelector(".photo-dialog-close");
  let photoOpener;

  document.querySelectorAll("[data-photo]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      photoOpener = link;
      dialogImage.src = link.href;
      dialogImage.alt = link.querySelector("img").alt;
      dialogCaption.textContent = link.dataset.photoCaption;
      photoDialog.showModal();
      document.body.classList.add("is-photo-open");
      closePhoto.focus();
    });
  });

  closePhoto.addEventListener("click", () => photoDialog.close());
  photoDialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      photoDialog.close();
    }
  });
  photoDialog.addEventListener("click", (event) => {
    if (event.target === photoDialog) photoDialog.close();
  });
  photoDialog.addEventListener("close", () => {
    document.body.classList.remove("is-photo-open");
    dialogImage.removeAttribute("src");
    photoOpener?.focus({ preventScroll: true });
  });
}

function showToast(message) {
  if (!toast) return;
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

async function copyCurrentLink() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    showToast("案例链接已复制，可直接发送给客户");
  } catch {
    const input = document.createElement("textarea");
    input.value = window.location.href;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.append(input);
    input.select();
    const copied = document.execCommand("copy");
    input.remove();
    showToast(copied ? "案例链接已复制，可直接发送给客户" : "请复制浏览器地址分享");
  }
}

shareButton?.addEventListener("click", async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: document.title,
        text: document.querySelector('meta[name="description"]')?.content || document.title,
        url: window.location.href,
      });
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }
  await copyCurrentLink();
});
