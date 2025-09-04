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
    <div class="container">
        <nav class="navbar">
            <p>VTDT Sky</p>
            <p><?php echo $weatherData['city']['name'] . ", " . $weatherData['city']['country'] ?></p>
        </nav>

        <div class="current-weather">
            <p>Current Weather</p>
            <p><strong>Local time: <?php echo date('g:i A'); ?></strong></p>
            <p><?php echo number_format($temp, 1); ?>°C</p>
            <p>
                Current wind direction: 
                <?php 
                    $deg = $weatherData['list'][0]['deg'];
                    echo windDirection($deg);
                ?>
            </p>
            <p><?php echo $weatherData['list'][0]['weather'][0]['description']; ?></p>
            <p>Feels like: <?php echo number_format($feelsLike, 1); ?>°C</p>
        </div>

        <div class="air-quality">
            <p>Air Quality</p>
        </div>
        
        <div class="wind">
            <p>Wind Speed</p>
            <p>
                <?php 
                    $windKmh = $weatherData['list'][0]['speed'] * 3.6;
                    echo number_format($windKmh, 1) . " km/h";
                ?>
            </p>
        </div>

        <div class="humidity">
            <p>Humidity</p>
            <p><?php echo $weatherData['list'][0]['humidity'] . "%"; ?></p>
        </div>

        <div class="visibility">
            <p>Visibility</p>
        </div>
        
        <div class="pressure-in">
            <p>Pressure</p>
            <p>
                <?php 
                    $pressureIn = $weatherData['list'][0]['pressure'] * 0.02953;
                    echo number_format($pressureIn, 2) . " in";
                ?>
            </p>
        </div>

        <div class="pressure">
            <p>Pressure</p>
            <p><?php echo $weatherData['list'][0]['pressure'] . "°"; ?></p>
        </div>

        <div class="sun-moon">
            <p>Sun & Moon Summary</p>
        </div>

        <div class="days">
            <p>10 days</p>
        </div>
    </div>
</body>
</html>