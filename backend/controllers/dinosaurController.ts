import { Context } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { DinosaurService } from "../services/dinosaurService.ts";

const dinosaurService = new DinosaurService();

export class DinosaurController {
  async getAll(context: Context) {
    context.response.body = await dinosaurService.getAllDinosaurs();
  }

  async getOne(context: Context) {
    const { id } = context.params;
    context.response.body = await dinosaurService.getDinosaurById(Number(id));
  }

  async create(context: Context) {
    const { name, description } = await context.request.body("json").value;
    context.response.body = await dinosaurService.createDinosaur({ name, description });
  }

  async delete(context: Context) {
    const { id } = context.params;
    context.response.body = await dinosaurService.deleteDinosaur(Number(id));
  }
} 
