export const onReady = (cb: () => void) => {
  if (document.readyState !== 'loading') {
    cb();
  } else {
    document.addEventListener('DOMContentLoaded', cb);
  }
};

export const createConversionPVElement = (value: number) => {
  const element = document.createElement('div');

  const list = document.createElement('div');
  list.className = 'list conversions';

  const label = document.createElement('p');
  label.textContent = 'CVR(PV)';

  const valueElem = document.createElement('p');
  valueElem.className = 'ConversionHero num';
  valueElem.textContent = `${value}%`;

  list.appendChild(label);
  list.appendChild(valueElem);
  element.appendChild(list);

  element.style.color = '#ff9900';
  return element;
};

export const createConversionUUElement = (value: number) => {
  const element = document.createElement('div');

  const list = document.createElement('div');
  list.className = 'list conversions';

  const label = document.createElement('p');
  label.textContent = 'CVR(UU)';

  const valueElem = document.createElement('p');
  valueElem.className = 'ConversionHero num';
  valueElem.textContent = `${value}%`;

  list.appendChild(label);
  list.appendChild(valueElem);
  element.appendChild(list);

  element.style.color = '#0090c9';
  return element;
};

export const getNumberOnTheScreenByClassName = (className: string) =>
  new Promise<number>((resolve) => {
    const elem = document.getElementsByClassName(className)[0];

    if (elem && elem.textContent) {
      const textContent = elem.textContent.trim();
      if (textContent !== '') {
        resolve(+textContent);
        return;
      }
    }

    if (!elem) {
      resolve(0);
      return;
    }

    const observer = new MutationObserver(([{ target }]) => {
      observer.disconnect();
      resolve(Number((target as Element).textContent ?? 0));
    });
    observer.observe(elem, { childList: true });
  });

// CVR書き込み（ブラウザ環境でのみ実行）
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
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

    if (eventStatsElements[0]) {
      eventStatsElements[0].appendChild(conversionRatePVElement);
      eventStatsElements[0].appendChild(conversionRateUUElement);
    }
  });
}
