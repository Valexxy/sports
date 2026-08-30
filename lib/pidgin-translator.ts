/**
 * PURE WARRI & NIGERIAN STREET PIDGIN TRANSLATION ENGINE
 * 100% Authentic, unfiltered Nigerian Pidgin / Waffi street vocabulary.
 * Eliminates sterile English mixing.
 */

export function translateToPidgin(text: string): string {
  if (!text) return '';
  let res = text;

  const warriDict: [RegExp, string][] = [
    // Verbs & Intentions
    [/wants? to win/gi, 'wan carry the cup by force'],
    [/win the Champions League/gi, 'lift the big Champions League trophy'],
    [/this season/gi, 'dis current season'],
    [/improve/gi, 'level up sharp sharp for'],
    [/agreed deal|deal agreed/gi, 'don sign contract, business don set kpatakpata'],
    [/in talks|negotiating/gi, 'dey rub minds for table'],
    [/transfer/gi, 'transfer gist'],
    [/breaking/gi, 'as e dey hot 🔥'],
    [/injured/gi, 'don wound, enter physio room'],
    [/injury/gi, 'injury palava'],
    [/manager|head coach/gi, 'oga coach'],
    [/defeated|beat/gi, 'flog dem black and blue'],
    [/defeat/gi, 'wipe dem 2-0'],
    [/scored/gi, 'fire correct gbam goal inside net'],
    [/goal/gi, 'gbam goal'],
    [/fans|supporters/gi, 'die-hard fans and stadium crew'],
    [/sources|insiders/gi, 'our correct insider plug confirm say'],
    [/report|reports/gi, 'gist wey we gather'],
    [/says|said/gi, 'yarn say'],
    [/warning/gi, 'heavy red alert warning'],
    [/statement/gi, 'straight talk'],
    [/stoppage time|added time/gi, 'dying minutes of added time'],
    [/penalty/gi, 'direct 12-yard spot penalty kick'],
    [/referee/gi, 'referee oga'],
    [/match|fixture/gi, 'match fixture'],
    [/prediction|banker/gi, 'sure banker pick'],
    [/champion|champions/gi, 'baba of the league'],
    [/relegation/gi, 'drop enter lower league'],
    [/yellow card/gi, 'yellow warning card'],
    [/red card/gi, 'direct red card march-off'],
    [/halftime/gi, 'half-time break'],
    [/fulltime/gi, 'final 90-minute whistle'],
    [/moneyline/gi, 'direct straight win'],
    [/double chance/gi, 'double chance win-or-draw'],
    [/over 2.5/gi, 'over 2.5 goals banger'],
    [/under 2.5/gi, 'tight defense under 2.5'],
  ];

  warriDict.forEach(([pat, rep]) => {
    res = res.replace(pat, rep);
  });

  const warriOpeners = [
    'Omo, check dis hot gist: ',
    'No dulling, as e dey hot: ',
    'Warri no dey carry last: ',
    'Oya listen to wetin dey sup: ',
    'Gbam! Correct update don land: ',
  ];

  const hash = Math.abs(text.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));
  const opener = warriOpeners[hash % warriOpeners.length];

  return opener + res;
}
