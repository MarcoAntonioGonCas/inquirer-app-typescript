
export interface TaskDTO {
    id: string;
    nombre: string;
    completado?: boolean;
    fechaCompletado?: Date;
}

export class Task {
    public id: string;
    public nombre: string;
    public completado: boolean;
    public fechaCompletado?: Date;

    constructor(taskData: TaskDTO) {
        const {id,nombre,completado = false,fechaCompletado = undefined} = taskData
        this.id = id;
        this.nombre = nombre;
        this.completado = completado;
        this.fechaCompletado = fechaCompletado;
    }

    static fromJson(data:any):Task{
        const {id,nombre,completado = undefined,fechaCompletado=undefined} = data;

        return new Task({
            id,
            nombre,
            completado,
            fechaCompletado:fechaCompletado == undefined?undefined: new Date(fechaCompletado)
        })
    }

    toString():string{
        const fecha = this.fechaCompletado == undefined ? "" : this.fechaCompletado.toLocaleString(undefined,{
            day:"2-digit",
            month:"2-digit",
            year:"numeric",
            hour:"2-digit",
            minute:"2-digit",
            second:"2-digit",
            hour12:true
        })
        return `${this.nombre} ${(this.completado ?"Completado":"")} ${fecha}`;
    }
}