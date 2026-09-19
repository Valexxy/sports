console.log("? Mivaj Automator injected into Bookmaker.");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "RUN_AUTOMATION") {
    
    // Simulate finding the code and sending it back to background
    setTimeout(() => {
      const demoCode = "1XB-MIVAJ-" + Math.floor(Math.random() * 900 + 100);
      chrome.runtime.sendMessage({ action: "CODE_GENERATED", code: demoCode });
    }, 3000);
  }
});
