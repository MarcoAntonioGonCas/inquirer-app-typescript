import { TaskDatasource } from "../../domain/datasource/task.datasource.js"
import { Task } from "../../domain/entities/tareas.entity.js"
import { InquirerMethods } from "./inquirerMethods.js";
import { TaskMemory } from "../../infraestructure/datasource/task-memory.datasource.js";


enum opcionesEnum {
    Crear = "1",
    Eliminar="2",
    Listar="3",
    ListarCompletados="4",
    Completar="5",
    Salir = "0"
}

interface Choices{
    name:string,
    value:string,
}
interface ChoicesChecked extends Choices{
    checked:boolean | undefined
}
export const opciones:Choices[] =[
    {
        name: "1. Crear tarea",
        value: "1",

    },
    {
        name: "2. Eliminar tarea",
        value: "2"
    },
    {
        name: "3. Listas todas las tareas",
        value: "3"
    },
    {
        name: "4. Listar tareas completadas",
        value: "4"
    },
    {
        name: "5. Completar tareas",
        value: "5"
    },
    {
        name: "0. Salir",
        value: "0"
    }
]



export class InquirerApp{

    constructor(
        private readonly taaskDataSource:TaskDatasource
    ){

    }
    
    obtenerTareasChoices(task:Task[],opcionSalir:boolean=true):Choices[]{

        const tareas:Choices[] = this.taaskDataSource.Obtener().map((tarea,index)=>{
            const {id,nombre,completado,fechaCompletado} = tarea

            return {
                name: `${index+1}. ${tarea.toString()}`,
                value: id,
            };
        });

        if(opcionSalir){

            tareas.unshift({
                name:"0. Cancelar",
                value:"0"
            })
        }

        return tareas;
    }

    async mostrarOpcion() : Promise<opcionesEnum>{
        
        const opcionSeleccionada = await InquirerMethods.mostrarLista("opcion","Selecciona una opcion",opciones);
        
        return opcionSeleccionada as opcionesEnum
    }
    async eliminarTarea(): Promise<void>{

        const tareas = this.taaskDataSource.Obtener();
        if(tareas.length == 0){
            InquirerMethods.mostrarMensaje("No existen tareas a eliminar");
            return;
        }


        const tareaChoices = this.obtenerTareasChoices(tareas);
        const idSeleccionado:string = await InquirerMethods.mostrarLista("tareaa","Selecciona una tarea",tareaChoices);


        if(idSeleccionado == "0") return;

        const tarea = this.taaskDataSource.ObtenerId(idSeleccionado);

        if( tarea && this.taaskDataSource.Eliminar(tarea.id)){
            InquirerMethods.mostrarMensaje(`Tarea '${tarea.nombre}} eliminado'`)

        }else{
            InquirerMethods.mostrarMensaje("No se pudo eliminar la tarea");
        }

    }
    async mostrarTareas():Promise<void>{

        const tareas = this.taaskDataSource.Obtener();

        if(tareas.length == 0){

            InquirerMethods.mostrarMensaje("Sin tareas :(");
            return;
        }

        const tareaString = tareas.map( (tarea,index) => `${index+1}. ${tarea.toString()}` )
        InquirerMethods.mostrarDatos(tareaString);

    }
    async mostrarCompletados():Promise<void>{
        const tareasCompletadas:Task[] | undefined = this.taaskDataSource.ObtenerCompletadas();

        if(tareasCompletadas == undefined || tareasCompletadas.length == 0){

            InquirerMethods.mostrarMensaje("Sin tareas completadas :(");
            return;
        }
        
        const tareaString = tareasCompletadas.map( (tarea,index) => `${index+1}. ${tarea.toString()}` )
        InquirerMethods.mostrarDatos(tareaString);

    }
    async crearTarea():Promise<void>{

        let nombre:string = await InquirerMethods.leerInput("Ingresa el nombre de la tarea: ");

        nombre = nombre.trim();

        if(nombre.length == 0){
            InquirerMethods.mostrarMensaje("Tarea no valida");
            return;
        }
        

        await this.taaskDataSource.Agregar(nombre);
    }


    async completarTareas():Promise<void>{

        const tareas:Task[] = this.taaskDataSource.Obtener();

        if(tareas.length == 0){
            InquirerMethods.mostrarMensaje("Sin tareas :( agrega una tarea.")
            return;
        }
        // Mapaeamos las taras 
        const tareasChoices:ChoicesChecked[] = tareas.map((tarea,index)=>{
            return {
                name: `${index+1}. ${tarea.toString()} `,
                value:tarea.id,
                checked:tarea.completado
            }
        })



        // Obtenemos solo los ids de las tareas que queremos completar
        const ids:string[] = await InquirerMethods.mostrarCheck("tareas","Selecciona las tareas a completar: ",tareasChoices);

        

        // Recorremos las tareas
        tareas.forEach(tarea=>{

            // Si la tarea acual se encuentra dentro de los ids significa que esta marcada
            // como completada y se espera que este se le asigne la fecha
            if(ids.includes(tarea.id)){

                // Si la tarea no estaba completada anteriormente la asignamos como completada
                if(!tarea.completado){
                    this.taaskDataSource.Completar(tarea.id);
                }
                
            }else{
                this.taaskDataSource.QuitarCompletado(tarea.id);
            }

        });




    }


    async iniciar(){

        if(this.taaskDataSource instanceof TaskMemory){
            (this.taaskDataSource as TaskMemory).leerTareas();
        }
        let opcionSeleccionada:opcionesEnum; 
        do{
            InquirerMethods.limpiar();
            opcionSeleccionada = await this.mostrarOpcion();


            
            if(opcionSeleccionada == opcionesEnum.Listar){

                await this.mostrarTareas();
                
            }else if(opcionSeleccionada == opcionesEnum.ListarCompletados){

                await this.mostrarCompletados();

            }else if(opcionSeleccionada == opcionesEnum.Crear){
                await this.crearTarea();

            }else if(opcionSeleccionada == opcionesEnum.Completar){
                await this.completarTareas();
                
            }else if(opcionSeleccionada == opcionesEnum.Eliminar){
                await this.eliminarTarea();
            }

            await InquirerMethods.pausa();

        }while(opcionSeleccionada != opcionesEnum.Salir);

        if(this.taaskDataSource instanceof TaskMemory){
            (this.taaskDataSource as TaskMemory).guardarTareas();
        }
    }
    

}