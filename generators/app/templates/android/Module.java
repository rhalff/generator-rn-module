package <%= packageName %>;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableNativeArray;

import java.util.Map;

public class <%= moduleName %>Module extends ReactContextBaseJavaModule {

  private static final String MODULE_NAME = "<%= moduleName %>Module";

  public <%= moduleName %>Module(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return MODULE_NAME;
  }

  @ReactMethod
  public void <%= reactMethodName %>(Promise promise) {
    WritableNativeArray cars = new WritableNativeArray();
    cars.pushString("Mercedes-Benz");
    cars.pushString("BMW");
    cars.pushString("Porsche");
    cars.pushString("Opel");
    cars.pushString("Volkswagen");
    cars.pushString("Audi");

    if (promise != null) {
      promise.resolve(cars);
    }
  }
}
