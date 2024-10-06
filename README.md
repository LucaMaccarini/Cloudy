# Cloudy

<img src="https://github.com/LucaMaccarini/Cloudy/blob/main/assets/images/logo.svg" width="200">

High-performance weather site!

# Description
This repository contains the project I submitted for an exam during my Bachelor’s degree.

All the information and considerations on the performances of this project have been written in Italian and are available in the file [Relazione progetto Luca Maccarini.pdf](./Relazione%20progetto%20Luca%20Maccarini.pdf).
# Code
In the code, particular logic has been intentionally implemented using JavaScript workers, for image download, rendering and for handling AJAX calls. These choices were required by the project guidelines, as it was crucial to maximize page responsiveness while minimizing the amount of time the main thread had to spend on executing JavaScript code.

All the credentials or API keys used are "useless" accounts or free APIs, so I left them in the source code.

# Site link
To see how this web application looks, it runs here: https://cloudy-7o5q.onrender.com.  
Please note that the server on Render is free and has performance issues. The first request after a period of inactivity takes longer because the entire web app needs to wake up.
