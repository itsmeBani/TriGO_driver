import React, { useEffect, useState } from 'react';
import './Tab1.css';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../firebaseConfig';
import { useHistory } from 'react-router-dom';
import {Loader,Phone, Mail, Pencil} from "lucide-react";

const db = getFirestore(app);

const Profiles: React.FC = () => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory(); 

  const fetchAllDrivers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'drivers'));
      const driverList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDrivers(driverList);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDrivers();
  }, []);

  const handleBack = () => {
    history.push('/home'); 
  };

  if (loading) {
    return (
      <div className="flex w-full gap-2 h-full place-items-center justify-center">
        <Loader size={30} className={"animate-spin text-blue-500"}/>
        <p>fetching drivers..</p>
      </div>
    );
  }

  return (
    <section className="h-full overflow-y-auto flex flex-col">

      <header className="text-blue-400 text-center p-5 lg:p-10 text-3xl">Registered Drivers</header>
      {drivers.length === 0 ? (
          <div className="flex w-full gap-2 h-full place-items-center justify-center">
            <p>No Driver</p>
          </div>
      ) : (
        <div className="grid h-auto  grid-cols-1 md:grid-cols-2 lg:grid-cols-3   p-3 lg:p-10 gap-4">
          {drivers.map((driver) => (
            <div key={driver.id} className="bg-[#212121] flex flex-col   rounded-xl">

                    <img alt={"license"} src={driver?.license} className={"overflow-hidden h-[190px] lg:h-[250px]  rounded-xl object-fit flex  "}/>

            <div className="py-4 px-3 flex flex-col gap-1">
              <h3 className="text-sm lg:text-2xl leading-2 font-semibold text-white flex items-center">
                {driver.name}
              </h3>

              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-5 h-5 shrink-0 text-white" />
                <span className="text-sm text-white">{driver.phone}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-5 h-5 shrink-0 text-white" />
                <span className="text-sm text-white">{driver.email}</span>
              </div>
            </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Profiles;