<?php
    $city = isset($_GET['city']) ? urlencode($_GET['city']) : 'cesis';
    $data = file_get_contents("https://emo.lv/weather-api/forecast/?city={$city}");
    $weatherData = json_decode($data, true);

    // laika josla no api
    $timezoneOffsetSeconds = $weatherData['city']['timezone'];
    $hoursOffset = $timezoneOffsetSeconds / 3600;

    date_default_timezone_set(sprintf('Etc/GMT%+d', -$hoursOffset)); //php manual

    // aprēķina vēja virzienu no grādiem
    function windDirection($deg) {
        $directions = [
            'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
            'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
        ];
        return $directions[round($deg / 22.5) % 16];
    }

    // izvēlas pareizo temp pēc diennakts laika
    $hour = (int)date('G');

    if ($hour >= 11 && $hour < 18) { // 12:00 - 17:59
        $temp = $weatherData['list'][0]['temp']['day'];
        $feelsLike = $weatherData['list'][0]['feels_like']['day'];
    } elseif ($hour >= 0 && $hour < 5) { // 00:00 - 04:59
        $temp = $weatherData['list'][0]['temp']['night'];
        $feelsLike = $weatherData['list'][0]['feels_like']['night'];
    } elseif ($hour >= 18 && $hour < 23) { // 18:00 - 22:59
        $temp = $weatherData['list'][0]['temp']['eve'];
        $feelsLike = $weatherData['list'][0]['feels_like']['eve'];
    } else { // 05:00 - 10:59
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
    <div class="container">
        <nav class="navbar">
            <div class="nav-left">
                <div class="nav-menu">
                    <button class="menu">
                        <img src="menu-light.png" alt="Menu Light" class="menu-icon">
                    </button>
                    <a href="">VTDT Sky</a>
                </div>
                <div class="nav-location">
                    <img src="location.gif" alt="Location">
                    <p><?php echo $weatherData['city']['name'] . ", " . $weatherData['city']['country']; ?></p>
                </div>
            </div>

            <div class="nav-center">
                <form>
                    <input type="text" name="city" placeholder="Search Location" value="<?php echo isset($_GET['city']) ? htmlspecialchars($_GET['city']) : 'cesis'; ?>">
                </form>
                
                <button class="light-dark">
                    <img src="light.png" alt="Light Mode" class="theme-icon"> 
                    <span class="theme-text">Light</span>
                </button>
            </div>

            <div class="nav-right">
                <button><img src="notifications.gif" alt="Notifications"></button>
                <button><img src="settings.gif" alt="Settings"></button>
            </div>
        </nav>

        <div class="current-weather">
            <div class="weather-header">
                <p>Current Weather</p>
                <select id="unit-select">
                    <option selected value="CK">Celsius and Kilometers</option>
                    <option value="FM">Fahrenheit and Miles</option>
                </select>
            </div>
            <p><strong>Local time: <?php echo date('g:i A'); ?></strong></p>
            <div class="weather-main-row">
                <span class="weather-temp" data-c="<?php echo $temp; ?>">
                    <?php echo number_format($temp, 1); ?>°C
                </span>
                <span class="weather-side">
                    <p><?php echo ucwords($weatherData['list'][0]['weather'][0]['description']); ?></p>
                    <p class="feels-like" data-c="<?php echo $feelsLike; ?>">
                        Feels Like <?php echo number_format($feelsLike, 1); ?>°C
                    </p>
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
                    <span class="wind-speed" data-km="<?php echo $weatherData['list'][0]['speed'] * 3.6; ?>">
                        <?php 
                            $windKmh = $weatherData['list'][0]['speed'] * 3.6;
                            echo number_format($windKmh, 1);
                        ?> km/h
                    </span>
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
                <p>Sun Summary</p>
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
            <div class="days-buttons">
                <button data-day="today">Today</button>
                <button data-day="tomorrow">Tomorrow</button>
                <button data-day="10days">10 Days</button>
            </div>
            <!-- izvada iegūtos forecast datus no sript.js -->
            <div id="days-content"></div>
        </div>
    </div>

    <script>
        // padodu php datus uz js failu
        const weatherData = <?php echo json_encode($weatherData); ?>;
    </script>
    <script src="script.js"></script>
</body>
</html>