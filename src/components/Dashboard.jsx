import React, { useState } from "react";

function Dashboard() {
    const [darkMode, setDarkMode] = useState(false);

    return (
        <div className={darkMode ? "bg-gray-900 text-white min-h-screen p-4" : "bg-white text-black min-h-screen p-4"}>
            <button
                onClick={() => setDarkMode(!darkMode)}
                className="mb-4 px-4 py-2 border rounded shadow hover:bg-gray-200 dark:hover:bg-gray-700"
            >
                {darkMode ? "● Light Mode" : "● Dark Mode"}
            </button>

            <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>

            {/* Add Dashboard Content Here */}
        </div>
    );
}

export default Dashboard;
