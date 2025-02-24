import React from "react";
import { useNavigate } from 'react-router-dom';

const ListPreview = ({ list }) => {
    const navigate = useNavigate();  // Para navegação
    
    if (!list) {
        return <p className="text-gray-400">Lista inválida.</p>;
    }

    const thumbnail = list.thumbnail || [];

    const handleListClick = (event, list_id) => {
        if (event.button === 1 || event.ctrlKey || event.metaKey) {
            window.open(`/list/${list_id}`, '_blank');
        } else {
            navigate(`/list/${list_id}`);
        }
    };
    
    return (
        <div 
            className="flex flex-row p-4 rounded-lg bg-gray-700 w-full max-w-sm relative items-center cursor-pointer hover:bg-gray-600 transition-colors"
            onClick={(event) => handleListClick(event, list.list_id)} 
            onAuxClick={(event) => handleListClick(event, list.list_id)}  
            role="button"  
            tabIndex={0}   
        >
            <div className="grid grid-cols-3 gap-2 w-50 h-20 flex-shrink-0">
                {thumbnail.slice(0, 3).map((thumbnail, index) => (
                    <img
                        key={index}
                        src={thumbnail || "./src/assets/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                    />
                ))}
            
            </div>
            <div className="ml-4 flex-1">
                <p className="text-white font-bold">{list.name || "Sem nome"}</p>
                <p className="text-gray-400 text-sm">{list.description || "Sem descrição"}</p> 
            </div>    
        </div>
    );
};

export default ListPreview;