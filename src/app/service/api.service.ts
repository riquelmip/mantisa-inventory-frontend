import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://127.0.0.1:8000';

  constructor() { }

  async obtenerDatos(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/listdb/databases/`);
      return response.data.databases;  
    } catch (error) {
      console.error('Error al obtener datos:', error);
      throw error; 
    }
  }

  async conectarBaseDeDatos(dbName: string): Promise<any> {
    try {
     const response = await axios.post(`${this.baseUrl}/listdb/connectedBD`, null, {
      params: {
        db_name: dbName
      }
    });
      return response.data.message; 
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error);
      throw error; 
    }
  }

  async obtenerDatosTest(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/users/gettestdata/`);
      return response;  
    } catch (error) {
      console.error('Error al obtener datos:', error);
      throw error; 
    }
  }

}

