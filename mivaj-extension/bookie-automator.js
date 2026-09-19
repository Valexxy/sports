console.log("⚡ Mivaj AI VIP Agent injected into Bet9ja.");

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Advanced Heuristic DOM Finder
function findElementByText(text, tag = '*') {
  const elements = document.querySelectorAll(tag);
  for (let i = 0; i < elements.length; i++) {
    // Exact or partial match for buttons/spans
    if (elements[i].textContent.trim().toLowerCase().includes(text.toLowerCase())) {
      // Return the closest clickable parent if it's just a span
      return elements[i].closest('button') || elements[i].closest('a') || elements[i];
    }
  }
  return null;
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "RUN_AUTOMATION") {
    const match = request.matches[0];
    console.log("🚀 Mivaj AI starting automation for:", match);

    try {
      // Step 1: Wait for Bet9ja to load
      await delay(3000);
      
      // Step 2: Try to find a search bar to input the team name
      const searchInputs = document.querySelectorAll('input[type="text"], input[type="search"]');
      let searchInput = null;
      for (let input of searchInputs) {
        if (input.placeholder.toLowerCase().includes('search') || input.className.toLowerCase().includes('search')) {
          searchInput = input;
          break;
        }
      }

      if (searchInput) {
        console.log("Found search bar, entering:", match.homeTeam);
        searchInput.value = match.homeTeam;
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        searchInput.dispatchEvent(new Event('change', { bubbles: true }));
        await delay(2000); // Wait for search results
      } else {
        console.log("No search bar found, falling back to manual DOM scan.");
      }

      // Step 3: Find the specific match in the DOM
      // We look for the home team name
      const teamElement = findElementByText(match.homeTeam, 'div');
      if (teamElement) {
        console.log("Found Match:", match.homeTeam);
        // We assume clicking the match opens the detailed odds view
        teamElement.click();
        await delay(2000);
      }

      // Step 4: Find the specific pick (e.g., "Over 1.5 Goals")
      // In betting markets, "Over 1.5" is usually represented as "O 1.5" or "Over" under a 1.5 column
      let pickStr = match.pick;
      if (pickStr.includes('Over 1.5')) pickStr = '1.5'; 
      
      const oddsElement = findElementByText(pickStr, 'span') || findElementByText(match.pick, 'div');
      if (oddsElement) {
        console.log("Found Odds:", match.pick);
        oddsElement.click();
        await delay(1000);
      }

      // Step 5: Click "Book a Bet" to generate the code
      const bookButton = findElementByText("Book", 'button') || findElementByText("Book a Bet", 'div');
      if (bookButton) {
        console.log("Clicking Book Button...");
        bookButton.click();
        await delay(2000);
      }

      // Step 6: Extract the generated alphanumeric code
      // Bet9ja codes are usually alphanumeric strings inside a strong/b tag or specific input
      const codeInput = document.querySelector('input[readonly]') || document.querySelector('.booking-code');
      let generatedCode = '';
      
      if (codeInput && codeInput.value) {
        generatedCode = codeInput.value;
      } else {
        // Fallback: search DOM for something that looks like a Bet9ja code (e.g. 5-7 uppercase alphanumeric chars)
        const allText = document.body.innerText;
        const codeMatch = allText.match(/\b[A-Z0-9]{5,8}\b/g);
        if (codeMatch) {
          // Exclude common words that might match
          const codes = codeMatch.filter(c => c !== 'BET9JA' && c !== 'LOGIN' && c !== 'REGISTER');
          if (codes.length > 0) generatedCode = codes[0];
        }
      }

      if (generatedCode) {
        console.log("✅ Successfully extracted Real Bet9ja Code:", generatedCode);
        chrome.runtime.sendMessage({ action: "CODE_GENERATED", code: generatedCode });
      } else {
        throw new Error("Could not locate the booking code in the DOM.");
      }

    } catch (error) {
      console.error("Mivaj Automation Failed:", error);
      // Fallback to structural demo so the UI doesn't hang indefinitely
      const fallbackCode = "B9JA-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      chrome.runtime.sendMessage({ action: "CODE_GENERATED", code: fallbackCode + " (Simulated)" });
    }
  }
});
