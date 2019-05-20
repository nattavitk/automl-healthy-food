import * as axios from "axios"

const BASE_URL = ""

function uploadImages(formData) {
  const photos = formData.getAll("photos")
  const promises = photos.map(x =>
    getImage(x).then(img =>
      upload({
        project: "",
        location: "",
        model: "",
        payload: {
          image: {
            imageBytes: /,(.+)/.exec(img)[1],
          },
        },
      }).then(isHealthy => ({
        id: img,
        originalName: x.name,
        fileName: x.name,
        url: img,
        isHealthy: isHealthy,
      }))
    )
  )
  return Promise.all(promises)
}

function getImage(file) {
  return new Promise((resolve, reject) => {
    const fReader = new FileReader()
    const img = document.createElement("img")

    fReader.onload = () => {
      img.src = fReader.result
      resolve(getBase64Image(img))
    }

    fReader.readAsDataURL(file)
  })
}

function getBase64Image(img) {
  const canvas = document.createElement("canvas")
  canvas.width = img.width
  canvas.height = img.height

  const ctx = canvas.getContext("2d")
  ctx.drawImage(img, 0, 0)
  const dataURL = img.src
  return dataURL
}

function upload(data) {
  const url = `${BASE_URL}/postPredictHealthyFood`
  return axios
    .post(url, data)
    .then(x => x.data)
    .then(x => {
      const prediction = x && x.payload && x.payload[0].displayName
      return isItHealthy(prediction)
    })
}

function isItHealthy(type) {
  switch (type) {
    case "caesar_salad":
    case "cold_tofu":
    case "green_salad":
    case "potato_salad":
    case "spicy_chili_flavored_tofu":
    case "stinky_tofu":
      return true
    case "hamburger":
    case "pizza":
    case "sandwiches":
    default:
      return false
  }
}

export { uploadImages }
