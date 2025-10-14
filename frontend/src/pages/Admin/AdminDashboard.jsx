import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";
import { FaDollarSign, FaUsers, FaShoppingCart, FaChartLine } from "react-icons/fa";

const AdminDashboard = () => {
    const { data: sales, isLoading } = useGetTotalSalesQuery();
    const { data: customers, isLoading: loadingCustomers } = useGetUsersQuery();
    const { data: orders, isLoading: loadingOrders } = useGetTotalOrdersQuery();
    const { data: salesDetail } = useGetTotalSalesByDateQuery();

    const [state, setState] = useState({
        options: {
            chart: {
                type: "line",
                background: 'transparent',
                toolbar: {
                    show: true,
                },
                zoom: {
                    enabled: true,
                },
            },
            tooltip: {
                theme: "dark",
                x: {
                    format: 'dd MMM yyyy'
                }
            },
            colors: ["#EC4899"],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: "smooth",
                width: 3,
            },
            title: {
                text: "Sales Trend",
                align: "left",
                style: {
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#FFFFFF'
                }
            },
            grid: {
                borderColor: '#374151',
                strokeDashArray: 5,
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                }
            },
            markers: {
                size: 5,
                colors: ['#EC4899'],
                strokeColors: '#FFFFFF',
                strokeWidth: 2,
                hover: {
                    size: 7,
                }
            },
            xaxis: {
                categories: [],
                title: {
                    text: "Date",
                    style: {
                        color: '#9CA3AF'
                    }
                },
                labels: {
                    style: {
                        colors: '#9CA3AF'
                    }
                },
                axisBorder: {
                    show: true,
                    color: '#374151'
                },
                axisTicks: {
                    show: true,
                    color: '#374151'
                }
            },
            yaxis: {
                title: {
                    text: "Sales ($)",
                    style: {
                        color: '#9CA3AF'
                    }
                },
                labels: {
                    style: {
                        colors: '#9CA3AF'
                    },
                    formatter: (value) => `$${value.toFixed(2)}`
                },
                min: 0,
            },
            legend: {
                position: "top",
                horizontalAlign: "right",
                labels: {
                    colors: '#FFFFFF'
                }
            },
        },
        series: [{ 
            name: "Sales", 
            data: [] 
        }],
    });

    useEffect(() => {
        if(salesDetail) {
            const formattedSalesDate = salesDetail.map((item) => ({
                x: item._id,
                y: item.totalSales,
            }));

            setState((prevState) => ({
                ...prevState,
                options: {
                    ...prevState.options,
                    xaxis: {
                        ...prevState.options.xaxis,
                        categories: formattedSalesDate.map((item) => item.x),
                    }
                },
                series: [
                    { 
                        name: "Sales", 
                        data: formattedSalesDate.map((item) => item.y) 
                    },
                ],
            }));
        }
    }, [salesDetail]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
            <AdminMenu />
            
            <section className="xl:ml-[4rem] md:ml-[0rem] p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
                    <p className="text-gray-400 mt-2">Welcome to your admin dashboard</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Sales Card */}
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-lg border border-gray-700 hover:border-pink-500 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm font-medium">Total Sales</p>
                                <h2 className="text-2xl font-bold text-white mt-2">
                                    {isLoading ? <Loader /> : `$${sales?.totalSales?.toFixed(2) || '0.00'}`}
                                </h2>
                                <p className="text-green-400 text-sm mt-1">+12% from last month</p>
                            </div>
                            <div className="bg-pink-500/20 p-3 rounded-xl">
                                <FaDollarSign className="text-2xl text-pink-500" />
                            </div>
                        </div>
                    </div>

                    {/* Customers Card */}
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm font-medium">Total Customers</p>
                                <h2 className="text-2xl font-bold text-white mt-2">
                                    {loadingCustomers ? <Loader /> : customers?.length || 0}
                                </h2>
                                <p className="text-green-400 text-sm mt-1">+5 new this week</p>
                            </div>
                            <div className="bg-blue-500/20 p-3 rounded-xl">
                                <FaUsers className="text-2xl text-blue-500" />
                            </div>
                        </div>
                    </div>

                    {/* Orders Card */}
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-lg border border-gray-700 hover:border-green-500 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm font-medium">All Orders</p>
                                <h2 className="text-2xl font-bold text-white mt-2">
                                    {loadingOrders ? <Loader /> : orders?.totalOrders || 0}
                                </h2>
                                <p className="text-green-400 text-sm mt-1">+3 pending</p>
                            </div>
                            <div className="bg-green-500/20 p-3 rounded-xl">
                                <FaShoppingCart className="text-2xl text-green-500" />
                            </div>
                        </div>
                    </div>

                    {/* Average Order Card */}
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-lg border border-gray-700 hover:border-purple-500 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm font-medium">Avg. Order Value</p>
                                <h2 className="text-2xl font-bold text-white mt-2">
                                    {isLoading ? <Loader /> : `$${((sales?.totalSales || 0) / (orders?.totalOrders || 1)).toFixed(2)}`}
                                </h2>
                                <p className="text-green-400 text-sm mt-1">+8% increase</p>
                            </div>
                            <div className="bg-purple-500/20 p-3 rounded-xl">
                                <FaChartLine className="text-2xl text-purple-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-lg border border-gray-700 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-white">Sales Analytics</h3>
                            <p className="text-gray-400 text-sm">Track your sales performance over time</p>
                        </div>
                        <div className="flex space-x-2">
                            <button className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors">
                                Last 7 Days
                            </button>
                            <button className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm hover:bg-pink-600 transition-colors">
                                Last 30 Days
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <Chart
                            options={state.options}
                            series={state.series}
                            type="line"
                            width="100%"
                            height="350"
                        />
                    </div>
                </div>

                {/* Recent Orders Section */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-white">Recent Orders</h3>
                            <p className="text-gray-400 text-sm">Latest customer orders and their status</p>
                        </div>
                        <button className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm hover:bg-pink-600 transition-colors">
                            View All Orders
                        </button>
                    </div>
                    <OrderList />
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;