
self.addEventListener('message', async function(e){
    let imageURL = e.data.url
  
    let response = await fetch(imageURL)
    //console.log(response);
    let blob = await response.blob()
  
    self.postMessage({
      is_background: e.data.is_background,
      imageURL: imageURL,
      blob: blob,
    })
  })