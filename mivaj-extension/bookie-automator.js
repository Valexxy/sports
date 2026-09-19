console.log("⚡ Mivaj Automator injected into Bet9ja.");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "RUN_AUTOMATION") {
    
    // In production, this parses the Bet9ja DOM, clicks the odds, and clicks "Book a Bet"
    console.log("Locating Bet9ja DOM nodes for matches:", request.matches);
    
    setTimeout(() => {
      // Simulate successful extraction of the alphanumeric code from the Bet9ja popup
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let demoCode = '';
      for (let i = 0; i < 6; i++) {
        demoCode += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      
      chrome.runtime.sendMessage({ action: "CODE_GENERATED", code: "B9JA-" + demoCode });
    }, 2500);
  }
});
