# Features
**REST service (exchangeratesapi.io)**
**Angular Forms**
**Chart.js:**
* Flatten response list for each week
* Fomat array for chart.js
# Inputs
**Amount:**
- Type: number
- Digit grouping
- Validation
    - Min 0.01

**Currencies:**
- Base currency
    - Type: select/autocomplete
    - Mode: multiple
- Target currency
    - Type: select/autocomplete
    - Mode: multiple
- *Swap values
- Validation
    - Not equal

**Wait period:**
- Unit: weeks
- Input 1
    - Type: number
    - validation
        - Min: 1
        - Max:  250
- Input 2
    - Type: slider
        - Range 1-250
- *mirror values

# Output
**Suggested sell-out date**
**Potential profits/loss compared to today**
**Chart**
- Historical data (wait period → today)
- Forecast (today → wait period)

**Data-table**
- Date
- Currency 1 (rate * amount)
- Currency 2 (rate * amount)
- …
- Currency N (rate * amount)

# Components
**Forecast**
- Methods:
    - getRates

**Exchange form**
- @output: request

**Chart**
- @input: datasets

**Data table**
- @input: rows

# Providers
**api service**
