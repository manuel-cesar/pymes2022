import { Component, OnInit } from '@angular/core';
import { ArticuloFamilia } from 'src/app/models/articulo-familia';
import { ArticulosFamiliasService } from 'src/app/services/articulos-familias.service';

@Component({
  selector: 'app-articulos-familia',
  templateUrl: './articulos-familia.component.html',
  styleUrls: ['./articulos-familia.component.css']
})

export class ArticulosFamiliaComponent implements OnInit {  
  Titulo = "Articulos Familias";
  Items: ArticuloFamilia[] = [];

  constructor(private articulosFamiliasService: ArticulosFamiliasService)
   {
   }

  ngOnInit(): void {
    this.GetFamiliasArticulos();
  }

  GetFamiliasArticulos() {
    this.articulosFamiliasService.get().subscribe((res : ArticuloFamilia[]) => {
      this.Items = res;
    });
  }


}
