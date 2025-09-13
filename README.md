# AuthToday
AuthToday is een api powered bij puppeteer om in te loggen met je inloggegevens en vervolgens de auth token te krijgen om met de api the kunnen werken

## Hoe te gebruiken?
Clone deze repo en host het zelf op een server. Binnenkort ook een hosted version!

## Een reuqest sturen
Om een request te sturen stuur je een POST request naar: (jouw AuthToday Instance)/get-token
En voeg ook een body toe aan het request wat er zo uit ziet:
```{"username": "", "organisatie": "", "password": ""}```
(Voer natuurlijk wel de velden in)
En dat krijg je een response met je token:
```
{
    "success": true,
    "message": "Login successful",
    "data": {
        "accessToken": "(token)",
        "tokenType": "Bearer",
        "issuedAt": "2025-09-13T06:37:02.039Z"
    }
}
```

## Support
- Microsoft SSO (**MET** 2FA instellen popup)
- Microsoft SSO (**ZONDER** 2FA instellen popup)
- We zijn bezig om meer opties toe te voegen

## Problemen Melden
Als er problemen zijn open een issue in de issues tab op github


## Help eraan mee!
We zoeken op dit moment nog mensen die ook somtoday gebruiken en een van de volgende login methodes hebben:
- SomToday username/password login
  
Ben je iemand of ken je iemand die hieraan wil mee helpen contact me op discord: jessiflessi1
Maar als je gewoon wil helpen met functies toevoegen kan je ook contact opnemen :)
