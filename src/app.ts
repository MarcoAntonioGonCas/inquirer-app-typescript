import { TaskDatasource } from "./domain/datasource/task.datasource.js";
import { TaskMemory } from "./infraestructure/datasource/task-memory.datasource.js";
import { InquirerApp } from "./presentation/console/inqurerConsole.js";

const taskMemory:TaskDatasource = new TaskMemory();



(async ()=>{
    main()
})()


async function main() {
    await new InquirerApp(
        taskMemory
    ).iniciar();
}