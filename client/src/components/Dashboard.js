
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'
import SideBar from './Sidebar';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [usageDetails, setUsageDetails] = useState({});
    const [billingInfo, setBillingInfo] = useState({});
    const [invoice, setInvoice] = useState(null);
    const [showSideBar, setShowSideBar] = useState(window.innerWidth >= 600);

    useEffect(() => {
        const handleResize = () => {
            setShowSideBar(window.innerWidth >= 890);
        };
        window.addEventListener('resize', handleResize);
        // Fetch user details and usage data
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/usage-details', {
                    withCredentials: true,
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchUsageDetails = async () => {
            try {
                const response = await axios.get('/usage-details');
                setUsageDetails(response.data);
            } catch (error) {
                console.error('Error fetching usage details:', error);
            }
        };

        const fetchBillingInfo = async () => {
            try {
                const response = await axios.get('/billing-information');
                setBillingInfo(response.data);
            } catch (error) {
                console.error('Error fetching billing information:', error);
            }
        };

        fetchUserData();
        fetchUsageDetails();
        fetchBillingInfo();
        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, []);

    const chartData = {
        labels: ['Service 1', 'Service 2', 'Service 3', 'Service 4', 'Service 5'],
        datasets: [
            {
                label: 'Usage',
                data: [120, 150, 200, 80, 100],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const handleGenerateInvoice = async () => {
        try {
            const response = await axios.get('/generate-invoice');
            setInvoice(response.data);
        } catch (error) {
            console.error('Error generating invoice:', error);
        }
    };
    console.log('billing', JSON.stringify(billingInfo, null, 2));
    console.log(user);
    return (
        <>
            {showSideBar && <SideBar />}
            <div className='container'>
                <h3>Usage Details:</h3>
                <pre> Username:{user ? user.username : 'Guest'}</pre>
                <pre> Email:{user ? user.email : 'Guest'}</pre>

                    {/* <h3>Billing Information:</h3> */}
                    {/* <pre>{JSON.stringify(billingInfo, null, 2)}</pre> */}
                    {/* <pre>{billingInfo}</pre> */}

                <button onClick={handleGenerateInvoice}>Generate Invoice</button>

                    {invoice && (
                        <>
                            <h3>Generated Invoice:</h3>
                            <pre>{JSON.stringify(invoice, null, 2)}</pre>
                        </>
                    )}
            </div>

        </>
    );
};

export default Dashboard;
