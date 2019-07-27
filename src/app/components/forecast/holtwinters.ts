// calculate season length (S)
const season = (length) => {
    let s = 1;
    if (length > 15) { s = 5; }
    if (length > 90) { s = 30; }
    if (length > 270) { s = 90; }
    if (length > 1095) { s = 365; }

    return s;
};


// ================= //
//   GLOSSARY		 //
// ================= //
//   L: Level		 //
//   T: Trend		 //
//   S: Seasonal	 //
//   F: Forecast	 //
// ================= //

// calculate level (L)
// = alpha * (Val(t) / S(t-m)) + (1-alpha) * (L(t-1) + T(t-1))
const L = (alpha, v, sPM, lP, tP) => {
    return (alpha * (v * sPM) + (1 - alpha) * (lP + tP));
};
// calculate trend (T)
// = beta * (L(t) - L(t-1)) + (1-beta) * T(t-1)
const T = (beta, l, Lp, tP) => {
    return (beta * (l - Lp) + (1 - beta) * tP);
};
// calculate seasonal (S)
// = gamma \* Val<sub>(t)</sub> / L(t) + (1 - gamma) \* S(t-m)
const S = (gamma, v, l, sPM) => {
    return gamma * (v / l) + (1 - gamma) * sPM;
};
// calculate forecaste (F)
// = (L(t-1) + T(t-1) * S(t-m)
const F = (l, k, t, sPMK) => {
    return (l + k * t) * sPMK;
};

// simple array sum reducer
const sum = (acc, cur) => acc + cur;

const HW = (data) => {
    console.log('historical ex-rates', data);
    const p = {
        alpha: .5,
        beta: .05,
        gamma: .5,
    };
    console.log(p);

    const m = season(data.length);

    const a = data.map((r, i, arr) => { // r: exchange-rate, i: index, arr: array
        r.amount = Number(r.amount);
        const v = r.amount;
        // console.log(i, v);

        // calculating first season's seasonals
        if (i < m) {
            // calculating first season's average (to calculate seasonals)
            const avg = data.map(sr => Number(sr.amount)).slice(0, m).reduce(sum) / m;
            // console.log('avg', avg);
            r.seasonal = v / avg;
            // console.log('seasonal', r.seasonal);
        } else {
            const spm = arr[i - m].seasonal; // previous seasons corresponding seasonal

            if (i === m) { // 2nd season's first period
                r.level = v / spm;
                r.trend = r.level - (arr[i - 1].amount / spm);

            } else { // all following periods
                const lp = arr[i - 1].level; // previous period's level
                const tp = arr[i - 1].trend; // previous period's trend

                // level & trend for current period
                r.level = L(p.alpha, v, spm, lp, tp);
                r.trend = T(p.beta, r.level, lp, tp);

                // current period's forecast
                const f = (lp + tp) * spm;
                r.forecast = Number(f.toFixed(2));
            }

            // seasonals (now that we have "level" of all following periods)
            r.seasonal = S(p.gamma, v, r.level, spm);
        }

        // console.log(r);
        return r;
    });

    return a.map(f => {
        const rate: any = {};
        rate.date = f.date;
        rate.amount = f.forecast;

        return rate;
    });
};

export { HW };
