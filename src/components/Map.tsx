import * as React from 'react';
import Map, {
    Marker,
    Popup,
MapRef,
    NavigationControl,
    FullscreenControl,
    ScaleControl,
    GeolocateControl
} from 'react-map-gl/mapbox';
// If using with mapbox-gl v1:
// import Map from 'react-map-gl/mapbox-legacy';
import 'mapbox-gl/dist/mapbox-gl.css';
import {useCallback, useMemo, useRef, useState} from "react";
interface CityData {
    city: string;
    population: string;
    image: string;
    state: string;
    latitude: number;
    longitude: number;
}



import {LocateFixed, MapPinHouse, Phone} from "lucide-react"
import {Booking, useFetchBookings} from "../hook/useFetchBookings";
function RenderMap() {
const {bookings} =useFetchBookings()
    const CITIES = [
        {"city":"New York","population":"8,175,133","image":"http://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Above_Gotham.jpg/240px-Above_Gotham.jpg","state":"New York","latitude":40.6643,"longitude":-73.9385},
        {"city":"Los Angeles","population":"3,792,621","image":"http://upload.wikimedia.org/wikipedia/commons/thumb/5/57/LA_Skyline_Mountains2.jpg/240px-LA_Skyline_Mountains2.jpg","state":"California","latitude":34.0194,"longitude":-118.4108},
        {"city":"Chicago","population":"2,695,598","image":"http://upload.wikimedia.org/wikipedia/commons/thumb/8/85/2008-06-10_3000x1000_chicago_skyline.jpg/240px-2008-06-10_3000x1000_chicago_skyline.jpg","state":"Illinois","latitude":41.8376,"longitude":-87.6818},
        {"city":"Houston","population":"2,100,263","image":"http://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Aerial_views_of_the_Houston%2C_Texas%2C_28005u.jpg/240px-Aerial_views_of_the_Houston%2C_Texas%2C_28005u.jpg","state":"Texas","latitude":29.7805,"longitude":-95.3863},
        {"city":"Phoenix","population":"1,445,632","image":"http://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Downtown_Phoenix_Aerial_Looking_Northeast.jpg/207px-Downtown_Phoenix_Aerial_Looking_Northeast.jpg","state":"Arizona","latitude":33.5722,"longitude":-112.0880},
        {"city":"Philadelphia","population":"1,526,006","image":"http://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Philly_skyline.jpg/240px-Philly_skyline.jpg","state":"Pennsylvania","latitude":40.0094,"longitude":-75.1333},
        {"city":"San Antonio","population":"1,327,407","image":"http://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Downtown_San_Antonio_View.JPG/240px-Downtown_San_Antonio_View.JPG","state":"Texas","latitude":29.4724,"longitude":-98.5251},
        {"city":"San Diego","population":"1,307,402","image":"http://upload.wikimedia.org/wikipedia/commons/thumb/5/53/US_Navy_110604-N-NS602-574_Navy_and_Marine_Corps_personnel%2C_along_with_community_leaders_from_the_greater_San_Diego_area_come_together_to_commemora.jpg/240px-US_Navy_110604-N-NS602-574_Navy_and_Marine_Corps_personnel%2C_along_with_community_leaders_from_the_greater_San_Diego_area_come_together_to_commemora.jpg","state":"California","latitude":32.8153,"longitude":-117.1350},
        {"city":"Dallas","population":"1,197,816","image":"http://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Dallas_skyline_daytime.jpg/240px-Dallas_skyline_daytime.jpg","state":"Texas","latitude":32.7757,"longitude":-96.7967},
        {"city":"San Jose","population":"945,942","image":"http://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Downtown_San_Jose_skyline.PNG/240px-Downtown_San_Jose_skyline.PNG","state":"California","latitude":37.2969,"longitude":-121.8193},
        {"city":"Austin","population":"790,390","image":"http://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Austin2012-12-01.JPG/240px-Austin2012-12-01.JPG","state":"Texas","latitude":30.3072,"longitude":-97.7560},
        {"city":"Jacksonville","population":"821,784","image":"http://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Skyline_of_Jacksonville_FL%2C_South_view_20160706_1.jpg/240px-Skyline_of_Jacksonville_FL%2C_South_view_20160706_1.jpg","state":"Florida","latitude":30.3370,"longitude":-81.6613},
        {"city":"San Francisco","population":"805,235","image":"http://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/San_Francisco_skyline_from_Coit_Tower.jpg/240px-San_Francisco_skyline_from_Coit_Tower.jpg","state":"California","latitude":37.7751,"longitude":-122.4193},
        {"city":"Columbus","population":"787,033","image":"http://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Columbus-ohio-skyline-panorama.jpg/240px-Columbus-ohio-skyline-panorama.jpg","state":"Ohio","latitude":39.9848,"longitude":-82.9850},
        {"city":"Indianapolis","population":"820,445","image":"http://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Downtown_indy_from_parking_garage_zoom.JPG/213px-Downtown_indy_from_parking_garage_zoom.JPG","state":"Indiana","latitude":39.7767,"longitude":-86.1459},
        {"city":"Fort Worth","population":"741,206","image":"http://upload.wikimedia.org/wikipedia/commons/thumb/d/db/FortWorthTexasSkylineW.jpg/240px-FortWorthTexasSkylineW.jpg","state":"Texas","latitude":32.7795,"longitude":-97.3463},
        {"city":"Charlotte","population":"731,424","image":"http://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Charlotte_skyline45647.jpg/222px-Charlotte_skyline45647.jpg","state":"North Carolina","latitude":35.2087,"longitude":-80.8307},
        {"city":"Seattle","population":"608,660","image":"http://upload.wikimedia.org/wikipedia/commons/thumb/3/36/SeattleI5Skyline.jpg/240px-SeattleI5Skyline.jpg","state":"Washington","latitude":47.6205,"longitude":-122.3509},
        {"city":"Denver","population":"600,158","image":"http://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/DenverCP.JPG/240px-DenverCP.JPG","state":"Colorado","latitude":39.7618,"longitude":-104.8806},
        {"city":"El Paso","population":"649,121","image":"http://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Downtown_El_Paso_at_sunset.jpeg/240px-Downtown_El_Paso_at_sunset.jpeg","state":"Texas","latitude":31.8484,"longitude":-106.4270}
    ]
    const [popupInfo, setPopupInfo] = useState<Booking | null>(null);
    const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

    const pinStyle = {
        cursor: 'pointer',
        fill: '#d00',
        stroke: 'none'
    };
    const pins = useMemo(
        () =>
            bookings.map((client, index) => (
                <Marker
                    key={`marker-${index}`}
                    longitude={client.location.lng}
                    latitude={client.location.lat}
                    anchor="bottom"
                    onClick={e => {
                        e.originalEvent.stopPropagation();
                        setPopupInfo(client);
                    }}
                >
                    <div className="flex plac-items-center shadow-lg justify-center bg-blue-400 w-[30px] h-[30px] rounded-full border-2 border-blue-900">
                       <p className="font-bold  flex justify-center place-items-center">
                           {client.clientName.charAt(0)}
                       </p>
                    </div>
                </Marker>
            )),
        [bookings]
    );
    const mapRef = useRef<MapRef>(null);

    const onClientLocation = useCallback((longitude : number, latitude:number) => {
        mapRef.current?.flyTo({center: [longitude, latitude], duration: 2000 , zoom:16,   bearing: 13,
            pitch: 50,});
    }, []);
    return (
       <div className="flex h-full w-full flex-col">
         <div className="flex w-full h-full ">
             <Map ref={mapRef}
                  mapboxAccessToken="pk.eyJ1IjoiamlvdmFuaTEyMyIsImEiOiJjbHl6bWE1Ymkxb2o5MmtzYngxaGJuMWljIn0.olBgfruAbty0QZdtvASqoQ"
                  initialViewState={{

                      longitude: 120.446,
                      latitude:  16.934808006183182,
                      zoom: 16,
                      bearing: 12,
                      pitch: 30,

                  }}
                  projection={"globe"}
                  style={{width:"100%",height:"100%"}}
                  mapStyle="mapbox://styles/mapbox/streets-v12"
             >
                 <GeolocateControl position="top-left" />
                 <FullscreenControl position="top-left" />
                 <NavigationControl position="top-left" />
                 <ScaleControl />
                 {pins}

                 {popupInfo && (
                     <Popup
                         anchor="top"
                         longitude={Number(popupInfo?.location.lng)}
                         latitude={Number(popupInfo?.location.lat)}
                         onClose={() => setPopupInfo(null)}
                     >
                         <div>
                             <p className="font-bold text-black  flex  place-items-center">
                                 {popupInfo?.clientName}
                             </p>
                             <p className=" text-black  flex gap-2  place-items-center">
                                 <Phone size={15}/> {popupInfo?.clientPhone}
                             </p>
                             <p className=" text-black  flex gap-2  place-items-center">
                                 <MapPinHouse size={15}/> {popupInfo?.destination}
                             </p>

                         </div>
                         {/*<img width="100%" src={popupInfo.image} />*/}
                     </Popup>
                 )}
             </Map>
         </div>
           <div className={" h:[200px] lg:h-[100px] grid-rows-auto overflow-y-auto grid grid-cols-2  md:grid-cols-2 lg:grid-cols-6 p-2 lg:p-5 gap-2"}>
               {bookings?.map((client, index) => {

                   return (
                       <div key={index} onClick={()=> onClientLocation(client?.location.lng,client?.location.lat)} className="relative flex h-auto justify-center place-items-center gap-2 rounded-md bg-[#212121] p-1 text-white group hover:bg-[#2b2b2b]">
                           <p className="select-none">{client.clientName}</p>
                           <LocateFixed
                               className="absolute right-3 size-6 text-blue-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                               aria-hidden
                           />
                       </div>
                   )
               })}
           </div>
       </div>
    );
}

export default RenderMap;