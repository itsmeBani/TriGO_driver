import React, {useEffect, useState} from 'react';
import './Tab2.css';
import {IonButton, IonIcon} from '@ionic/react';
import {arrowBack} from 'ionicons/icons';
import {useHistory} from 'react-router-dom';
import {
    getFirestore,
    collection,
    getDocs,
} from 'firebase/firestore';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {app} from '../firebaseConfig';
import {CheckCircle, CheckIcon, Clock, Loader, RotateCcw, XCircle} from "lucide-react";
type Status = 'accepted' | 'pending' | 'rejected';

import {useUpdateStatus} from "../hook/useUpdateStatus";
import {useFetchBookings} from "../hook/useFetchBookings";
interface Booking {
    id: string;
    client_name: string;
    pickup_location: string;
    dropoff_location: string;
    date: string;
    status: Status;
    driverId?: string;
}



export const STATUS_STYLES: Record<
    Status,
    { text: string; bg: string }
> = {
    accepted: {
        text: 'text-emerald-300',
        bg: 'bg-emerald-500/10 backdrop-blur-sm border border-emerald-400/20',
    },
    pending: {
        text: 'text-amber-300',
        bg: 'bg-amber-500/10 backdrop-blur-sm border border-amber-400/20',
    },
    rejected: {
        text: 'text-rose-300',
        bg: 'bg-rose-500/10 backdrop-blur-sm border border-rose-400/20',
    },
};
const History: React.FC = () => {

    const {bookings,loading,error,reload}=useFetchBookings()
    const { updateStatus} = useUpdateStatus(reload);

    if (loading) {
        return (
            <div className="flex w-full gap-2 h-full place-items-center justify-center">
                <Loader size={30} className={"animate-spin text-blue-500"}/>
                <p>fetching history..</p>
            </div>
        );
    }
    if (error) return <div>{error.message}</div>;

    return (
        <section className="h-full overflow-y-auto flex flex-col">

            <header className="text-blue-400 text-center p-3 lg:p-10 text-3xl">Booking History (Accepted/Rejected)
            </header>
            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <div className="grid grid-cols-1  md:grid-cols-2  gap-3   lg:grid-cols-4  p-3 lg:p-10">
                    {bookings.map((booking) => {

                        const {text, bg} =
                        STATUS_STYLES[booking.status as keyof typeof STATUS_STYLES] ?? {
                            text: 'text-slate-400',
                            bg: 'bg-slate-800/60',
                        };

                        const div = <div key={booking.id} className={`relative flex gap-5 flex-col justify-between rounded-lg p-5 ${bg}`}>
                          <div>
                              <header className="font-bold text-2xl pb-2 text-white">
                                  {booking.clientName}
                              </header>

                              {booking.pickup} to {booking.destination} <br/>
                              Date: {  booking.createdAt && typeof booking.createdAt.toDate === 'function'
                              ? booking.createdAt.toDate().toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true,
                              })
                              : ''} <br/>

                              <span className={`absolute right-5 top-5 ${text}`}>
                           {booking?.status === "pending" ? <Clock /> : booking?.status === "accepted" ? <CheckIcon/> : <XCircle/> }

                             </span>
                          </div>


                                <div className={"flex gap-2 place-items-end h-[50px] w-full justify-end"}>
                                    {booking?.status === "pending" ?
                                        <>
                                            <div onClick={()=>updateStatus(booking?.id,"accepted")} className="bg-emerald-500/30 hover:bg-emerald-500/90 rounded-md px-5  backdrop-blur-sm border border-emerald-400/20 ">Accept</div>
                                            <div onClick={()=>updateStatus(booking?.id,"rejected")} className="bg-rose-500/30 hover:bg-rose-500/90 px-5 rounded-md backdrop-blur-sm border border-rose-400/20">Reject</div>

                                        </>
                                        : <div onClick={()=>updateStatus(booking?.id,"pending")}>
                                            <RotateCcw className={"text-blue-300"}/>
                                        </div>

                                         }
                            </div>

                        </div>;
                        return (
                            <>


                                {div}


                            </>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default History;
