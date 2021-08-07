import React, { useRef, Component } from "react"
import { findNodeHandle, NativeSyntheticEvent, requireNativeComponent, StyleProp, UIManager, ViewStyle } from "react-native"


export type OnImageSavedResponse = {
    uri: string;
    width: number;
    height: number;
}


export type OnSaveImageErrorResponse = {
    message: string;
}


export type ImageCropProps = {
    style?: StyleProp<ViewStyle>;
    sourceUrl: string;
    keepAspectRatio?: boolean;
    aspectRatio?: {
        width: number;
        height: number;
    };
    onImageSaved?: (response: OnImageSavedResponse) => void;
    onSaveImageError?: (response: string) => void;
}


const ImageCropViewManager = requireNativeComponent<ImageCropProps>("ImageCropView")


export class ImageCrop extends Component<ImageCropProps> {


    constructor(props: ImageCropProps) {
        super(props)
    }


    public static defaultProps = {
        keepAspectRatio: false,
    }


    private imageCropRef = useRef(null)


    saveImage = () => {
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.imageCropRef.current),
            UIManager.getViewManagerConfig("ImageCropView").Commands.saveImage,
            []
        )
    }


    render() {
        const { style, sourceUrl, keepAspectRatio, aspectRatio, onImageSaved, onSaveImageError } = this.props

        return (
            <ImageCropViewManager
                ref={this.imageCropRef}
                style={style}
                sourceUrl={sourceUrl}
                keepAspectRatio={keepAspectRatio}
                aspectRatio={aspectRatio}
                onImageSaved={(event: NativeSyntheticEvent<OnImageSavedResponse>) => {
                    if (onImageSaved) {
                        onImageSaved(event.nativeEvent)
                    }
                }}
                onSaveImageError={(event: NativeSyntheticEvent<OnSaveImageErrorResponse>) => {
                    if (onSaveImageError) {
                        onSaveImageError(event.nativeEvent.message)
                    }
                }}
            />
        )
    }
}
