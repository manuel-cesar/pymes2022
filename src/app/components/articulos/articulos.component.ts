import { Component, OnInit } from "@angular/core";
import {FormGroup, FormControl, Validators} from "@angular/forms";

import { Articulo} from "../../models/articulo";
import { ArticuloFamilia } from "../../models/articulo-familia";
import { ArticulosFamiliasService } from "src/app/services/articulos-familias.service";
import { ArticulosService } from "../../services/articulos.service";
import { ModalDialogService } from "../../services/modal-dialog.service";

@Component({
  selector: "app-articulos",
  templateUrl: "./articulos.component.html",
  styleUrls: ["./articulos.component.css"]
})
export class ArticulosComponent implements OnInit {
  Titulo = "Articulos";

  submitted = false;

  TituloAccionABMC : { [index: string]: string } = {
    A: "(Agregar)",
    B: "(Eliminar)",
    M: "(Modificar)",
    C: "(Consultar)",
    L: "(Listado)"
  };
  AccionABMC : string = "L" // inicia en el listado de articulos (buscar con parametros)

  Mensajes = {
    SD: " No se encontraron registros...",
    RD: " Revisar los datos ingresados..."
  };
 
  Items: Articulo[]|null = null;
  RegistrosTotal: number = 1;
  Familias: ArticuloFamilia[]|null = null;
  Pagina = 1; // inicia pagina 1
 
  // opciones del combo activo
  OpcionesActivo = [
    { Id: null, Nombre: "" },
    { Id: true, Nombre: "SI" },
    { Id: false, Nombre: "NO" }
  ];

  FormBusqueda = new FormGroup({
    Nombre: new FormControl(null),
    Activo: new FormControl(null),
  });

 FormRegistro = new FormGroup({
    IdArticulo: new FormControl(0),
    Nombre: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(55)]),
    Precio: new FormControl(null, [Validators.required, Validators.pattern('[0-9]{1,7}')]),
    Stock: new FormControl(null, [Validators.required, Validators.pattern('[0-9]{1,10}')]),
    CodigoDeBarra: new FormControl ('', [Validators.required, Validators.pattern('[0-9]{13}')]),
    IdArticuloFamilia: new FormControl('', [Validators.required]),
    FechaAlta: new FormControl('', [Validators.required, Validators.pattern('(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}'
    ),
]),
    Activo: new FormControl(true),
  });

 
  constructor(
    private articulosService: ArticulosService,
    private articulosFamiliasService: ArticulosFamiliasService,
    private modalDialogService: ModalDialogService
  ) {}
 
  ngOnInit() {
    this.GetFamiliasArticulos();
  }
 
  GetFamiliasArticulos() {
      this.articulosFamiliasService.get().subscribe((res: ArticuloFamilia[]) => {
      this.Familias = res;
    });
  }
 
  Agregar() {
    this.AccionABMC = "A";
    this.FormRegistro.reset({ Activo: true, IdArticulo: 0 });
    this.submitted = false;
  }
 
  // Buscar segun los filtros, establecidos en FormRegistro
  Buscar() {
    this.modalDialogService.BloquearPantalla();
    this.articulosService
      .get(this.FormBusqueda.value.Nombre!, this.FormBusqueda.value.Activo!, this.Pagina)
      .subscribe((res: any) => {
        this.Items = res.Items;
        this.RegistrosTotal = res.RegistrosTotal;
        this.modalDialogService.DesbloquearPantalla();
      });
  }

 
  // Obtengo un registro especifico según el Id
  BuscarPorId(Item:Articulo, AccionABMC:string ) {
    window.scroll(0, 0); // ir al incio del scroll
 
    this.articulosService.getById(Item.IdArticulo).subscribe((res: any) => {
  
      const itemCopy = { ...res };  // hacemos copia para no modificar el array original del mock
      
      //formatear fecha de  ISO 8601 a string dd/MM/yyyy
      var arrFecha = itemCopy.FechaAlta.substr(0, 10).split("-");
      itemCopy.FechaAlta = arrFecha[2] + "/" + arrFecha[1] + "/" + arrFecha[0];

      this.FormRegistro.patchValue(itemCopy);
      this.AccionABMC = AccionABMC;
    });
  }

 
  Consultar(Item:Articulo) {
    this.BuscarPorId(Item, "C");
  }
 
  // comienza la modificacion, luego la confirma con el metodo Grabar
  Modificar(Item:Articulo) {
    if (!Item.Activo) {
      this.modalDialogService.Alert("No puede modificarse un registro Inactivo.");
      return;
    }
    this.BuscarPorId(Item, "M");
    this.submitted = false;
  }
 
// grabar tanto altas como modificaciones
Grabar() { 
  // verificar que los validadores esten OK
  this.submitted = true;
  if (this.FormRegistro.invalid) {
    return;
  }
  
  //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
  const itemCopy: any = { ...this.FormRegistro.value };

  //convertir fecha de string dd/MM/yyyy a ISO para que la entienda webapi
  var arrFecha: any = itemCopy.FechaAlta!.substr(0, 10).split("/");
  if (arrFecha.length == 3)
    itemCopy.FechaAlta = new Date(arrFecha[2], arrFecha[1] - 1, arrFecha[0]).toISOString();

  // agregar post
  if (this.AccionABMC == "A") {
    this.articulosService!.post(itemCopy).subscribe((res: any) => {
      this.Volver();
      this.modalDialogService.Alert('Registro agregado correctamente.');
      this.Buscar();
    });
  } else {
    // modificar put
    this.articulosService.put(itemCopy.IdArticulo, itemCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert('Registro modificado correctamente.');
        this.Buscar();
      });
  }
}

// representa la baja logica 
ActivarDesactivar(Item : Articulo) {
     this.modalDialogService.Confirm("Esta seguro de " +
        (Item.Activo ? "desactivar" : "activar") +
        " este registro?",
      undefined,
      undefined,
      undefined,
      () =>
        this.articulosService.delete(Item.IdArticulo).subscribe((res: any) => 
            this.Buscar()
        ),
      null
    );
  }


  // Volver desde Agregar/Modificar
  Volver() {
    this.AccionABMC = "L";
  }
 
  ImprimirListado() {
    this.modalDialogService.Alert('Sin desarrollar...');
  }  
  
  GetArticuloFamiliaNombre(Id:number) {
    var Nombre = this.Familias!.find(x => x.IdArticuloFamilia === Id)?.Nombre;
    return Nombre;
  }

}



