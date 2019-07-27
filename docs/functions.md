## Params
1. alpha
2. beta
3. gamma
4. set season length: (1, 5, 30, 90, 365)

## Smoothing
**PERIOD m1**
* **calc seasonal _"S"_**
	= Val(t) / first season average

**PERIOD m2**
* **level _"L"_**
	= Val(t) / S(t-m): _corresponding seasonal from pervious season_
* **trend "T"**
	= L(t) - (Val(t-1) / S(t-1))
* **seasonal _"S"_**
	= gamma \* Val<sub>(t)</sub> / L(t) + (1 - gamma) \* S(t-m)

**PERIODS m2,... mN**
* **level _"L"_**
	= alpha \* (Val(t) / S(t-m)) + (1-alpha) \* (L(t-1) + T(t-1))
* **trend _"T"_**
	= beta * (L(t) - L(t-1)) + (1-beta) * T(t-1)
* **forecast(F) _tm+2_**
	= (L(t-1) + T(t-1)) * S(t-m): _corresponding seasonal from perv season_


## Optimization

## Forecast
