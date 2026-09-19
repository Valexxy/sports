chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "GENERATE_SLIP") {
    // 1. Open the affiliate link to cookie the user
    chrome.tabs.create({ url: request.data.affiliateLink, active: false }, (tab) => {
      // 2. Wait for page load, then inject the automator script
      // In a production environment, you'd wait for complete load and handle DOM mapping
      setTimeout(() => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['bookie-automator.js']
        }, () => {
          // Send the match data to the newly injected script
          chrome.tabs.sendMessage(tab.id, { action: "RUN_AUTOMATION", matches: request.data.matches });
        });
      }, 5000);
    });
    
    // Optimistic response
    sendResponse({ status: "processing", message: "Opening affiliate link and running AI automation..." });
  }
  return true;
});
