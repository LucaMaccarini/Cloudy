const ImageLoaderWorker = new Worker('js/workers/image_loader.js')

ImageLoaderWorker.addEventListener('message', function(e){

  let imageData = e.data

  let objectURL = URL.createObjectURL(imageData.blob)

  if(imageData.is_background == true){
    let imageElements = document.querySelectorAll(`*[data-background-image='${imageData.imageURL}']`)
    imageElements.forEach(imageElement => {
      imageElement.style.backgroundImage = "url('"+objectURL+"')"
      imageElement.removeAttribute('data-src')
    })

   
  }else{
    let imageElements = document.querySelectorAll(`img[data-src='${imageData.imageURL}']`)
    imageElements.forEach(imageElement => {
      imageElement.setAttribute('src', objectURL)
      imageElement.removeAttribute('data-src')

      if(imageElement.classList.contains("show_after_load"))
        imageElement.classList.remove("show_after_load");
    })
    
  }
})



function load_background_images(){
  let backElements = document.querySelectorAll('*[data-background-image]');
  backElements.forEach(imageElement => {
    let imageURL = imageElement.getAttribute('data-background-image')

    ImageLoaderWorker.postMessage({
          is_background: true,
          url: imageURL,
        })
  })
}

function load_images(){
  let imgElements = document.querySelectorAll('img[data-src]')
  imgElements.forEach(imageElement => {
    let imageURL = imageElement.getAttribute('data-src')

    ImageLoaderWorker.postMessage({
          is_background: false,
          url: imageURL,
        })
  })
}

load_background_images();
load_images();



