package com.reactnativeimagecrop

import android.graphics.Bitmap.CompressFormat
import android.net.Uri
import android.view.View
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.theartofdev.edmodo.cropper.CropImageView
import java.io.File
import java.util.*


class ImageCropViewManager : SimpleViewManager<View>() {


  companion object {
    private const val SOURCE_URL_PROP = "sourceUrl"
    private const val KEEP_ASPECT_RATIO_PROP = "keepAspectRatio"
    private const val ASPECT_RATIO_PROP = "aspectRatio"
    private const val SAVE_IMAGE_COMMAND = 1
    private const val SAVE_IMAGE_COMMAND_NAME = "saveImage"
    private const val ON_IMAGE_SAVED = "onImageSaved"
    private const val ON_SAVE_IMAGE_ERROR = "onSaveImageError"
  }


  override fun getName(): String {
    return "ImageCropView"
  }

  override fun createViewInstance(reactContext: ThemedReactContext): CropImageView {
    val cropImageView = CropImageView(reactContext)
    cropImageView.setOnCropImageCompleteListener { view, result ->
      val response = Arguments.createMap()
      response.putString("uri", result.uri.path)
      response.putInt("width", result.cropRect.width())
      response.putInt("height", result.cropRect.height())
      val viewReactContext = view.context as ReactContext
      viewReactContext
        .getJSModule(RCTEventEmitter::class.java)
        .receiveEvent(view.id, ON_IMAGE_SAVED, response)
    }
    return cropImageView
  }


  @ReactProp(name = SOURCE_URL_PROP)
  fun setSourceUrl(view: CropImageView, url: String?) {
    view.setImageUriAsync(Uri.parse(url))
  }

  @ReactProp(name = KEEP_ASPECT_RATIO_PROP)
  fun setFixedAspectRatio(view: CropImageView, fixed: Boolean?) {
    view.setFixedAspectRatio(fixed!!)
  }

  @ReactProp(name = ASPECT_RATIO_PROP)
  fun setAspectRatio(view: CropImageView, aspectRatio: ReadableMap?) {
    if (aspectRatio != null) {
      view.setAspectRatio(aspectRatio.getInt("width"), aspectRatio.getInt("height"))
    } else {
      view.clearAspectRatio()
    }
  }


  override fun receiveCommand(root: View, commandId: Int, args: ReadableArray?) {
    root as CropImageView

    when (commandId) {
      SAVE_IMAGE_COMMAND -> {
        var extension = "jpg"
        var format = CompressFormat.JPEG
        if (root.croppedImage.hasAlpha()) {
          extension = "png"
          format = CompressFormat.PNG
        }

        try {
          val path = File(root.context.cacheDir, UUID.randomUUID().toString() + "." + extension).toURI().toString()
          root.saveCroppedImageAsync(Uri.parse(path), format, 100)
        } catch (e: Exception) {
          val response = Arguments.createMap()
          response.putString("message", e.message)
          val reactContext = root.context as ReactContext
          reactContext
            .getJSModule(RCTEventEmitter::class.java)
            .receiveEvent(root.id, ON_SAVE_IMAGE_ERROR, response)
        }
      }
      else -> throw IllegalArgumentException("Unknown argument commandId")
    }
  }

  override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any>? {
    return MapBuilder.builder<String, Any>()
      .put(ON_IMAGE_SAVED, MapBuilder.of<String, Any>("registrationName", ON_IMAGE_SAVED))
      .put(ON_SAVE_IMAGE_ERROR, MapBuilder.of<String, Any>("registrationName", ON_SAVE_IMAGE_ERROR))
      .build()
  }

  override fun getCommandsMap(): Map<String, Int>? {
    return MapBuilder.of(
      SAVE_IMAGE_COMMAND_NAME, SAVE_IMAGE_COMMAND
    )
  }
}
