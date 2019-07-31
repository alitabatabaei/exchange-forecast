import * as moment from 'moment';

// calculate season length
const season = (length) => {

    return Math.floor(length / 1.4);
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
    const FR = (l + (k * t)) * sPMK;
    // if (FR < 0) {
    //     console.log('l', l);
    //     console.log('k', k);;
    //     console.log('t', t);;
    //     console.log('sPMK', sPMK);;
    // }
    return Math.round(FR * 100) / 100;
};

const forecast = (data, p) => { // date: rates, p: parameters (alpha, beta, gamma)
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
                r.forecast = Math.round(f * 100) / 100;
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

    let lastDate = moment(lS[I].date);
    for (let i = 1; i <= pL; i++) {
        const k = (i - 1) % m + 1; // generating season period loops (1 through 'm: season length' then restart from 1)
        const seasonal = lS[I - m + k].seasonal;
        // console.log('I - m + k', I - m + k);
        const result: any = {};

        const offset = lastDate.get('day') === 5 ? 3 : 1; // skipping weekends
        lastDate = lastDate.add(offset, 'days');
        result.date = lastDate.format('YYYY-MM-DD');
        result.forecast = F(lL, k, lT, seasonal);

        results.push(result);
    }

    // console.log('%cprediction results', 'color: pink', results);
    return results;
};

// simple array sum reducer
const sum = (acc, cur) => acc + cur;

const HW = (data) => {
    // console.log('historical ex-rates', data);
    const p = {
        alpha: .9,
        beta: .02,
        gamma: .9,
    };
    // console.log(p);

    const a = forecast(data, p);
    const m = season(data.length);
    const predictions = predict(a.slice(-m), a.length);


    return a.concat(predictions).map(f => {
        const rate: any = {};
        rate.date = f.date;
        rate.amount = f.forecast ? Number(f.forecast) : null;

        return rate;
    });
};

export { HW };
