console.log("? Mivaj AI VIP Agent connected.");

// Listen for the website telling the extension to start
window.addEventListener("MIVAJ_GENERATE_SLIP", (event) => {
  const data = event.detail;
  chrome.runtime.sendMessage({ action: "GENERATE_SLIP", data: data }, (response) => {
    window.dispatchEvent(new CustomEvent("MIVAJ_SLIP_STATUS", { detail: response }));
  });
});

// Listen for background worker sending the final code back
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "FINAL_CODE") {
    console.log("Mivaj Extension received final code:", request.code);
    window.dispatchEvent(new CustomEvent("MIVAJ_SLIP_STATUS", { detail: { message: "? Code Generated: " + request.code } }));
  }
});
