fetch('https://api.openweathermap.org/data/2.5/forecast?lat=10&lon=10&appid=99892769f0d2057ba24f30019b3b7586')
.then(res => response.json())
.then(data => {
    console.log(data)
})
