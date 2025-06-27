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
    const [popupInfo, setPopupInfo] = useState<Booking | null>(null);

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