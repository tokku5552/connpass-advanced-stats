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

// CVR書き込み
onReady(() => {
  const eventStatsElements = document.getElementsByClassName(
    'EventStatsHero stats_hero_area flex-row'
  );
  const pageview =
    +document.getElementsByClassName('PageviewsHero num')[0].innerHTML;
  const visitor =
    +document.getElementsByClassName('VisitorsHero num')[0].innerHTML;
  const participation = +document.getElementsByClassName(
    'ParticipationsHero num'
  )[0].innerHTML;

  const conversionRatePV = Math.floor((participation / pageview) * 1000) / 10;
  const conversionRatePVElement = createConversionPVElement(conversionRatePV);

  const conversionRateUU = Math.floor((participation / visitor) * 1000) / 10;
  const conversionRateUUElement = createConversionUUElement(conversionRateUU);

  eventStatsElements[0].appendChild(conversionRatePVElement);
  eventStatsElements[0].appendChild(conversionRateUUElement);
});
