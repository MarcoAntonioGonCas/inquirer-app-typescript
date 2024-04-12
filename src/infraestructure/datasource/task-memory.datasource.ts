import fs from 'node:fs';
import path from 'node:path'
import { TaskDatasource } from "../../domain/datasource/task.datasource.js";
import { Task } from "../../domain/entities/tareas.entity.js";
import { obtenerId } from "../../config/plugins/id.plugin.js";

const dir = path.join("db");
const dirFileName = path.join(dir,"db.json");

export class TaskMemory implements TaskDatasource{

    private readonly tareas:Task[] = [];

    guardarTareas(){
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir,{recursive:true})
        }


        fs.writeFileSync(dirFileName,JSON.stringify(this.tareas));
    }
    leerTareas(){
        if(!fs.existsSync(dirFileName)){
            return;
        }

        const content:string = fs.readFileSync(dirFileName,{encoding:"utf8"});
        const array:any[] = JSON.parse(content);

        array.forEach(data=>{
            this.tareas.push(Task.fromJson(data));
        });

    }


    async Agregar(desc: string): Promise<Task | undefined> {
        const newTask = new Task({
            completado:false,
            id: obtenerId(),
            nombre:desc,
            fechaCompletado:undefined
        })

        if(this.tareas.push(newTask) > 0){
            return newTask;
        }else{
            return undefined;
        }
    }
    Obtener(): Task[] {
        return this.tareas;
    }
    ObtenerId(id: string): Task | undefined {
        return this.tareas.find(tarea => tarea.id == id)
    }
    ObtenerCompletadas(): Task[] | undefined{
        return this.tareas.filter(tarea => tarea.completado);
    }
    Completar(id:string):boolean {

        const task = this.ObtenerId(id);

        if(task == undefined){
            return false;
        }

        if(!task.completado){
            task.completado = true;
            task.fechaCompletado = new Date();
        }
        return true;
    }
    CompletarTareas(ids: string[]): boolean {
        let completados = true;
        ids.forEach(id=>{
            if(!this.Completar(id)){
                completados = false;
            }
        })
        return completados;
    }
    QuitarCompletado(id: string): boolean {
        const task = this.ObtenerId(id);

        if(task == undefined){
            return false;
        }

        if(task.completado){
            task.completado = false;
            task.fechaCompletado = undefined;
        }
        return true;
    }
    QuitarCompletados(ids: string[]): boolean {
        throw new Error("Method not implemented.");
    }


    Eliminar(id: string): boolean {
        
        const tarea:Task | undefined = this.tareas.find(tarea=>tarea.id == id);
        if(!tarea)return false;


        const index = this.tareas.indexOf(tarea);


        return this.tareas.splice(index,1).length > 0;
    
    }
   
}