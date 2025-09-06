// ----------UNIT CONVERT----------
// forecast convert
const unitSelect = document.getElementById('unit-select'); // dabūju no stackoverflow

function convertForecastTemps(unit) {
    document.querySelectorAll('.forecast-temp').forEach(el => {
        const c = el.getAttribute('data-c'); //galvenā temp
        const feels = el.getAttribute('data-feels'); // feels like temp
        const cDay = el.getAttribute('data-c-day'); // preikš 10 days diena
        const cNight = el.getAttribute('data-c-night'); // priekš 10 days nakts
        const desc = el.getAttribute('data-desc') || ""; // priekš 10 days apraksts

        if (c && feels) {
            // today un tomorrow
            if(unit === 'FM') {
                el.textContent = ((parseFloat(c)*9/5)+32).toFixed(1) + "°F / Feels like " + ((parseFloat(feels)*9/5)+32).toFixed(1) + "°F";
            } else {
                el.textContent = parseFloat(c).toFixed(1) + "°C / Feels like " + parseFloat(feels).toFixed(1) + "°C";
            }
        } else if (cDay && cNight) {
            // 10 days
            if(unit === 'FM') {
                el.textContent = ((parseFloat(cDay)*9/5)+32).toFixed(1) + "°F / " + ((parseFloat(cNight)*9/5)+32).toFixed(1) + "°F, " + desc;
            } else {
                el.textContent = parseFloat(cDay).toFixed(1) + "°C / " + parseFloat(cNight).toFixed(1) + "°C, " + desc;
            }
        }
    });
}

// current weather convert
// tad kad tu izvēlies mērvienību (c-km vai f-m)
unitSelect.addEventListener('change', () => {
    const unit = unitSelect.value;
    
    // main temp
    document.querySelectorAll('.weather-temp').forEach(el => {
        const c = parseFloat(el.getAttribute('data-c'));
        el.textContent = unit === 'FM' ? ((c*9/5)+32).toFixed(1)+"°F" : c.toFixed(1)+"°C";
    });

    // feels like
    document.querySelectorAll('.feels-like').forEach(el => {
        const c = parseFloat(el.getAttribute('data-c'));
        el.textContent = unit === 'FM' ? "Feels Like "+((c*9/5)+32).toFixed(1)+"°F" : "Feels Like "+c.toFixed(1)+"°C";
    });

    // wind
    document.querySelectorAll('.wind-speed').forEach(el => {
        const kmh = parseFloat(el.getAttribute('data-km'));
        el.textContent = unit === 'FM' ? (kmh/1.609).toFixed(1)+" mph" : kmh.toFixed(1)+" km/h";
    });

    convertForecastTemps(unit);
});

// datu izvadīšana priekš forecast
document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("days-content");

    function renderToday() {
        const today = weatherData.list[0];
        const times = [
            { label: "Morning", temp: today.temp.morn, feels: today.feels_like.morn },
            { label: "Day", temp: today.temp.day, feels: today.feels_like.day },
            { label: "Evening", temp: today.temp.eve, feels: today.feels_like.eve },
            { label: "Night", temp: today.temp.night, feels: today.feels_like.night }
        ];

        return `<div class="forecast-block">` + times.map(t => `
            <div class="forecast-row">
                <div class="forecast-time">${t.label}</div>
                <div class="forecast-temp" data-c="${t.temp}" data-feels="${t.feels}">${t.temp}°C / Feels like ${t.feels}°C</div>
            </div>
        `).join('') + `</div>`;
    }

    function renderTomorrow() {
        const tomorrow = weatherData.list[1];
        const times = [
            { label: "Morning", temp: tomorrow.temp.morn, feels: tomorrow.feels_like.morn },
            { label: "Day", temp: tomorrow.temp.day, feels: tomorrow.feels_like.day },
            { label: "Evening", temp: tomorrow.temp.eve, feels: tomorrow.feels_like.eve },
            { label: "Night", temp: tomorrow.temp.night, feels: tomorrow.feels_like.night }
        ];

        return `<div class="forecast-block">` + times.map(t => `
            <div class="forecast-row">
                <div class="forecast-time">${t.label}</div>
                <div class="forecast-temp" data-c="${t.temp}" data-feels="${t.feels}">${t.temp}°C / Feels like ${t.feels}°C</div>
            </div>
        `).join('') + `</div>`;
    }

    function render10Days() {
        return `<div class="forecast-block">` + weatherData.list.slice(2,12).map((day,i)=>`
            <div class="forecast-row">
                <div class="forecast-time">Day ${i+1}</div>
                <div class="forecast-temp" data-c-day="${day.temp.day}" data-c-night="${day.temp.night}" data-desc="${day.weather[0].description}">
                    ${day.temp.day}°C / ${day.temp.night}°C, ${day.weather[0].description}
                </div>
            </div>
        `).join('') + `</div>`;
    }

    const forecasts = { today: renderToday, tomorrow: renderTomorrow, "10days": render10Days };

    // forecast pogas
    document.querySelectorAll(".days button").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".days button").forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            const day = button.getAttribute("data-day");
            content.innerHTML = forecasts[day]();
            convertForecastTemps(unitSelect.value); // convert immediately
        });
    });

    content.innerHTML = renderToday(); // default today
    convertForecastTemps(unitSelect.value); // convert default
    document.querySelector('.days button[data-day="today"]').classList.add("active");
});