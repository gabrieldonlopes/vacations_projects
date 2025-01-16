import React from "react";

const DayWeather = ({ 
    day_date, 
    day_maxtemp_c, 
    day_mintemp_c, 
    day_condition_icon 
}) => {
    // Formata a data para exibir apenas a abreviação do dia
    const formatDate = (date) => {
        date.split(' ');
        return date.slice(0,3);
    }   

    return (
        <div className="hover:bg-gray-600 rounded-lg p-4 text-center text-white w-24">
            <img
                src={day_condition_icon}
                alt="Weather Icon"
                className="mx-auto mb-2"
            />

            <p className="text-lg font-semibold mb-2">
                {formatDate(day_date)}
            </p>

            <div className="flex justify-between text-sm">
                <p className="font-bold">{day_maxtemp_c}°</p>
                <p className="text-gray-400">{day_mintemp_c}°</p>
            </div>
        </div>
    );
};

export default DayWeather;
