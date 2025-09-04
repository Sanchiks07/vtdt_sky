<?php
    $data = file_get_contents("https://emo.lv/weather-api/forecast/?city=cesis,latvia");
    $weatherData = json_decode($data, true);
    date_default_timezone_set('Europe/Riga');
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
            <p><strong>Local time: </strong><?php echo date('H:i'); ?></p>
            <p>Current wind direction: </p>
            <p>...</p>
            <p>Feels like:  </p>
        </div>

        <div class="air-quality">
            <p>Air Quality</p>
        </div>
        
        <div class="wind">
            <p>Wind</p>
        </div>

        <div class="humidity">
            <p>Humidity</p><br>
        </div>

        <div class="visibility">
            <p>Visibility</p>
        </div>
        
        <div class="pressure-in">
            <p>Pressure (in)</p>
        </div>

        <div class="pressure">
            <p>Pressure</p>
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