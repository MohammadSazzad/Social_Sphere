import { Filter } from 'bad-words';

// Expanded list of explicit terms
const customAdultTerms = [
  'porn', 'xxx', 'nude', 'nsfw', 'sex', 'sexual', 'naked', 'pornography',
  'erotic', 'hardcore', 'blowjob', 'handjob', 'vagina', 'penis', 'dick',
  'pussy', 'ass', 'anal', 'bdsm', 'fetish', 'orgasm', 'masturbation',
  'ejaculation', 'sperm', 'cum', 'tits', 'boobs', 'breasts', 'nipples',
  'buttocks', 'prostitute', 'fuck', 'cunt', 'cock', 'screw', 'whore',
  'dildo', 'vibrator', 'condom', 'orgy', 'incest', 'pedophile', 'rape',
  'molest', 'bestiality', 'scat', 'fart', 'fetish', 'bondage', 'sadism',
  'masochism', 's&m', 'fisting', 'cuckold', 'swinger', 'orgy', 'threesome',
  'xxx', 'p0rn', 'nud3', 's3x', 'f*ck', 'f**k', 'b!tch', 'sh!t', 'a$$'
];

class ModerationService {
  constructor() {
    this.keywordFilter = new Filter();
    this.keywordFilter.addWords(...customAdultTerms);
    
    this.adultPatterns = [
      /s[e3*]x[ual]*/gi,
      /p[o0]rn(o|ography)?/gi,
      /nud[ei](s|ity)?/gi,
      /explicit/gi,
      /adult\s?content/gi,
      /nsfw/gi,
      /xxx/gi,
      /vulva/gi,
      /penis/gi,
      /blow\s?job/gi,
      /hand\s?job/gi,
      /tits|boobs|breasts/gi,
      /ass(hole)?/gi,
      /fuck(ing)?/gi,
      /cunt/gi,
      /dick/gi,
      /pussy/gi,
      /bdsm/gi,
      /clitoris/gi,
      /c[o0]ck/gi,
      /semen/gi,
      /vagina/gi,
      /prostitut(e|ion)/gi,
      /escort/gi,
      /erotic/gi,
      /hardcore/gi,
      /f\*\*k/gi,
      /f\*ck/gi,
      /sh[i1!]t/gi,
      /b[i1!]tch/gi,
      /d[i1!]ldo/gi,
      /v[i1!]brator/gi,
      /c[o0]ndom/gi,
      /[^a]r[a@]pe/gi,
      /m[o0]lest/gi,
      /b[e3]astiality/gi,
      /f[i1!]sting/gi,
      /cuck[o0]ld/gi,
      /threesome/gi
    ];
  }

  async isAdultContent(text) {
    // 1. Keyword filter
    if (this.keywordFilter.isProfane(text)) return true;
    
    // 2. Regex patterns
    return this.adultPatterns.some(pattern => pattern.test(text));
  }
}

// Initialize singleton instance
const service = new ModerationService();
export default service;