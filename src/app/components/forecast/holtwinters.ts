// calculate season length (S)
const season = (length) => {
	let s = 1;
	if (length > 15) s = 5;
	if (length > 90) s = 30;
	if (length > 270) s = 90;
	if (length > 1095) s = 365;

	return s;
}

// calculate level (L)
const L = (alpha, v, Spm, Lp, Tp) => {
	return (alpha * (v * Spm) + (1 - alpha) * (Lp + Tp));
}
// calculate trend (T)
const T = (beta, L, Lp, Tp) => {
	return (beta * (L - Lp) + (1 - beta) * Tp);
}
// calculate seasonal (S)
const S = (gamma, v, l, Spm) => {
	return gamma * (v / l) + (1 - gamma) * Spm;
}
// calculate forecaste (F)
const F = (L, K, T, Spmk) => {
	return (L + K * T) * Spmk;
}

// simple array sum
const sum = (acc, cur) => acc + cur;

const HW = (data) => {
	console.log('historical ex-rates', data);

	const p = {
		alpha: .5,
		beta: .05,
		gamma: .5,
	}
	console.log(p);

	const m = season(data.length);

	const a = data.map((r, i, a) => { // r: exchange-rate, i: index, a: array
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
			const spm = a[i - m].seasonal; // previous seasons corresponding seasonal

			if (i === m) { // 2nd season's first period
				r.level =  v / spm;
				r.trend = r.level - (a[i - 1].amount / spm);

			} else { // all following periods
				const lp = a[i - 1].level; // previous period's level
				const tp = a[i - 1].trend; // previous period's trend
	
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
}

export { HW };
