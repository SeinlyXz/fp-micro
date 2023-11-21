#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const char *ssid = "Wifi";
const char *password = "Pw";

void setup() {
  Serial.begin(115200);

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.println("----------------------------------------------------");
  Serial.println("Use this option only on development Mode!");
  Serial.println("[1] GET Data Test");
  Serial.println("[2] POST Data Test");
}

void loop() {
  // Your main code here
  String a = Serial.readStringUntil('\n');
  if(a=="1"){
    // Get data from the endpoint
    getDataFromEndpoint();
  } else if(a == "2"){
    sendDataToServer();
  }
  delay(500);
}

void getDataFromEndpoint() {
  Serial.println("Getting data from the endpoint...");

  WiFiClient wifiClient;
  HTTPClient http;

  // Specify the server and resource path
  http.begin(wifiClient, "http://192.168.100.6:3000/testGet");

  // Make the HTTP GET request
  int httpCode = http.GET();

  // Check the HTTP response code
  Serial.print("HTTP response code: ");
  Serial.println(httpCode);

  if (httpCode > 0) {
    // If the request was successful, read the response
    String payload = http.getString();
    Serial.println("HTTP request successful");
    Serial.println("Response: " + payload);
  } else {
    // If the request failed, print the error
    Serial.println("HTTP request failed");
    Serial.print("Error: ");
    Serial.println(http.errorToString(httpCode).c_str());
  }

  // Close the connection
  http.end();
}

void sendDataToServer(){
  Serial.println("Posting data to the endpoint...");

  WiFiClient wifiClient;
  HTTPClient http;

  http.begin(wifiClient, "http://192.168.100.6:3000/testPost");

  // Specify content-type header
  http.addHeader("Content-Type", "application/json");
  // Make the HTTP POST request
  String test = "pFCJZoXhHsS5u1V1GVwz0Z49xwSshp5BE4k+9F6vNtrmoYQC3G6zZiHIRvac5Ffrg4R9u5HBV5AK0gMooK3hVA==";
  int httpCode = http.POST("{\"fingerprint_id\":\""+ test + "\"}");

  //String jsonData = "{\"api_key\":\"" + variable_key + "\",\"sensor\":\"BME280\",\"value1\":\"24.25\",\"value2\":\"49.54\",\"value3\":\"1005.14\"}";


  // Check the HTTP response code
  Serial.print("HTTP response code: ");
  Serial.println(httpCode);

  if (httpCode > 0) {
    // If the request was successful, read the response
    String payload = http.getString();
    Serial.println("HTTP request successful");
    Serial.println("Response: " + payload);
  } else {
    // If the request failed, print the error
    Serial.println("HTTP request failed");
    Serial.print("Error: ");
    Serial.println(http.errorToString(httpCode).c_str());
  }

  // Close the connection
  http.end();
}
