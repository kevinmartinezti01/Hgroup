import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { brands } from "../../assets/data/brands";
import type { Marca } from '../../assets/interfaz/marca';


const BrandDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const brand: Marca | undefined = brands.find((b) => b.id === id);

  if (!brand) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-red-500">Marca no encontrada</h1>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => navigate(-1)}
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => navigate(-1)}
      >
        ← Volver
      </button>

      <div className={`p-6 rounded-xl shadow-md ${brand.color}`}>
        <h1 className="text-3xl font-bold mb-2">{brand.nombre}</h1>
        <p className="text-lg mb-4">{brand.tipo}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Responsable:</strong> {brand.responsable}</p>
            <p><strong>Ventas Mensuales:</strong> {brand.ventas}</p>
            <p><strong>Margen:</strong> {brand.margen}</p>
          </div>

          {/* Puedes agregar más métricas, gráficas, etc. */}
          <div>
            <p><strong>ID:</strong> {brand.id}</p>
            <p><strong>Color:</strong> <code>{brand.color}</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandDetail;
