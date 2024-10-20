import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { FormsModule } from '@angular/forms';  
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [ FormsModule, CommonModule ]
})
export class HomeComponent implements OnInit {
  databases: string[] = [];
  selectedDatabase: string = '';
  mensajeConexion: string = '';
  testmsg: string = '';

  data: any;

  constructor(private apiService: ApiService) { }

  ngOnInit():void {
    this.cargarBasesDeDatos(); 
  }

  async cargarBasesDeDatos() {
    try {
      this.databases = await this.apiService.obtenerDatos();
    } catch (error) {
      console.error("Error al cargar las bases de datos", error);
    }
  }
 
  async onSelectDatabase() {
    if (this.selectedDatabase) {
      try {
        this.mensajeConexion = await this.apiService.conectarBaseDeDatos(this.selectedDatabase);
      } catch (error) {
        console.error("Error al conectar a la base de datos", error);
      }
    }
  }

  async getTestData() { 
      try {
          this.testmsg = await this.apiService.obtenerDatosTest();
          console.log(this.testmsg);
        } catch (error) {
          console.error("Error al conectar a la base de datos", error);
        }
    } 
}
