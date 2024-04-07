# Slide-show-app

The scope of this project was to build a app that uses simple html, css, and js to build a simple kiosk web interface.
The project is a learning and creative stiching together of other tech.

---

## Project layout.

Nginx Container:

- Nginx to serve the custom kiosk html interface. that updates when its reading the json file from the apache container.

  Apache Container:

- Httpd/apache that serves the JSON file listing the change to the images/assets.

  Filebrowser Container:

- for uploading/download/remove, assets in kiosk web interface. basicly the user/admin to make changes to content that needs to be displayed.

Script/Service custom Container:

- that watches for the changes in the images/photos/assets dir that are changed from the filebrowser container.

---

### The HTML front end

```html:
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Slideshow</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        /* Additional styling if needed */
        .slideshow {
            max-width: 900px;
            margin: auto;
            overflow: hidden;
            position: relative;
        }

        .slides {
            display: flex;
            transition: transform 0.5s ease-in-out;
        }

        .slide {
            min-width: 100%;
            box-sizing: border-box;
        }
    </style>
</head>
<body class="bg-gray-900 p-8">

<div class="slideshow">
    <div class="slides" id="slides">
        <!-- Images will be dynamically added here -->
    </div>
</div>

<script>
    const slidesContainer = document.getElementById('slides');
    let currentIndex = 0;
    let images = []; // Define images array globally
    let slideshowInterval; // Define interval variable globally

    function showSlide(index) {
        const newTransformValue = -index * 100 + '%';
        slidesContainer.style.transform = 'translateX(' + newTransformValue + ')';
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % images.length;
        showSlide(currentIndex);
    }

    function fetchImages() {
    // Ensure this URL points to your server-side script that lists image paths
    Get('<the endpoing for the JSON file that reads the updates>') // you need to change whats between <here and remove <> >
        .then(response => response.json())
        .then(data => {
            images = data.files.map(files => `<div class="slide"><img src="${files}" alt="Slide"></div>`);
            slidesContainer.innerHTML = images.join('');
            slideshowInterval = setInterval(nextSlide, 9000);
        })
        .catch(error => console.error('Error fetching images:', error));
}


    // Pause on hover
    slidesContainer.addEventListener('mouseenter', () => clearInterval(slideshowInterval));
    slidesContainer.addEventListener('mouseleave', () => slideshowInterval = setInterval(nextSlide, 9000));
    // Reset the interval with the correct timing
</script>

</body>
</html>

```

---

### docker stack

docker-compose.yml:

```yml:
version: "3.8"

services:
  nginx:
    image: linuxserver/nginx:latest
    container_name: nginx-kiosk
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Etc/UTC
    volumes:
      - /portainer/Files/AppData/Config/app/nginx:/config
      - /portainer/Files/AppData/Config/app/nginx/photos:/usr/share/nginx/html/photos
      - /portainer/Files/AppData/Config/app/nginx:/usr/share/nginx/html/json
    ports:
      - "8080:80"
    restart: unless-stopped

  apache:
    image: httpd:latest
    container_name: json-backend-api
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Etc/UTC
    volumes:
      - /portainer/Files/AppData/Config/app/apache-httpd:/usr/local/apache2/htdocs/
    ports:
      - "8081:80"
    restart: unless-stopped

  filebrowser:
    image: filebrowser/filebrowser:latest
    volumes:
      - /portainer/Files/AppData/Config/app/:/srv
      - /portainer/Files/AppData/Config/app/filebrowser/filebrowser.db:/database/filebrowser.db
      - /portainer/Files/AppData/Config/app/filebrowser/settings.json:/config/settings.json
    ports:
      - "8082:80"
    restart: unless-stopped

  json-generator:
    image: romeo81/json-app-watcher:v0.3 #this will be updated to be public on dockerhub once it can be compiled for diff arch's
    volumes:
      - /portainer/Files/AppData/Config/app/nginx/photos:/photos
      - /portainer/Files/AppData/Config/app/custom:/json
    environment:
      - PHOTO_DIR=/photos
      - JSON_DIR=/json
    restart: unless-stopped
volumes:
  photos:
  json:

```

---

> [!NOTE]
> file paths for the custom json docker container.
>
> - some file path: /photos
> - some file path: /json/images
