const shareButton = document.querySelector("[data-share]");
const toast = document.querySelector(".case-toast");
let toastTimer;

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
        text: "腾讯企业工服概念提案（展示样例，非真实合作案例）",
        url: window.location.href,
      });
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }
  await copyCurrentLink();
});
