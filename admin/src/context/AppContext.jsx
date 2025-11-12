import React, { createContext } from "react";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const calculateAge = (dob) => {
        const today = new Date()
        const birtDate = new Date(dob);

        let age = today.getFullYear() - birtDate.getFullYear()
        return age
    }
    // 🗓 Format date from slotDate ("11_10_2025")
    const formatDate = (slotDate) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        if (!slotDate) return "";
        const [day, month, year] = slotDate.split("_");
        return `${day} ${months[parseInt(month) - 1]} ${year}`;
    };

    //currency symbol
    const currency = '$'

    const value = {
        calculateAge,formatDate,currency
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider