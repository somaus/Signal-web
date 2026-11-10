const { withAndroidManifest } = require("expo/config-plugins");

/**
 * Android는 CAMERA 권한이 있으면 카메라·자동초점을 "꼭 필요한 하드웨어"로 간주해서,
 * Google Play가 카메라가 없는 기기에는 설치를 막는다. 앱은 갤러리·PDF로도 쓸 수 있으니
 * 두 기능을 선택 사항(required=false)으로 선언한다.
 * https://developer.android.com/guide/topics/manifest/uses-feature-element#permissions
 */
const OPTIONAL_FEATURES = ["android.hardware.camera", "android.hardware.camera.autofocus"];

module.exports = function withOptionalCamera(config) {
  return withAndroidManifest(config, (mod) => {
    const manifest = mod.modResults.manifest;
    const features = manifest["uses-feature"] ?? [];
    for (const name of OPTIONAL_FEATURES) {
      const existing = features.find((feature) => feature.$["android:name"] === name);
      if (existing) existing.$["android:required"] = "false";
      else features.push({ $: { "android:name": name, "android:required": "false" } });
    }
    manifest["uses-feature"] = features;
    return mod;
  });
};
