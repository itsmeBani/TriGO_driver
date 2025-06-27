import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonFooter,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonButton,
  IonItem,
  IonText,
} from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Home.css';
import { personCircle, time, home, logOutOutline } from 'ionicons/icons'; // Removed notifications
import { getFirestore, collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { app } from '../firebaseConfig';

const db = getFirestore(app);

const Home: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [pickup, setPickup] = useState('');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [bookingRequests, setBookingRequests] = useState<any[]>([]);
  const [response, setResponse] = useState<string>('');
  const history = useHistory();

  // Listen for all pending bookings from Firestore
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'bookings'),
      (snapshot) => {
        const pending = snapshot.docs
          .filter(doc => doc.data().status === 'pending')
          .map(doc => ({ id: doc.id, ...doc.data() }));
        setBookingRequests(pending);
      }
    );
    return () => unsub();
  }, []);

  // Map logic (unchanged)
  useEffect(() => {
    let mapInstance: any;
    let markerInstance: any;
    let userMarker: any;

    if (!mapRef.current) return;
    if (!(window as any).google || !(window as any).google.maps) {
      console.error('Google Maps JavaScript API not loaded!');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ lat: latitude, lng: longitude });

        const mapOptions = {
          center: { lat: latitude, lng: longitude },
          zoom: 16,
          disableDefaultUI: true,
        };
        mapInstance = new (window as any).google.maps.Map(mapRef.current!, mapOptions);

        userMarker = new (window as any).google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: mapInstance,
          title: 'You are here',
          label: {
            text: 'You are here',
            color: '#1976d2',
            fontWeight: 'bold',
            fontSize: '14px',
          },
        });

        mapInstance.addListener('click', (e: any) => {
          const latLng = e.latLng;
          if (!latLng) return;
          setPickup(`Lat: ${latLng.lat()}, Lng: ${latLng.lng()}`);
          if (markerInstance) markerInstance.setMap(null);
          markerInstance = new (window as any).google.maps.Marker({
            position: latLng,
            map: mapInstance,
            title: 'Pickup Location',
          });
        });
      },
      () => {
        alert('Unable to get your location. Please enable location services.');
      },
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 0 }
    );

    return () => {
      if (markerInstance) markerInstance.setMap(null);
      if (userMarker) userMarker.setMap(null);
      if (mapInstance) mapInstance = null;
    };
  }, []);

  // Accept/Reject booking and update Firestore
  const handleAccept = async (bookingId: string) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status: 'accepted' });
      setResponse('Booking accepted!');
      setBookingRequests(requests => requests.filter(b => b.id !== bookingId));
    } catch (error) {
      setResponse('Failed to accept booking.');
    }
  };

  const handleReject = async (bookingId: string) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status: 'rejected' });
      setResponse('Booking rejected.');
      setBookingRequests(requests => requests.filter(b => b.id !== bookingId));
    } catch (error) {
      setResponse('Failed to reject booking.');
    }
  };

  // Navigation handlers (unchanged)
  const handleLogout = () => {
    alert('Logged out');
    history.replace('/login');
  };
  const goToProfile = () => history.replace('/profile');
  const goToRideHistory = () => history.replace('/history');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <img src="TriGo.png" className="logo" alt="Tricycle" />
            Tricycle Booking
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent id="main-content" className="ion-padding">
        <IonCard>
          <div ref={mapRef} className="google-map"></div>
          {userCoords && (
            <div className="pickup-coords">
              You are here: Lat: {userCoords.lat}, Lng: {userCoords.lng}
            </div>
          )}
          {pickup && <div className="pickup-coords">{pickup}</div>}
        </IonCard>
        {/* Show all pending booking requests */}
        {bookingRequests.length > 0 ? bookingRequests.map(booking => (
          <IonCard color="warning" className="booking-request-card" key={booking.id}>
            <IonItem lines="none">
              <IonText>
                <strong>Booking Request</strong>
                <br />
                Client: {booking.clientName || booking.client}
                <br />
                <b>Client Phone:</b> {booking.clientPhone || 'N/A'}
                <br />
                Pickup: {booking.pickup}
                <br />
                Destination: {booking.destination}
                <br />
                Location: {booking.location && booking.location.lat && booking.location.lng
                  ? `Lat: ${booking.location.lat}, Lng: ${booking.location.lng}`
                  : 'N/A'}
              </IonText>
            </IonItem>
            <div style={{ display: 'flex', justifyContent: 'space-around', margin: '1em 0' }}>
              <IonButton color="success" onClick={() => handleAccept(booking.id)}>Accept</IonButton>
              <IonButton color="danger" onClick={() => handleReject(booking.id)}>Reject</IonButton>
            </div>
          </IonCard>
        )) : (
          <IonCard>
            <IonItem lines="none">
              <IonText>No pending bookings.</IonText>
            </IonItem>
          </IonCard>
        )}
        {response && (
          <IonCard>
            <IonItem lines="none">
              <IonText color="primary">{response}</IonText>
            </IonItem>
          </IonCard>
        )}
      </IonContent>

    </IonPage>
  );
};

export default Home;
