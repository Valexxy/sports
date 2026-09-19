// Store the Mivaj tab ID so we can send the final code back to it
let mivajTabId = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "GENERATE_SLIP") {
    mivajTabId = sender.tab.id;
    
    // 1. Open the affiliate link to cookie the user
    chrome.tabs.create({ url: request.data.affiliateLink, active: false }, (tab) => {
      // 2. Wait for page load, then inject the automator script
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
  
  if (request.action === "CODE_GENERATED") {
    // Forward the final code back to the Mivaj website
    if (mivajTabId) {
      chrome.tabs.sendMessage(mivajTabId, { action: "FINAL_CODE", code: request.code });
      
      // Optionally close the 1xbet tab since we are done
      if (sender.tab && sender.tab.id) {
        chrome.tabs.remove(sender.tab.id);
      }
    }
  }
  return true;
});
