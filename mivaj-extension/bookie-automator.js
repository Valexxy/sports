console.log("? Mivaj Automator injected into Bookmaker.");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "RUN_AUTOMATION") {
    console.log("Running automation for matches:", request.matches);
    // Here is where the hardcore DOM parsing happens.
    // Example: document.querySelectorAll('.odds-button')...
    // Since bookie DOMs change, this script would regularly fetch CSS selectors from the Mivaj API
    
    alert("Mivaj AI Agent is generating your VIP code via affiliate link...");
    
    // Simulate finding the code and sending it back
    setTimeout(() => {
      console.log("Code generated: 1XB-MIVAJ-892");
    }, 3000);
  }
});
