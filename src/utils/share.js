// Share & Notification Utility — Laxman & Abi Engagement Invitation

export function initShare() {
  const btnShare = document.getElementById('btn-share');
  const btnWhatsApp = document.getElementById('btn-whatsapp');
  const btnMaps = document.getElementById('btn-maps');

  const shareText = "Laxman & Abi's Engagement — 21 October 2026, Eden Garden, Tirunelveli";
  const shareUrl = window.location.href;

  if (btnShare) {
    btnShare.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Laxman & Abi — Engagement Invitation",
            text: shareText,
            url: shareUrl
          });
        } catch (e) {
          copyToClipboard(shareUrl);
        }
      } else {
        copyToClipboard(shareUrl);
      }
    });
  }

  if (btnWhatsApp) {
    btnWhatsApp.addEventListener('click', () => {
      const waText = encodeURIComponent(`Laxman & Abi are getting engaged!\n📅 21 October 2026 | 6:30 PM - 9:00 PM\n📍 Eden Garden, Tirunelveli\n\nJoin the celebration: ${shareUrl}`);
      window.open(`https://api.whatsapp.com/send?text=${waText}`, '_blank');
    });
  }

  if (btnMaps) {
    btnMaps.addEventListener('click', () => {
      window.open("https://www.google.com/maps/search/?api=1&query=Eden+Garden+Tirunelveli", '_blank');
    });
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast("Invitation link copied!");
  }).catch(() => {
    showToast("Invitation link copied!");
  });
}

export function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
