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
            const tempEl = el.querySelector('.temp');
            const detailsEl = el.querySelector('.details');

            if (unit === 'FM') {
                const tempF = ((parseFloat(c) * 9/5) + 32).toFixed(1);
                const feelsF = ((parseFloat(feels) * 9/5) + 32).toFixed(1);
                tempEl.textContent = `${tempF}°F`;
                detailsEl.innerHTML = `<div>Feels like ${feelsF}°F</div>`;
            } else {
                tempEl.textContent = `${parseFloat(c).toFixed(1)}°C`;
                detailsEl.innerHTML = `<div>Feels like ${parseFloat(feels).toFixed(1)}°C</div>`;
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

// ----------FORECAST DATU IZVADĪŠANA----------
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
                <div class="forecast-temp" data-c="${t.temp}" data-feels="${t.feels}">
                    <div class="temp">${t.temp}°C</div>
                    <div class="details">
                        <div>Feels like ${t.feels}°C</div>
                    </div>
                </div>
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
                <div class="forecast-temp" data-c="${t.temp}" data-feels="${t.feels}">
                    <div class="temp">${t.temp}°C</div>
                    <div class="details">
                        <div>Feels like ${t.feels}°C</div>
                    </div>
                </div>
            </div>
        `).join('') + `</div>`;
    }

    function render10Days() {
        return `<div class="forecast-block">` + weatherData.list.slice(2,12).map(day => {
            const date = new Date(day.dt * 1000);
            const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth()+1).padStart(2,'0');
            const dd = String(date.getDate()).padStart(2,'0');
            const dateString = `${yyyy}-${mm}-${dd}`;

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

    // ----------FORECAST POGAS----------
    document.querySelectorAll(".days button").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".days button").forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            const day = button.getAttribute("data-day");
            content.innerHTML = forecasts[day]();
            convertForecastTemps(unitSelect.value);

            if(day === "10days") setup10DayPopup();
        });
    });

    // defaultā renderē today
    content.innerHTML = renderToday();
    convertForecastTemps(unitSelect.value);
    document.querySelector('.days button[data-day="today"]').classList.add("active");

    // ----------10 DAY POPUP----------
    function setup10DayPopup() {
        document.querySelectorAll('.forecast-temp[data-c-day]').forEach(row => {
            row.parentElement.addEventListener('click', () => {
                const cDay = row.getAttribute('data-c-day');
                const wind = row.getAttribute('data-wind');
                const humidity = row.getAttribute('data-humidity');

                const popupContent = `
                    <div class="forecast-temp" data-c-day="${cDay}" data-wind="${wind}" data-humidity="${humidity}">
                        <div class="temp">${cDay}°C</div>
                        <div class="details">
                            <div>Wind: ${wind} km/h</div>
                            <div>Humidity: ${humidity}%</div>
                        </div>
                    </div>
                `;

                const popup = document.getElementById('forecast-popup');
                popup.querySelector('.popup-content').innerHTML = popupContent;

                popup.classList.add('show');
                popup.classList.remove('hidden');

                convertForecastTemps(unitSelect.value);
            });
        });

        // close popup
        const popup = document.getElementById('forecast-popup');
        popup.querySelector('.popup-close').addEventListener('click', () => {
            popup.classList.remove('show');
            setTimeout(() => popup.classList.add('hidden'), 400);
        });

        popup.querySelector('.popup-overlay').addEventListener('click', () => {
            popup.classList.remove('show');
            setTimeout(() => popup.classList.add('hidden'), 400);
        });
    }
});

// ----------LIGHT/DARK MODE----------
document.addEventListener("DOMContentLoaded", () => {
    const lightDarkBtn = document.querySelector('.light-dark');
    const themeIcon = lightDarkBtn.querySelector('.theme-icon');
    const themeText = lightDarkBtn.querySelector('.theme-text');

    const menuBtn = document.querySelector('.menu');
    const menuIcon = menuBtn ? menuBtn.querySelector('.menu-icon') : null;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.src = 'dark.png';
        themeIcon.alt = 'Dark Mode';
        themeText.textContent = 'Dark';
        if (menuIcon) {
            menuIcon.src = 'menu-dark.png';
            menuIcon.alt = 'Menu Dark';
        }
    } else {
        document.body.classList.add('light-mode');
        themeIcon.src = 'light.png';
        themeIcon.alt = 'Light Mode';
        themeText.textContent = 'Light';
        if (menuIcon) {
            menuIcon.src = 'menu-light.png';
            menuIcon.alt = 'Menu Light';
        }
    }

    lightDarkBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode');

        if (document.body.classList.contains('dark-mode')) {
            themeIcon.src = 'dark.png';
            themeIcon.alt = 'Dark Mode';
            themeText.textContent = 'Dark';
            if (menuIcon) {
                menuIcon.src = 'menu-dark.png';
                menuIcon.alt = 'Menu Dark';
            }
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.src = 'light.png';
            themeIcon.alt = 'Light Mode';
            themeText.textContent = 'Light';
            if (menuIcon) {
                menuIcon.src = 'menu-light.png';
                menuIcon.alt = 'Menu Light';
            }
            localStorage.setItem('theme', 'light');
        }
    });
});