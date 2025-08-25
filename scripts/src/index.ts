const onReady = (cb: () => void) => {
  if (document.readyState !== 'loading') {
    cb();
  } else {
    document.addEventListener('DOMContentLoaded', cb);
  }
};

const createConversionPVElement = (value: number) => {
  const element = document.createElement('div');
  element.innerHTML = `
    <div class="list conversions">
      <p>CVR(PV)</p>
      <p class="ConversionHero num">${value}%</p>
    </div>
    `;
  element.style.color = '#ff9900';
  return element;
};

const createConversionUUElement = (value: number) => {
  const element = document.createElement('div');
  element.innerHTML = `
    <div class="list conversions">
      <p>CVR(UU)</p>
      <p class="ConversionHero num">${value}%</p>
    </div>
    `;
  element.style.color = '#0090c9';
  return element;
};

export const getNumberOnTheScreenByClassName = (
  className: string,
  retries = 5,
  interval = 100
) =>
  new Promise<number>((resolve, reject) => {
    const attempt = (remaining: number) => {
      const elem = document.getElementsByClassName(className)[0] as
        | HTMLElement
        | undefined;

      if (!elem) {
        if (remaining <= 0) {
          reject(new Error(`Element with class ${className} not found`));
          return;
        }
        setTimeout(() => attempt(remaining - 1), interval);
        return;
      }

      const textContent = elem.textContent?.trim() ?? '';
      if (textContent !== '') {
        resolve(+textContent);
        return;
      }

      const observer = new MutationObserver(([{ target }]) => {
        observer.disconnect();
        resolve(+(target as HTMLElement).textContent!);
      });
      observer.observe(elem, { childList: true });
    };

    attempt(retries);
  });

// CVR書き込み
if (process.env.NODE_ENV !== 'test') {
  onReady(async () => {
    const eventStatsElements = document.getElementsByClassName(
      'EventStatsHero stats_hero_area flex-row'
    );
    const pageview = await getNumberOnTheScreenByClassName('PageviewsHero num');
    const visitor = await getNumberOnTheScreenByClassName('VisitorsHero num');
    const participation = await getNumberOnTheScreenByClassName(
      'ParticipationsHero num'
    );

    const conversionRatePV = Math.floor((participation / pageview) * 1000) / 10;
    const conversionRatePVElement = createConversionPVElement(conversionRatePV);

    const conversionRateUU = Math.floor((participation / visitor) * 1000) / 10;
    const conversionRateUUElement = createConversionUUElement(conversionRateUU);

    eventStatsElements[0].appendChild(conversionRatePVElement);
    eventStatsElements[0].appendChild(conversionRateUUElement);
  });
}
