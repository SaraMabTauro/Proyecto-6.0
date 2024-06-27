import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function ExcelAlumno() {
  const [archivo, setArchivo] = useState(null);
  const [data, setData] = useState([]);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState("");
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("");

  const handleChangeArchivo = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleCargarDatos = async () => {
    if (!archivo) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, selecciona un archivo.",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("archivo", archivo);

      const responseMatriculas = await axios.post(
        "http://127.0.0.1:5000/api/leer-excel",
        formData
      );

      if (!responseMatriculas.data || !responseMatriculas.data.matriculas) {
        throw new Error("No se recibieron las matrículas del archivo.");
      }

      // se obtiene las matriculas
      const matriculas = responseMatriculas.data.matriculas;

      // se crea objeto de datos con: matriculas, tipo y periodo
      const data = {
        matriculas: matriculas,
        tipo: materiaSeleccionada,
        periodo: periodoSeleccionado,
      };

      matriculas.forEach((matricula) =>
        formData.append("matriculas[]", matricula)
      );

      console.log("Matrículas obtenidas:", matriculas);

      console.log(
        "Enviando solicitud POST a http://localhost:4000/api/v1/cargarDatos"
      );
      const response = await axios.post(
        "http://localhost:4000/api/v1/cargarDatos",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Respuesta recibida:", response);


      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Los datos se han cargado correctamente en la base de datos.",
      });
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al procesar el archivo.",
      });
    }
  };

  const handleSubmit = async () => {
    if (!archivo) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, selecciona un archivo.",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("archivo", archivo);

      console.log(
        "Enviando solicitud POST a http://127.0.0.1:5000/api/lectura"
      );

      const response = await axios.post(
        "http://127.0.0.1:5000/api/lectura",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Respuesta recibida:", response);

      setData(response.data.data);
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al procesar el archivo.",
      });
    }
  };

  return (
    <div className="container mx-auto bg-white text-gray-800 p-4 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-purple-700">
        Cargar archivo Excel Platinum
      </h1>
      <div className="mb-4">
        <label htmlFor="materia" className="mr-2 font-semibold">
          Selecciona Materia:
        </label>
        <select
          id="materia"
          className="border rounded p-2"
          value={materiaSeleccionada}
          onChange={(e) => setMateriaSeleccionada(e.target.value)}
        >
          <option value="">Selecciona Materia</option>
          <option value="Entancia I">Entancia I</option>
          <option value="Estancia II">Estancia II</option>
          <option value="Estadia">Estadia</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="periodo" className="mr-2 font-semibold">
          Selecciona Periodo:
        </label>
        <select
          id="periodo"
          className="border rounded p-2"
          value={periodoSeleccionado}
          onChange={(e) => setPeriodoSeleccionado(e.target.value)}
        >
          <option value="">Selecciona Periodo</option>
          <option value="1">Enero-Abril</option>
          <option value="2">Mayo-Agosto</option>
          <option value="3">Septiembre-Diciembre</option>
        </select>
      </div>
      <input
        type="file"
        accept=".xls"
        onChange={handleChangeArchivo}
        className="mb-4"
      />
      <button
        onClick={handleSubmit}
        className="bg-purple-700 text-white rounded px-4 py-2 mt-4 hover:bg-purple-800"
      >
        Cargar archivo
      </button>
      <hr />
      <button
        onClick={handleCargarDatos}
        className="bg-purple-700 text-white rounded px-4 py-2 hover:bg-purple-800"
      >
        Cargar Datos
      </button>

      <hr className="my-4" />

      {data.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-purple-700">
            Datos de los alumnos:
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {data[0].map((header, index) => {
                    const trimmedHeader = header.trim(); // Eliminar espacios en blanco alrededor del encabezado

                    // Renderizar el encabezado solo si no está vacío después de recortar
                    if (trimmedHeader !== "") {
                      return (
                        <th
                          key={index}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {trimmedHeader}
                        </th>
                      );
                    }

                    return null; // Omitir la renderización si el encabezado está vacío
                  })}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.slice(1).map((row, rowIndex) => {
                  // Filtrar la fila actual para eliminar celdas vacías
                  const filteredRow = row.filter((cell) => cell.trim() !== "");

                  // Renderizar la fila solo si contiene al menos una celda con contenido
                  if (filteredRow.length > 0) {
                    return (
                      <tr key={rowIndex}>
                        {filteredRow.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    );
                  }

                  return null; // Omitir la renderización si la fila está vacía después de filtrar
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExcelAlumno;
