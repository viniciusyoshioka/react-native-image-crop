import { requireNativeComponent, ViewStyle } from "react-native"

type ImageCropProps = {
  color: string;
  style: ViewStyle;
};

export const ImageCropViewManager = requireNativeComponent<ImageCropProps>(
    "ImageCropView"
)

export default ImageCropViewManager
