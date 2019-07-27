// calculate season length
const season = (length) => {
    let s = 1;
    if (length > 15) { s = 5; }
    if (length > 90) { s = 30; }
    if (length > 270) { s = 90; }
    if (length > 540) { s = 180; }
    if (length > 1080) { s = 360; }

    // const n = 4;
    // const s = Math.floor(length / n);

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

// level (L) Formula
// = alpha * (Val(t) / S(t-m)) + (1-alpha) * (L(t-1) + T(t-1))
const L = (alpha, v, sPM, lP, tP) => {
    return (alpha * (v / sPM) + (1 - alpha) * (lP + tP));
};
// trend (T) Formula
// = beta * (L(t) - L(t-1)) + (1-beta) * T(t-1)
const T = (beta, l, Lp, tP) => {
    return (beta * (l - Lp) + (1 - beta) * tP);
};
// seasonal (S) Formula
// = gamma \* Val<sub>(t)</sub> / L(t) + (1 - gamma) \* S(t-m)
const S = (gamma, v, l, sPM) => {
    return (gamma * (v / l) + (1 - gamma) * sPM);
};
// forecast (F) Formula
// = ( L(t-1) + T(t-1) ) * S(t-m+k)
const F = (l, k, t, sPMK) => {
    // console.log('l', l, 'k', k, 't', t, 'sPMK', sPMK);
    return (l + (k * t)) * sPMK;
};

// parameters optimization
const O = () => {};

const forecast = (data, p) => {
    const m = season(data.length);
    // console.log('m', m);

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
    return a;
};

// forcasted periods
const predict = (lS, pL) => { // lS: last-season, pL: prediction-length
    const results = [];
    const m = lS.length;
    const I = m - 1; // last period's index
    const lL = lS[I].level; // last level
    const lT = lS[I].trend; // last trend
    // console.log('%cpredict() parameters', 'color: green');
    // console.log('lS', lS);
    // console.log('I', I);
    // console.log('lL', lL);
    // console.log('lT', lT);

    for (let i = 1; i <= pL; i++) {
        const k = (i - 1) % m + 1;
        const seasonal = lS[I - m + k].seasonal;
        // console.log('I - m + k', I - m + k);
        const result: any = {};
        result.date = lS[I].date + k;
        result.forecast = F(lL, k, lT, seasonal);
        results.push(result);
    }

    // console.log('%cprediction results', 'color: pink', results);
    return results;
};

// simple array sum reducer
const sum = (acc, cur) => acc + cur;

const HW = (data) => {
    console.log('historical ex-rates', data);
    const p = {
        alpha: .9,
        beta: .09,
        gamma: .09,
    };
    console.log(p);

    const a = forecast(data, p);
    const errors = a.filter(r => r.forecast).map(rf => (rf.amount - rf.forecast));
    console.log('%cerrors', 'color: red', errors);
    const RMSE = errors.map(e => e * e).reduce(sum);
    console.log('%cRMSE', 'color: red', RMSE);

    const m = season(data.length);
    const predictions = predict(a.slice(-m), a.length);

    window.alert(RMSE);

    return a.concat(predictions).map(f => {
        const rate: any = {};
        rate.date = f.date;
        rate.amount = f.forecast ? Number(f.forecast) : null;

        return rate;
    });
};

export { HW };
