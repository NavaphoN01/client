import Image from "../Models/Model_image";
import { IRepository } from "./IRepository";
import { userData } from "../helper";
import conf from "../conf";

const user = userData()


export class ImageRepository implements IRepository <Image> {
    urlPrefix = `${conf.apiPrefix}/api/images?populate=*`
    token = user.jwt

    async getAll(): Promise<Image[] | null> {
        const resp = await fetch(`${this.urlPrefix}`);
        const data = await resp.json();
        return Array.isArray(data.data) ? data.data : null;
      }
      
      async get(id: string): Promise<Image[] | null> {
        const resp = await fetch(`${this.urlPrefix}&filters[id][$eq]=${id}`);
        const data = await resp.json();
        return Array.isArray(data.data) ? data.data : null;
      }
      
      async delete(id: string): Promise<Image[] | null> {
        const resp = await fetch(`${conf.apiPrefix}/api/images/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
        });
        const data = await resp.json();
        return Array.isArray(data.data) ? data.data : null;
      }
      
}