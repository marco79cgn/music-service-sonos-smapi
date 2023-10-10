# Music Service Sonos SMAPI

A standalone server that is built on top of the Sonos Music API (SMAPI). It can be used as a basic framework to implement your own radio/music service on your Sonos speakers.

**This is currently for development testing purposes**

<img src="https://i.imgur.com/n7tPVWT.png" width="700"/>

## Features

- show custom radio stations in Sonos by just adding them to the source file with name, cover and stream url

## Missing Features

- Podcast support
- Audiobook support
- Viewing audiobook & podcast metadata such as descriptions

## How it works

When you use the Sonos app, you have the ability to add "music services" (Audible, YouTube Music, Libby, iHeartRadio, etc.). These services have been developed, submitted to Sonos for approval, and made available to all Sonos users on behalf of the companies that own them. Each company (developer) is responsible for hosting the actual service itself.

The services are built on top of the [Sonos Music API](https://developer.sonos.com/reference/sonos-music-api/) (aka SMAPI), which is a [SOAP API](https://stoplight.io/api-types/soap-api). The service functions as a middleware for the Sonos device to reach out to, and in response get information on the items available, metadata, stream URIs, etc.

For development puropses, Sonos allows you to manually configure a local service, called a "Custom Service", which is what this application uses. This is done through the Custom Service Descriptor page that is hosted on each Sonos device. This is how this application works -- it is configured as a Custom Service on a local device and made available to all users on the network.

## How this server works

There are 3 main pieces

### `sonos.wsdl`

The WSDL (Web Service Description Language) file provided by Sonos. This is used in SOAP to describe a SOAP service.

### `sonos-service.js`

Our implementation of the `sonos.wsdl` file (the entire thing does not need to be implemented -- radio stations only require a select few pieces). It can be thought of as the SOAP router and controller. There is a decent amount of "SOAP magic" that goes on here -- it creates reponse XML tags in it's reponses based on the function name, etc.

### `server.js`

This is the actual express and soap server.

The SOAP server is brought up (using express to handle network requests) -- it's told where to listen (`/wsdl` by default), the WSDL file it should abide by (`SONOS_WSDL_FILE`), and the service it should host (`SONOS_SOAP_SERVICE`)

## How to use

### Prerequisites

- A set of Sonos speakers  
  - You'll need the IP address of one of the speakers  
- The latest version of the Sonos mobile app  
- Audiobookshelf running and accesssible  
Optional:  
- A domain/URI configured to point at this server (with a valid HTTPS certificate)  
  - At least for any modern version of Android, non-HTTPS requests signed by a cert in the CA-chain android already has fails. I have a reverse proxy set up to point to my `SOAP_URI` on `HTTP_PORT` for this with a cert configured on it.

### Step 1: Configuring a Custom Service Descriptor (CSD)

1. Browse to `http://<SONOS_SPEAKER_IP>:1400/customsd.htm`
2. Input the following information:
   - Service Name: ARD Audiothek
   - Endpoint URL: `http://<the_url_you_defined_for_this_server_above>/wsdl`
   - Secure Endpoint URL: `https://<the_url_you_defined_for_this_server_above>/wsdl`
   - Polling interval: 10
   - Authentication SOAP header policy: Anonymous
   - Manifest
     - Version: 1.0
     - URI: `https:<the_url_you_defined_for_this_server_above>/manifest`
3. Submit (sometimes this randomly fails, and you need to go back and try again). You should see "Success" if it worked.
4. Add the new service to the Sonos mobile app
   - Settings -> Services + Voice -> Search for your new service -> "Add to Sonos" -> "Set up ARD Audiothek"
5. `ARD Audiothek` should now be listed as a service in the "Browse" tab

### Step 2: Setting up your ARD Audiothek Sonos Server

1. Clone / download and enter the directory containing this repo
   - `git clone git@github.com:marco79cgn/music-service-sonos-smapi.git && cd music-service-sonos-smapi`
2. Edit `config.js` to match your necessary settings. A few minor things to note:
   - `SOAP_ENDPOINT`: This is the `/wsdl` part of the `Endpoint URL` and `Secure Endpoint URL` defined in the CSD earlier
   - `SOAP_URI`: This is the URL part of the `Endpoint URL` and `Secure Endpoint URL` defined in the CSD earlier -- the URL where this server will be acessible from

```
module.exports = Object.freeze({
   HTTP_PORT: , // what port to for express to listen on. Where your SOAP && HTTP requests should end up
   SOAP_ENDPOINT: '/wsdl', // what endpoint sonos will reach out to. Defined in the custom service descriptor
   SONOS_WSDL_FILE: fs.readFileSync('sonos.wsdl', 'utf8'),
   SOAP_URI: '' // https://yoursoap.url.com
})
```

3. Update the `sonos.wsdl` file (line 2063) with your SOAP_URI

```
    <wsdl:service name="Sonos">
        <wsdl:port name="SonosSoap" binding="tns:SonosSoap">
		<soap:address location=""/> <!-- Update with SOAP_URI -->
        </wsdl:port>
    </wsdl:service>
```

### Step 3: Start the server and enjoy

1. `nodemon server.js`
2. Open the Sonos mobile app and select ARD Audiothek (or whatever you name it)
3. Select a radio station to listen to
