<?php
    $data = file_get_contents("https://emo.lv/weather-api/forecast/?city=cesis,latvia");
    $weatherData = json_decode($data, true);
    date_default_timezone_set('Europe/Riga');

    function windDirection($deg) {
        $directions = [
            'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
            'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
        ];
        return $directions[round($deg / 22.5) % 16];
    }

    $hour = (int)date('G');

    if ($hour >= 12 && $hour < 18) {
        $temp = $weatherData['list'][0]['temp']['day'];
        $feelsLike = $weatherData['list'][0]['feels_like']['day'];
    } elseif ($hour >= 0 && $hour < 5) {
        $temp = $weatherData['list'][0]['temp']['night'];
        $feelsLike = $weatherData['list'][0]['feels_like']['night'];
    } elseif ($hour >= 18 || $hour < 23) {
        $temp = $weatherData['list'][0]['temp']['eve'];
        $feelsLike = $weatherData['list'][0]['feels_like']['eve'];
    } else {
        $temp = $weatherData['list'][0]['temp']['morn'];
        $feelsLike = $weatherData['list'][0]['feels_like']['morn'];
    }
?>

<!DOCTYPE html>
<html lang="lv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VTDT Sky</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav class="navbar">
        <span class="title">
            <button><img src="menu.png" alt="Menu"></img></button>
            <p>VTDT Sky</p>
        </span>
        <span class="location">
            <img src="location.gif" alt="Location">
                <?php echo $weatherData['city']['name'] . ", " . $weatherData['city']['country'] ?>
            </img>
        </span>
        <span class="search-switch">
            <input type="text" placeholder="Search city...">
            <button class="light-dark"><img src="light.png"></img>Light</button>
        </span>
        <span class="notif-set">
            <button><img src="notifications.gif" alt="Notifications"></img></button>
            <button><img src="settings.gif" alt="Settings"></img></button>
        </span>
    </nav>

    <div class="container">
        <div class="current-weather">
            <div class="weather-header">
                <p>Current Weather</p>
                <select>
                    <option value="CK">Celsius and Kilometers</option>
                    <option value="FM">Fahrenheit and Miles</option>
                </select>
            </div>
            <p><strong>Local time: <?php echo date('g:i A'); ?></strong></p>
            <div class="weather-main-row">
                <span class="weather-temp"><?php echo number_format($temp, 1); ?></span>
                <span class="weather-side">
                    <p><?php echo ucwords($weatherData['list'][0]['weather'][0]['description']); ?></p>
                    <p>Feels Like <?php echo number_format($feelsLike, 1) . "°C"; ?></p>
                </span>
            </div>
            <p>
                Current wind direction: 
                <?php 
                    $deg = $weatherData['list'][0]['deg'];
                    echo windDirection($deg);
                ?>
            </p>
        </div>

        <div class="air-quality">
            <img src="air-quality.gif"></img>
            <span class="text-data">
                <p>Air Quality</p>
                <p class="data"><?php echo $weatherData['list'][0]['clouds'] ?></p>
            </span>
            
        </div>
        
        <div class="wind">
            <img src="wind.gif"></img>
            <span class="text-data">
                <p>Wind</p>
                <p class="data">
                    <?php 
                        $windKmh = $weatherData['list'][0]['speed'] * 3.6;
                        echo number_format($windKmh, 1) . " km/h";
                    ?>
                </p>
            </span>
            
        </div>

        <div class="humidity">
            <img src="humidity.gif"></img>
            <span class="text-data">
                <p>Humidity</p>
                <p class="data"><?php echo $weatherData['list'][0]['humidity'] . "%"; ?></p>
            </span>
        </div>

        <div class="visibility">
            <img src="visibility.gif"></img>
            <span class="text-data">
                <p>Visibility</p>
                <p class="data">N/A</p>
            </span>
        </div>
        
        <div class="pressure-in">
            <img src="pressure.gif"></img>
            <span class="text-data">
                <p>Pressure</p>
                <p class="data">
                    <?php 
                        $pressureIn = $weatherData['list'][0]['pressure'] * 0.02953;
                        echo number_format($pressureIn, 2) . " in";
                    ?>
                </p>
            </span>
        </div>

        <div class="pressure">
            <img src="pressure.gif"></img>
            <span class="text-data">
                <p>Pressure</p>
                <p class="data"><?php echo $weatherData['list'][0]['pressure'] . "°"; ?></p>
            </span>
        </div>

        <div class="sun-moon">
            <span class="sun-moon-left">
                <p>Sun & Moon Summary</p>
                <span class="sun-air">
                    <img src="sun.gif" alt="Sun" class="sun">
                    <span class="air-column">
                        <p>Air Quality</p>
                        <p><strong><?php echo $weatherData['list'][0]['clouds'] ?></strong></p>
                    </span>
                </span>
            </span>
            <span class="set-rise">
                <span>
                    <img src="sunrise.gif" alt="Sunrise">
                    <p>Sunrise<br><strong><?php echo date('g:i A', $weatherData['list'][0]['sunrise']); ?></strong></p>
                </span>
                <span>
                    <img src="sunset.gif" alt="Sunset">
                    <p>Sunset<br><strong><?php echo date('g:i A', $weatherData['list'][0]['sunset']); ?></strong></p>
                </span>
            </span>
        </div>

        <div class="days">
            <button>Today</button>
            <button>Tomorrow</button>
            <button>10 Days</button>
        </div>
    </div>
</body>
</html>