import { Injectable } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { Base64 } from '@ionic-native/base64';

@Injectable()
export class CameraProvider {
  constructor(private camera: Camera, private crop: Crop, private base64: Base64) {}

  getPictureFromCamera(crop) {
    return this.getImage(this.camera.PictureSourceType.CAMERA, crop);
  }

  getPictureFromPhotoLibrary(crop) {
    return this.getImage(this.camera.PictureSourceType.PHOTOLIBRARY, crop);
  }

  getVideoFromCamera(crop) {
    return this.getVideo(this.camera.PictureSourceType.CAMERA, crop);
  }

  getVideoFromPhotoLibrary(crop) {
    return this.getVideo(this.camera.PictureSourceType.PHOTOLIBRARY, crop);
  }

  getVideo(a, b) {}
  // This method takes optional parameters to make it more customizable
  getImage(pictureSourceType, crop = true) {
    const options = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: pictureSourceType,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
      correctOrientation: true,
    };

    // If set to crop, restricts the image to a square of 600 by 600
    // if (crop) {
    //   options['targetWidth'] = 800;
    //   options['targetHeight'] = 800;
    // }

    return this.camera
      .getPicture(options)
      .then(
        fileUri => {
          return this.crop.crop('file://' + fileUri, {
            quality: 100,
          });
        },
        error => {
          console.log('CAMERA ERROR -> ' + JSON.stringify(error));
        }
      )
      .then((path: any) => {
        return this.base64.encodeFile(path);
      })
      .then(image => {
        return image;
      });
  }

  generateFromImage(img, quality, callback) {
    const canvas: any = document.createElement('canvas');
    const image = new Image();

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL('image/jpeg', quality);

      callback(dataUrl);
    };
    image.src = img;
  }

  getImageSize(data_url) {
    var head = 'data:image/jpeg;base64,';
    return (((data_url.length - head.length) * 3) / 4 / (1024 * 1024)).toFixed(4);
  }
}
