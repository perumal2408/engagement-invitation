// Calendar Utility — Laxman & Abi Engagement Invitation

export function initCalendar() {
  const btnCalendar = document.getElementById('btn-calendar');
  if (!btnCalendar) return;

  btnCalendar.addEventListener('click', () => {
    downloadICSFile();
  });
}

export function openGoogleCalendar() {
  const title = encodeURIComponent("Laxman & Abi — Engagement Celebration");
  const details = encodeURIComponent("Join Laxman & Abi as they celebrate their engagement at Eden Garden, Tirunelveli.");
  const location = encodeURIComponent("Eden Garden, Tirunelveli, Tamil Nadu, India");
  // 21 Oct 2026 18:30 IST = 20261021T130000Z to 20261021T153000Z
  const dates = "20261021T130000Z/20261021T153000Z";

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  window.open(googleUrl, '_blank');
}

export function downloadICSFile() {
  const icsData = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Laxman & Abi Engagement Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "SUMMARY:Laxman & Abi — Engagement Celebration",
    "DESCRIPTION:Join Laxman & Abi as they celebrate their engagement at Eden Garden\\, Tirunelveli.",
    "LOCATION:Eden Garden\\, Tirunelveli\\, Tamil Nadu\\, India",
    "DTSTART:20261021T130000Z",
    "DTEND:20261021T153000Z",
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', 'Laxman_Abi_Engagement.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
