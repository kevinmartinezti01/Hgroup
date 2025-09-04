import React from "react";
import type { Marca } from "../assets/interfaz/marca";
import './MarcasCard.css'; // Asegúrate de que la ruta sea correcta
interface MarcaCardProps {
  brand: Marca;
  onClick: (id: string) => void;
}

export const MarcaCard: React.FC<MarcaCardProps> = ({ brand, onClick }) => {
  return (
    <div
      className={`rounded-xl p-4 shadow-md transition-transform hover:scale-[1.02] cursor-pointer ${brand.color}`}
      onClick={() => onClick(brand.id)}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="block uppercase text-xs font-semibold text-gray-700">{brand.tipo}</span>
          <h2 className="text-lg font-bold text-gray-900">{brand.nombre}</h2>
        </div>
        <img src="/icons/flag-icon.svg" alt="Marca" className="w-6 h-6" />
      </div>

      <div className="text-sm text-gray-700 mb-2">
        <p><strong>Responsable:</strong> {brand.responsable}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-500">Ventas Mensuales</p>
          <p className="font-semibold">${brand.ventas}</p>
        </div>
        <div>
          <p className="text-gray-500">Margen</p>
          <p className="font-semibold">{brand.margen}</p>
        </div>
      </div>
    </div>
  );
};
