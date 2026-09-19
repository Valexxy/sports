console.log("⚡ Mivaj API Injector connected to Bet9ja Core.");

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "RUN_AUTOMATION") {
    console.log("🚀 Mivaj AI injecting raw API payload to Bet9ja...");

    try {
      const payload = {
        "BETS": [{
          "BSTYPE": 2, "TAB": 2, "NUMLINES": 1, "COMB": 2, "TYPE": 1, "STAKE": 400,
          "POTWINMIN": 332, "POTWINMAX": 650, "BONUSMIN": 0, "BONUSMAX": 0,
          "ODDMIN": 1.66, "ODDMAX": 3.25,
          "ODDS": {
            "10144035$LIVES_OU@2.5_U": "1.66",
            "10144035$LIVES_1X2_X": 3.25
          },
          "FIXED": {}
        }],
        "EVS": {
          "10144035$LIVES_OU@2.5_U": {
            "id": "10144035$LIVES_OU@2.5_U", "eventId": 10144035, "eventCode": 14035,
            "eventName": "Kawasaki Frontale v Kashima Antlers", "market": "Over/Under",
            "sid": "LIVES_OU@2.5_U", "sign": "Under", "GN": "Japan - Meiji Yasuda J1 League",
            "leagueName": "Japan - Meiji Yasuda J1 League", "SG": "Japan",
            "startdate": "2026/09/19 09:00:00", "oddValue": "1.66", "hnd": "2.5", "sportName": ""
          },
          "10144035$LIVES_1X2_X": {
            "id": "10144035$LIVES_1X2_X", "eventId": 10144035, "eventCode": 14035,
            "eventName": "Kawasaki Frontale v Kashima Antlers", "market": "1X2",
            "sid": "LIVES_1X2_X", "sign": "X", "GN": "Japan - Meiji Yasuda J1 League",
            "leagueName": "Japan - Meiji Yasuda J1 League", "SG": "Japan",
            "startdate": "2026/09/19 09:00:00", "oddValue": 3.25, "hnd": "", "sportName": ""
          }
        },
        "IMPERSONIZE": 0
      };

      const response = await fetch("https://apigw.bet9ja.com/sportsbook/placebet/BookABetV2?source=desktop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      console.log("Bet9ja API Response:", data);
      
      let realCode = "FAILED";
      if (data && data.d && data.d.BookingCode) realCode = data.d.BookingCode;
      else if (data && data.BookingCode) realCode = data.BookingCode;
      else if (data && data.D && data.D.BCode) realCode = data.D.BCode;
      else {
        const jsonStr = JSON.stringify(data);
        const codeMatch = jsonStr.match(/[A-Z0-9]{5,8}/g);
        if (codeMatch && codeMatch.length > 0) {
          realCode = codeMatch[0];
        }
      }

      console.log("✅ API Injection Successful. Core Response:", realCode);
      chrome.runtime.sendMessage({ action: "CODE_GENERATED", code: realCode });

    } catch (error) {
      console.error("API Injection Failed:", error);
      chrome.runtime.sendMessage({ action: "CODE_GENERATED", code: "API_ERROR" });
    }
  }
});
