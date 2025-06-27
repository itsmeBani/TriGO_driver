// hooks/useBookings.ts
import { useEffect, useState } from 'react';
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    Timestamp,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

export interface Client {
    clientName: string;
    clientPhone: string;
    createdAt: Timestamp;
    destination: string;
    map?: unknown;
    location: {
        lat:number,
        lng:number
    }
    paymentMethod: string;
    pickup: string;
    status: string;
    userId: string;
}


export interface Booking extends Client {
    id: string;
}

export function useFetchBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading]   = useState(true);
    const [error,   setError]     = useState<Error | null>(null);

    useEffect(() => {
        const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));


        const unsubscribe = onSnapshot(
            q,
            snapshot => {
                const results: Booking[] = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...(doc.data() as Client),
                }));
                setBookings(results);
                setLoading(false);
            },
            err => {
                setError(err);
                setLoading(false);
            },
        );

        return unsubscribe;
    }, []);

    return { bookings, loading, error };
}
