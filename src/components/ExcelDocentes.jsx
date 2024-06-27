import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function ExcelDocentes() {
  const [data, setData] = useState([]);

  const leerExcel = async (e) => {
    const excelFile = e.target.files[0];

    try {
      const formData = new FormData();
      formData.append('archivo', excelFile);

      const response = await axios.post('http://127.0.0.1:5000/api/cargar-archivo', formData);
        
      if (response.data && response.data.data) {
        const parsedData = response.data.data.slice(1);
        setData(parsedData);
        console.log('Respuesta de la API:', response.data.data);
      } else {
        throw new Error('Error al procesar el archivo');
      }
    } catch (error) {
      console.error('Error al cargar el archivo:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al cargar el archivo.',
      });
    }
  };

  const insertarDatos = async () => {
    if (data.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No hay datos para insertar en la base de datos.',
      });
      return;
    }

    try {
      console.log('Datos a enviar al servidor:', data);

      await axios.post('http://localhost:4000/api/v1/empresas', { data });
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Los datos se han insertado correctamente en la base de datos.',
      });
    } catch (error) {
      console.error('Error al insertar los datos en la base de datos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al insertar los datos en la base de datos.',
      });
    }
  };

  return (
    <div className="container mx-auto bg-white text-gray-800 p-4 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-purple-700">
        Cargar archivo Excel Empresas
      </h1>
      <form>
        <label className="block mb-2 font-bold text">
          Selecciona un archivo Excel:
        </label>
        <input
          type="file"
          className="border p-2 mb-4"
          accept=".xlsx"
          name="excel"
          id="excel"
          onChange={leerExcel}
        />
      </form>

      {data.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-purple-700">
            Datos cargados:
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Correo Electrónico
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proyecto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Matrícula Alumno
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asesor Laboral
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.nombreEmpresa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.direccionCorreo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.proyecto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.matricula}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.supervisor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <button
        className="bg-blue-500 text-white mt-8 py-2 px-4 rounded hover:bg-blue-600"
        onClick={insertarDatos}
      >
        Insertar en la Base de Datos
      </button>
    </div>
  );
}

export default ExcelDocentes;