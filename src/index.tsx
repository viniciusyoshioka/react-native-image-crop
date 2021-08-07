import React, { PureComponent, createRef } from "react"
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
    onSaveImage?: (response: OnImageSavedResponse) => void;
    onCropError?: (response: string) => void;
}


const ImageCropViewManager = requireNativeComponent("ImageCropView")


export class ImageCrop extends PureComponent<ImageCropProps> {


    constructor(props: ImageCropProps) {
        super(props)
    }


    public static defaultProps = {
        keepAspectRatio: false,
    }


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private imageCropRef = createRef<any>()


    saveImage = () => {
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.imageCropRef.current),
            UIManager.getViewManagerConfig("ImageCropView").Commands.saveImage,
            []
        )
    }


    render() {
        const { style, sourceUrl, keepAspectRatio, aspectRatio, onSaveImage, onCropError } = this.props

        return (
            <ImageCropViewManager
                ref={this.imageCropRef}
                style={style}
                sourceUrl={sourceUrl}
                keepAspectRatio={keepAspectRatio}
                aspectRatio={aspectRatio}
                onImageSaved={(event: NativeSyntheticEvent<OnImageSavedResponse>) => {
                    if (onSaveImage) {
                        onSaveImage(event.nativeEvent)
                    }
                }}
                onSaveImageError={(event: NativeSyntheticEvent<OnSaveImageErrorResponse>) => {
                    if (onCropError) {
                        onCropError(event.nativeEvent.message)
                    }
                }}
            />
        )
    }
}
