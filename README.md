# react-native-image-crop

React Native library to crop images

## Platform
Currently, this library is **not** implemented for iOS, **only Android**

## Installation

```sh
yarn add https://github.com/viniciusyoshioka/react-native-image-crop
```

## Permissions

Add the following permissions in `AndroidManifest.xml` file

```xml
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

## API and usage

### Props

| Prop            | Type      | Required | Description |
|-----------------|-----------|:--------:|-------------|
| sourceUrl       | string    | *        | Path to the source image |
| keepAspectRatio | boolean   |          | Define if aspect ratio is fixed |
| aspectRatio     | object    |          | Object specifying the width and height of aspect ratio |
| onSaveImage     | function  |          | Function executed when image is cropped |
| onCropError     | function  |          | Function executed when an error is thrown while cropping |

Example:

```ts
import { ImageCrop, OnImageSavedResponse } from "react-native-image-crop"


function onImageSaved(response: OnImageSavedResponse) {
    // Code executed after cropped image is saved
}

function onSaveImageError(response: string) {
    // Code executed after an error occur trying to crop the image
}

return (
    <ImageCrop
        sourceUrl={"path/to/image.jpg"}
        onSaveImage={onImageSaved}
        onCropError={onSaveImageError}
    />
)
```

### saveImage

```js
saveImage(): void
```

Save image, cropping it in the selected area of ImageCrop component.

Example:

```ts
import { ImageCrop, OnImageSavedResponse } from "react-native-image-crop"


const imageCropRef = useRef<ImageCrop>(null)


function saveCroppedImage() {
    // Function to crop the image and save
    imageCropRef.current?.saveImage()
}

function onImageSaved(response: OnImageSavedResponse) {
    // Code executed after cropped image is saved
}

function onSaveImageError(response: string) {
    // Code executed after an error occur trying to crop the image
}


return (
    <ImageCrop
        ref={imageCropRef}
        sourceUrl={"path/to/image.jpg"}
        onSaveImage={onImageSaved}
        onCropError={onSaveImageError}
    />
)
```

## Types

### OnImageSavedResponse

Object received as param of function in `onImageSaved` prop.

* `uri`: string with the path of cropped image;
* `width`: number of cropped image width;
* `height`: number of cropped image height.

## License

MIT
