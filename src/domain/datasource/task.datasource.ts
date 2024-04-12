import { Task } from "../entities/tareas.entity.js";


export abstract class TaskDatasource{
    abstract Agregar(desc:string):Promise<Task | undefined>;
    abstract Obtener():Task[];
    abstract ObtenerId(id:string):Task | undefined;
    abstract ObtenerCompletadas():Task[] | undefined;
    abstract Completar(id:string):boolean;
    abstract CompletarTareas(ids:string[]):boolean;
    abstract QuitarCompletado(id:string):boolean
    abstract QuitarCompletados(ids:string[]):boolean;
    abstract Eliminar(id:string):boolean;
}