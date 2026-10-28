// ビルド成果物（ブラウザに配布される content script）と manifest.json の検証
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const scriptsDir = path.resolve(__dirname, '..');
const builtScriptPath = path.join(scriptsDir, 'out', 'index.js');
const manifestPath = path.resolve(
  scriptsDir,
  '..',
  'extensions',
  'manifest.json'
);

// connpass のイベント統計ページを模した DOM
const statsPageHtml = `<!DOCTYPE html>
<html><body>
  <div class="EventStatsHero stats_hero_area flex-row">
    <p class="PageviewsHero num">200</p>
    <p class="VisitorsHero num">100</p>
    <p class="ParticipationsHero num">25</p>
  </div>
</body></html>`;

const waitFor = async <T>(fn: () => T | null | undefined, timeoutMs = 2000) => {
  const start = Date.now();
  for (;;) {
    const result = fn();
    if (result) return result;
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
};

describe('built content script', () => {
  let builtScript: string;

  beforeAll(() => {
    // テストジョブと build ジョブは並列のため、ここで実際にビルドする
    execSync('yarn build', { cwd: scriptsDir, stdio: 'pipe' });
    builtScript = readFileSync(builtScriptPath, 'utf8');
  }, 60000);

  it('runs as a classic script and appends CVR elements to the stats area', async () => {
    const { window } = new JSDOM(statsPageHtml, { runScripts: 'outside-only' });
    const errors: unknown[] = [];
    window.addEventListener('error', (event) => errors.push(event.error));

    // content script と同じく、モジュールではない classic script として評価する
    window.eval(builtScript);

    const values = await waitFor(() => {
      const elems = window.document.querySelectorAll(
        '.EventStatsHero .list.conversions .ConversionHero.num'
      );
      return elems.length === 2
        ? Array.from(elems).map((e) => e.textContent)
        : null;
    });

    expect(errors).toEqual([]);
    expect(values).toEqual(['12.5%', '25%']);

    const labels = Array.from(
      window.document.querySelectorAll(
        '.EventStatsHero .list.conversions p:first-child'
      )
    ).map((e) => e.textContent);
    expect(labels).toEqual(['CVR(PV)', 'CVR(UU)']);
  });

  it('does not throw on a page without the stats area', () => {
    const { window } = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
      runScripts: 'outside-only',
    });
    expect(() => window.eval(builtScript)).not.toThrow();
  });
});

describe('extensions/manifest.json', () => {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

  it('is a Manifest V3 extension', () => {
    expect(manifest.manifest_version).toBe(3);
  });

  it('loads the file produced by the scripts build', () => {
    // ルートの build:main が scripts/out/* を extensions/scripts/ にコピーする
    const jsFiles = manifest.content_scripts.flatMap(
      (cs: { js: string[] }) => cs.js
    );
    expect(jsFiles).toEqual([`./scripts/${path.basename(builtScriptPath)}`]);
  });

  it('matches connpass event stats pages', () => {
    const patterns: string[] = manifest.content_scripts.flatMap(
      (cs: { matches: string[] }) => cs.matches
    );
    const toRegExp = (pattern: string) =>
      new RegExp(
        `^${pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`
      );
    const matches = (url: string) =>
      patterns.some((p) => toRegExp(p).test(url));

    expect(matches('https://connpass.com/event/123456/stats/')).toBe(true);
    expect(matches('https://connpass.com/event/123456/')).toBe(false);
  });
});
