import React, { useEffect, useState } from 'react';
import './Tab2.css';
import { IonButton, IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import {
  getFirestore,
  collection,
  getDocs,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebaseConfig';
import {CheckCircle, Clock, Loader, XCircle} from "lucide-react";

interface Booking {
  id: string;
  client_name: string;
  pickup_location: string;
  dropoff_location: string;
  date: string;
  status: string;
  driverId?: string;
}

const History: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  const db = getFirestore(app);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const bookingsRef = collection(db, 'bookings');
        const querySnapshot = await getDocs(bookingsRef);

        const bookingsData: Booking[] = querySnapshot.docs
          .map((docSnap) => {
            const data = docSnap.data();

            return {
              id: docSnap.id,
              client_name: data.clientName || '',
              pickup_location: data.pickup || '',
              dropoff_location: data.destination || '',
              date:
                data.createdAt && typeof data.createdAt.toDate === 'function'
                  ? data.createdAt.toDate().toLocaleString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })
                  : '',
              status: data.status || '',
              driverId: data.driverId || '',
            };
          })
          .filter((booking) =>
            ['pending', 'accepted', 'rejected'].includes(booking.status.toLowerCase())
          );

        setBookings(bookingsData);
      } catch (err: any) {
        console.error('Error fetching bookings:', err);
        setError('Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  if (loading) {
    return (
        <div className="flex w-full gap-2 h-full place-items-center justify-center">
          <Loader size={30} className={"animate-spin text-blue-500"}/>
          <p>fetching history..</p>
        </div>
    );
  }
  if (error) return <div>{error}</div>;

  return (
      <section className="h-full overflow-y-auto flex flex-col">

      <header className="text-blue-400 text-center p-3 lg:p-10 text-3xl">Booking History (Accepted/Rejected)</header>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="grid grid-cols-1  md:grid-cols-2  gap-3   lg:grid-cols-4  p-3 lg:p-10">
          {bookings.map((booking) => (
            <div key={booking.id} className={"bg-[#212121] rounded-lg p-5"}>
              <header className="font-bold text-2xl pb-2 text-white">{booking.client_name}</header> {' '}
              {booking.pickup_location} to {booking.dropoff_location} <br />
              Date: {booking.date} <br />
              Status:
              <span
                className="ml-2 tab2-status"
                data-status={booking.status.toLowerCase()}
              >
                {booking.status}
              </span>
              <br />
              Driver Assigned:{' '}
              {booking.driverId ? booking.driverId : 'None'} <br />
            </div>
          ))}
        </div>
      )}
      </section>
  );
};

export default History;
