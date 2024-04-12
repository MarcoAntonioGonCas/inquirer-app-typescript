
import inquirer from "inquirer";

export class InquirerMethods{
    public static limpiar(){
        console.clear()
    }
    public static mostrarMensaje(mensaje:string){
        console.log(mensaje)
    }

    public static mostrarDatos<T>(datos:T[]){
        datos.forEach(dato=>{
            console.log(dato);
        })
    }

    public static async mostrarLista(name:string,message:string,choices:any[]):Promise<any> {
        
        const resp = await inquirer.prompt({
            type:"list",
            name,
            message,
            choices
        })

        return resp[name]
    }

    public static async mostrarCheck(name:string,message:string,choices:any[]):Promise<any>{
        const resp = await inquirer.prompt({
            type:"checkbox",
            name,
            message,
            choices
        })

        return resp[name]
    }

    public static async leerInput(message:string):Promise<string>{

        const resp = await inquirer.prompt({
            type:"input",
            name:"resultado",
            message
        })

        return resp.resultado as string
    }
    public static async pausa(message = "Presiona cualquier tecla para continuar"){
        await inquirer.prompt({
            type:"input",
            name:"pausa",
            message
        })
    }
}