// hooks/useStatusUpdater.ts
import { useCallback, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from  "../firebaseConfig"

interface useUpdateStatusProps {
    onSuccess:()=>void
}

export const useUpdateStatus = ({onSuccess} :useUpdateStatusProps) => {
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState<string | null>(null);

    const updateStatus = useCallback(
        async (bookingId: string, newStatus: string) => {
            if (!bookingId) return;

            setLoading(true);
            setError(null);

            try {
                const ref = doc(db, 'bookings', bookingId);
                await updateDoc(ref, { status: newStatus });
                onSuccess()
            } catch (err: any) {
                console.error('updateStatus error:', err);
                setError('Failed to update status');
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return { updateStatus, loading, error };
};
