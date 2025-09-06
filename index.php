<?php
    $data = file_get_contents("https://emo.lv/weather-api/forecast/?city=cesis,latvia");
    $weatherData = json_decode($data, true);
    date_default_timezone_set('Europe/Riga');

    function windDirection($deg) {
        $directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        return $directions[round($deg / 45) % 8];
    }

    $hour = (int)date('G');

    if ($hour >= 6 && $hour < 18) {
        $temp = $weatherData['list'][0]['temp']['day'];
        $feelsLike = $weatherData['list'][0]['feels_like']['day'];
        $label = "Day";
    } elseif ($hour >= 18 && $hour < 22) {
        $temp = $weatherData['list'][0]['temp']['eve'];
        $feelsLike = $weatherData['list'][0]['feels_like']['eve'];
        $label = "Evening";
    } elseif ($hour >= 22 || $hour < 6) {
        $temp = $weatherData['list'][0]['temp']['night'];
        $feelsLike = $weatherData['list'][0]['feels_like']['night'];
        $label = "Night";
    } else {
        $temp = $weatherData['list'][0]['temp']['morn'];
        $feelsLike = $weatherData['list'][0]['feels_like']['morn'];
        $label = "Morning";
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
        <img src="menu.png"></img>
        <p>VTDT Sky</p>
        <img src="location.gif"><?php echo $weatherData['city']['name'] . ", " . $weatherData['city']['country'] ?></img>
        <input type="text" placeholder="Search city...">
        <button><img src="light.png"></img>Light</button>
        <img src="notifications.gif"></img>
        <img src="settings.gif"></img>
    </nav>

    <div class="container">
        <div class="current-weather">
            <p>Current Weather</p>
            <p><strong>Local time: <?php echo date('g:i A'); ?></strong></p>
            <div class="weather-main-row">
                <span class="weather-temp"><?php echo number_format($temp, 1); ?></span>
                <span class="weather-side">
                    <span><?php echo ucwords($weatherData['list'][0]['weather'][0]['description']); ?></span>
                    <span>Feels Like <?php echo number_format($feelsLike, 1) . "°C"; ?></span>
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
            <p>Sun & Moon Summary</p>
            <img src="sun.gif"></img>
            <p>Air Quality</p>
            <img src="sunrise.gif"></img>
            <p>Sunrise <?php echo date('g:i A', $weatherData['list'][0]['sunrise']); ?></p>
            <img src="sunset.gif"></img>
            <p>Sunset <?php echo date('g:i A', $weatherData['list'][0]['sunset']); ?></p>
        </div>

        <div class="days">
            <p>10 days</p>
        </div>
    </div>
</body>
</html>