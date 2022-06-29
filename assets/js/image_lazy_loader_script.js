const ImageLoaderWorker = new Worker('js/workers/image_loader.js')

ImageLoaderWorker.addEventListener('message', function(e){

  const imageData = e.data

  const objectURL = URL.createObjectURL(imageData.blob)

  if(imageData.is_background == true){
    const imageElements = document.querySelectorAll(`*[data-backgrownd-image='${imageData.imageURL}']`)
    imageElements.forEach(imageElement => {
      imageElement.style.backgroundImage = "url('"+objectURL+"')"
      imageElement.removeAttribute('data-src')
    })

   
  }else{
    const imageElements = document.querySelectorAll(`img[data-src='${imageData.imageURL}']`)
    imageElements.forEach(imageElement => {
      imageElement.setAttribute('src', objectURL)
      imageElement.removeAttribute('data-src')
    })
    
  }
})


const imgElements = document.querySelectorAll('img[data-src]')
const backElements = document.querySelectorAll('*[data-backgrownd-image]')

imgElements.forEach(imageElement => {
  const imageURL = imageElement.getAttribute('data-src')

  ImageLoaderWorker.postMessage({
        is_background: false,
        url: imageURL,
      })
})

backElements.forEach(imageElement => {
  const imageURL = imageElement.getAttribute('data-backgrownd-image')

  ImageLoaderWorker.postMessage({
        is_background: true,
        url: imageURL,
      })
})


