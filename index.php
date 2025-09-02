<?php
    $data = file_get_contents("https://emo.lv/weather-api/forecast/?city=cesis,latvia");
    $weatherData = json_decode($data, true);

    echo $weatherData['city'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VTDT Sky</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">

    </div>
</body>
</html>