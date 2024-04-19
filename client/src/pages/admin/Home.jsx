import React, { useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import bec from '../../assets/bec.png'

function Home() {
    useEffect(() => {
        AOS.init({
            offset: 120,
            delay: 0,
            duration: 400,
            easing: 'ease',
            once: false,
            mirror: false,
            anchorPlacement: 'top-bottom'
        });
        // Clean up AOS on unmount
        return () => AOS.refresh();
    }, []);

    return (
        <>
            <div className="grid md:grid-flow-col grid-flow-row items-center  h-screen md:h-full   w-full">
                <div className="flex flex-col justify-center items-center -mt-14 ">
                    <div>
                        <h1 className="font-sans text-2xl md:text-4xl ">BAPATLA ENGINEERING <br/>COLLEGE</h1>
                        <p data-aos="fade-up" data-aos-delay="100" className="pt-1">Affiliated to Acharya Nagarjuna University.</p>
                    </div>
                </div>
                <div className=" md:flex flex-col justify-center items-center  mx-3 mb-3 -mt-36 md:mt-0 ">
                    <img src={bec} alt="" className="object-cover " data-aos="zoom-out" data-aos-delay="300" height="400" width="400"/>
                </div>
            </div>
        </>
    );
}

export default Home;