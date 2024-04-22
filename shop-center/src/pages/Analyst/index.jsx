import React from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../components/Layout';

function Analyst (){

    const { user } = useSelector((state) => state.user);
    // Mock data for demonstration purposes
    const salesData = [
        { month: 'January', revenue: 1000 },
        { month: 'February', revenue: 1500 },
        { month: 'March', revenue: 2000 },
        { month: 'April', revenue: 1800 },
        { month: 'May', revenue: 2200 },
        { month: 'June', revenue: 2500 },
    ];

    const ordersData = [
        { month: 'January', orders: 50 },
        { month: 'February', orders: 60 },
        { month: 'March', orders: 70 },
        { month: 'April', orders: 65 },
        { month: 'May', orders: 80 },
        { month: 'June', orders: 90 },
    ];

    return (
    <div>  
        <div>Shop ID: "the ID" </div>
        <div>Shop Name: "the name"</div>

        <div>
            <h2>Dashboard</h2>
            <div>
                <h3>Sales Overview</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesData.map(({ month, revenue }) => (
                            <tr key={month}>
                                <td>{month}</td>
                                <td>${revenue}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <h3>Orders Overview</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Orders</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordersData.map(({ month, orders }) => (
                            <tr key={month}>
                                <td>{month}</td>
                                <td>{orders}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
     </div>
    );
};

export default Analyst;
