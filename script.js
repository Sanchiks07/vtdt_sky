// ----------UNIT CONVERT----------
// forecast convert
const unitSelect = document.getElementById('unit-select'); // dabūju no stackoverflow

function convertForecastTemps(unit) {
    document.querySelectorAll('.forecast-temp').forEach(el => {
        const c = el.getAttribute('data-c'); // today un tomorrow main temp
        const feels = el.getAttribute('data-feels'); // today un tomorrow feels like
        const cDay = el.getAttribute('data-c-day'); // 10 days temp
        const wind = el.getAttribute('data-wind'); // 10 days wind
        const humidity = el.getAttribute('data-humidity'); // 10 days humidity

        if (c && feels) {
            // today un tomorrow
            if(unit === 'FM') {
                el.textContent = ((parseFloat(c)*9/5)+32).toFixed(1) + "°F / Feels like " + ((parseFloat(feels)*9/5)+32).toFixed(1) + "°F";
            } else {
                el.textContent = parseFloat(c).toFixed(1) + "°C / Feels like " + parseFloat(feels).toFixed(1) + "°C";
            }
        } else if (cDay && wind && humidity) {
            // 10 days
            const tempEl = el.querySelector('.temp'); 
            const detailsEl = el.querySelector('.details');
            const windNum = parseFloat(wind); // nodrošina, ka wind ir nummurs

            if (unit === 'FM') {
                const tempF = ((parseFloat(cDay) * 9/5) + 32).toFixed(1);
                const windMph = (parseFloat(windNum) / 1.609).toFixed(1);
                tempEl.textContent = `${tempF}°F`;
                detailsEl.innerHTML = `<div>Wind: ${windMph} mph</div><div>Humidity: ${humidity}%</div>`;
            } else {
                const windKmh = windNum.toFixed(1); 
                tempEl.textContent = `${parseFloat(cDay).toFixed(1)}°C`;
                detailsEl.innerHTML = `<div>Wind: ${windKmh} km/h</div><div>Humidity: ${humidity}%</div>`;
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
        return `<div class="forecast-block">` + weatherData.list.slice(2,12).map((day)=>{
            const date = new Date(day.dt * 1000); //no api iegūst dt value un konvertē uz ms

            // dabū nedēļas dienu no datuma
            const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

            // format date as yyyy-mm-dd
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth()+1).padStart(2,'0');
            const dd = String(date.getDate()).padStart(2,'0');
            const dateString = yyyy + '-' + mm + '-' + dd; // output izskatās šādi: 2025-09-06

            return `
                <div class="forecast-row">
                    <div class="forecast-time">
                        <div class="day-name">${dayName}</div>
                        <div class="date">${dateString}</div>
                    </div>
                    <div class="forecast-temp" data-c-day="${day.temp.day}" data-wind="${day.speed}" data-humidity="${day.humidity}">
                        <div class="temp">${day.temp.day}°C</div>
                        <div class="details">
                            <div>Wind: ${day.speed} km/h</div>
                            <div>Humidity: ${day.humidity}%</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('') + `</div>`;
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

// ----------LIGHT/DARK MODE----------
const lightDarkBtn = document.querySelector('.light-dark');
const themeIcon = lightDarkBtn.querySelector('.theme-icon');
const themeText = lightDarkBtn.querySelector('.theme-text');

// default mode
document.body.classList.add('light-mode');

lightDarkBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');

    if (document.body.classList.contains('dark-mode')) {
        themeIcon.src = 'dark.png';
        themeIcon.alt = 'Dark Mode';
        themeText.textContent = 'Dark';
    } else {
        themeIcon.src = 'light.png';
        themeIcon.alt = 'Light Mode';
        themeText.textContent = 'Light';
    }
});