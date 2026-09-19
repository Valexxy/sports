console.log("? Mivaj AI VIP Agent connected.");

// Listen for the website telling the extension to do work
window.addEventListener("MIVAJ_GENERATE_SLIP", (event) => {
  const data = event.detail;
  console.log("Mivaj Extension received slip request:", data);
  
  // Forward to background worker
  chrome.runtime.sendMessage({ action: "GENERATE_SLIP", data: data }, (response) => {
    // Send status back to website
    window.dispatchEvent(new CustomEvent("MIVAJ_SLIP_STATUS", { detail: response }));
  });
});
