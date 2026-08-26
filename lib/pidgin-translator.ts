/**
 * AUTOMATIC NIGERIAN & WARRI PIDGIN TRANSLATION ENGINE
 * Converts formal sports news headlines and excerpts into engaging, authentic Nigerian Pidgin.
 */

export function translateToPidgin(text: string): string {
  if (!text) return '';
  let res = text;

  const dict: [RegExp, string][] = [
    [/want to win/gi, 'wan carry'],
    [/wants to win/gi, 'wan carry'],
    [/win the Champions League/gi, 'lift Champions League trophy'],
    [/this season/gi, 'this season by all means'],
    [/improve/gi, 'boost level for'],
    [/agreed deal/gi, 'don sign agreement'],
    [/deal agreed/gi, 'business don set'],
    [/in talks/gi, 'dey negotiate sharp sharp'],
    [/transfer/gi, 'transfer tori'],
    [/breaking/gi, 'hot hot tori'],
    [/injured/gi, 'don enter injury room'],
    [/injury/gi, 'injury wahala'],
    [/manager/gi, 'coach'],
    [/defeat/gi, 'flog'],
    [/defeated/gi, 'flog well well'],
    [/scored/gi, 'fire goal enter net'],
    [/goal/gi, 'banger goal'],
    [/fans/gi, 'supporters and fan-base'],
    [/sources/gi, 'insider tori confirm say'],
    [/report/gi, 'gist'],
    [/says/gi, 'talk say'],
    [/said/gi, 'yarn say'],
    [/warning/gi, 'heavy warning'],
    [/statement/gi, 'clear talk'],
    [/stoppage time/gi, 'dying minutes of extra time'],
    [/penalty/gi, 'spot kick penalty'],
  ];

  dict.forEach(([pat, rep]) => {
    res = res.replace(pat, rep);
  });

  const prefixes = [
    'Omo! ',
    'Toris dey hot: ',
    'No dulling at all: ',
    'Check this gist: ',
    'Sharp update: ',
  ];
  const hash = Math.abs(text.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));
  const prefix = prefixes[hash % prefixes.length];

  return prefix + res;
}
