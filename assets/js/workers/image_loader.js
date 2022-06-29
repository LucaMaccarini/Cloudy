
self.addEventListener('message', async function(e){
    const imageURL = e.data.url
  
    const response = await fetch(imageURL)
    console.log(response);
    const blob = await response.blob()
  
    self.postMessage({
      is_background: e.data.is_background,
      imageURL: imageURL,
      blob: blob,
    })
  })